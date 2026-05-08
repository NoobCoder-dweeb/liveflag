import {FastifyInstance} from "fastify";
import sql from "../db.js";
import { request } from "node:http";

export async function flagRoutes(app: FastifyInstance) {
    app.post("/flags", async (request, reply) => {
        const body = request.body as {
            key: string;
            description?: string;
            environment?: string;
        };

        const result = await sql`
            INSERT INTO flags (key, description, environment)
            VALUES (
            ${body.key}, 
            ${body.description ?? null},
            ${body.environment ?? "dev"}
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
    });

    app.patch("/flags/:key/toggle", async (request, reply) => {
        const params = request.params as {
            key: string;
        };

        const result = await sql`
            UPDATE flags
            SET enabled = NOT enabled
            WHERE key = ${params.key}
            RETURNING *
        `;

        if (result.length === 0){
            return reply.status(404).send({
                error: "Flag not found",
            });
        } 

        return result[0];
    });

    app.get("/evaluate/:key", async (request, reply) => {
        const params = request.params as {
            key: string;
        };

        const query = request.query as {
            environment?: string;
        };

        const result = await sql`
            SELECT *
            FROM flags
            WHERE key = ${params.key}
            AND environment = ${query.environment ?? "dev"}
            LIMIT 1
        `;

        if (result.length === 0){
            return reply.status(404).send({
                key: params.key,
                enabled: false,
                reason: "Flag not found",
            });
        }

        return {
            key: result[0].key,
            enabled: result[0].enabled,
            environment: result[0].environment,
            reason: result[0].enabled ? "Flag is enabled" : "Flag is disabled",
        };
    }); 
}