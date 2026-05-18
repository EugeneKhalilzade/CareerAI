import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

await sql`
  CREATE TABLE IF NOT EXISTS "calendarEvent" (
    "id"        serial PRIMARY KEY,
    "title"     varchar NOT NULL,
    "notes"     text,
    "date"      varchar NOT NULL,
    "time"      varchar,
    "type"      varchar NOT NULL,
    "userEmail" varchar NOT NULL,
    "createdAt" varchar
  )
`;

console.log('✅  calendarEvent table created (or already exists).');
