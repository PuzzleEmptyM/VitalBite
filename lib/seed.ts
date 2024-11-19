import { Pool } from 'pg';

// Create a connection pool for your Vercel PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function runSQL(query: string) {
  const client = await pool.connect();
  try {
    await client.query(query);
  } finally {
    client.release();
  }
}

// Seed the database
export async function seedDatabase() {
  await runSQL(`
    CREATE TABLE IF NOT EXISTS users (
      uid SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS diet_types (
      dietId SERIAL PRIMARY KEY,
      dietName TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS user_preferences (
      preferenceId SERIAL PRIMARY KEY,
      uid INT NOT NULL REFERENCES users(uid),
      dietId INT NOT NULL REFERENCES diet_types(dietId)
    );
    CREATE TABLE IF NOT EXISTS user_context (
      chatId SERIAL PRIMARY KEY,
      uid INT NOT NULL REFERENCES users(uid),
      userQuestion TEXT NOT NULL,
      chatResponse TEXT NOT NULL,
      recipeId INT REFERENCES recipes(recipeId) ON DELETE SET NULL,
      tipId INT REFERENCES tips(tipId) ON DELETE SET NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS recipes (
      recipeId SERIAL PRIMARY KEY,
      uid INT NOT NULL REFERENCES users(uid),
      recipeName TEXT NOT NULL,
      ingredients JSONB NOT NULL,
      instructions TEXT NOT NULL,
      prepTime INT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tips (
      tipId SERIAL PRIMARY KEY,
      uid INT NOT NULL REFERENCES users(uid),
      tip TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed data
  await runSQL(`
    INSERT INTO users (email, password) VALUES
      ('bob@example.com', 'hashed_password'),
      ('taylor@example.com', 'hashed_password');
  `);
  await runSQL(`
    INSERT INTO diet_types (dietName) VALUES
      ('GlutenFree'),
      ('LowFODMAP'),
      ('Mediterranean'),
      ('DASH'),
      ('Anti-inflammatory'),
      ('LowCal-LowFat');
  `);
}
