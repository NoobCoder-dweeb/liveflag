import {FastifyInstance} from "fastify";
import sql from "../db.js";
import { request } from "node:http";

export async function flagRoutes(app: FastifyInstance) {
    app.post("/flags", async (request, reply) => {
        const body = request.body as {
            key: string;
            description?: string;
        };

        const result = await sql`
            INSERT INTO flags (key, description)
            VALUES (${body.key}, ${body.description ?? null})
            RETURNING *
        `;

        return reply.status(201).send(result[0]);
    });
}