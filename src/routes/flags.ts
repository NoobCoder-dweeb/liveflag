import { FastifyInstance } from "fastify";
import sql from "../db.js";

function getBucket(input: string): number {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i) | 0);
    }

    return Math.abs(hash) % 100;
}

export async function flagRoutes(app: FastifyInstance) {
    app.post("/flags", async (request, reply) => {
        const body = request.body as {
            key: string;
            description?: string;
            environment?: string;
            rolloutPercentage?: number;
        };

        const result = await sql`
            INSERT INTO flags (key, description, environment, rollout_percentage)
            VALUES (
            ${body.key}, 
            ${body.description ?? null},
            ${body.environment ?? "dev"},
            ${body.rolloutPercentage ?? 100}
            )
            RETURNING *
        `;

        return reply.status(201).send(result[0]);
    });

    app.get("/flags", async () => {
        const flags = await sql`
            SELECT *
            FROM flags
            ORDER BY created_at DESC
        `;

        return flags;
    });

    app.patch("/flags/:key/toggle", async (request, reply) => {
        const params = request.params as {
            key: string;
        };

        const existing = await sql`
            SELECT * 
            FROM flags
            WHERE key = ${params.key}
            LIMIT 1 
        `;

        if (existing.length === 0) {
            return reply.status(404).send({
                error: "Flag not found",
            });
        }

        const oldValue = existing[0].enabled;
        const newValue = !oldValue;

        const updated = await sql`
            UPDATE flags
            SET enabled = ${newValue}
            WHERE key = ${params.key}
            RETURNING *
        `;


        await sql`
            INSERT INTO audit_logs (
                flag_key,
                action,
                old_value,
                new_value,
                changed_by
            )
            VALUES (
                ${params.key},
                'toggle',
                ${oldValue},
                ${newValue},
                'syste,'
            )
        `;

        return updated[0];
    });

    app.get("/evaluate/:key", async (request, reply) => {
        const params = request.params as {
            key: string;
        };

        const query = request.query as {
            environment?: string;
            userId?: string;
        };

        const result = await sql`
            SELECT *
            FROM flags
            WHERE key = ${params.key}
            AND environment = ${query.environment ?? "dev"}
            LIMIT 1
        `;

        if (result.length === 0) {
            return reply.status(404).send({
                key: params.key,
                enabled: false,
                reason: "Flag not found",
            });
        }

        const flag = result[0];

        if (!flag.enabled) {
            return {
                key: flag.key,
                enabled: false,
                environment: flag.environment,
                reason: "Flag is disabled",
            };
        }

        const rolloutPercentage = flag.rolloutPercentage ?? 100;

        if (!query.userId) {
            return {
                key: flag.key,
                enabled: rolloutPercentage > 0,
                environment: flag.environment,
                rolloutPercentage,
                reason: "No userId provided",
            };
        }

        const bucket = getBucket(`${flag.key}:${query.userId}`);
        const enabled = bucket < rolloutPercentage;

        return {
            key: flag.key,
            enabled,
            environment: flag.environment,
            rolloutPercentage,
            userId: query.userId,
            bucket,
            reason: enabled ? "User is included in rollout" : "User is outside rollout",
        };
    });

    app.get("/audit-logs", async () => {
        const logs = await sql`
            SELECT * 
            FROM audit_logs
            ORDER BY created_at DESC
        `;

        return logs;
    });
}