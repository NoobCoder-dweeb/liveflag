import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import { initDb } from "./init-db.js";
import { flagRoutes } from "./routes/flags.js";

dotenv.config()

const start = async ()=> {
    const app = Fastify({
        logger: true
    });
    
    await app.register(cors);

    await initDb();
    
    app.get("/health", async () => {
        return {
            status: "ok",
            service: "liveflag",
        };
    });
    
    const port = Number(process.env.PORT ?? 3000);
    
    // register routes
    await app.register(flagRoutes);

    await app.listen({
        port,
        host: "0.0.0.0"
    });
};

start();