import { FastifyInstance } from "fastify";

export async function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);

        // extract message
        const message = 
            error instanceof Error
            ? error.message 
            : "Internal Server Error";

        return reply.status(500).send({
            success: false,
            error: message,
        });
    });
}