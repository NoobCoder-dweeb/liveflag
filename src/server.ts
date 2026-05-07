import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config()

const app = Fastify({
    logger: true
});

await app.register(cors);

app.get("/health", async () => {
    return {
        status: "ok",
        service: "liveflag",
    };
});

const port = Number(process.env.PORT ?? 3000);

await app.listen({
    port,
    host: "0.0.0.0"
})