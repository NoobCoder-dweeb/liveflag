/* Create database table automatically */
import sql from "./db.js";

export const initDb = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS flags (
            id SERIAL PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            description TEXT,
            enabled BOOLEAN DEFAULT false,
            environment TEXT DEFAULT 'dev',
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;

    console.log("Database intialised");
};
