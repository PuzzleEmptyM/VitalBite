import { db } from "@vercel/postgres";
import { titles } from "@/seed/titles";

const client = await db.connect();

export function begin() {
  client.sql`BEGIN`;
}

export function commit() {
  client.sql`COMMIT`;
}

export function rollback() {
  client.sql`ROLLBACK`;
}

export async function seedTitles() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS titles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      synopsis VARCHAR(255) NOT NULL,
      released INT NOT NULL,
      genre VARCHAR(255) NOT NULL
    );
  `;

  const insertedTitles = await Promise.all(
    titles.map((title) => {
      try {
        client.sql`
          INSERT INTO titles (id, title, synopsis, released, genre)
          VALUES (${title.id}, ${title.title}, ${title.synopsis}, ${title.released}, ${title.genre})
          ON CONFLICT (id) DO NOTHING;
        `;
      } catch (error) {
        console.log("Error inserting title:", title.id);
        console.log(error);
      }
    })
  );

  return insertedTitles;
}

export async function seedFavorites() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS favorites (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title_id UUID NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      FOREIGN KEY (title_id) REFERENCES titles(id)
    );
  `;
}

export async function seedWatchLater() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS watchLater (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title_id UUID NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      FOREIGN KEY (title_id) REFERENCES titles(id)
    );
  `;
}

export async function seedActivity() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS activities (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT NOW(),
      title_id UUID NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      activity VARCHAR(255) NOT NULL,
      FOREIGN KEY (title_id) REFERENCES titles(id)
    );
  `;
}
