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

    await sql`
        CREATE TABLE IF NOT EXISTS audit_logs(
            id SERIAL PRIMARY KEY,
            flag_key TEXT NOT NULL,
            action TEXT NOT NULL,
            old_value BOOLEAN,
            new_value BOOLEAN,
            changed_by TEXT DEFAULT 'system',
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;

    console.log("Database intialised");
};
