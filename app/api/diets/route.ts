import { NextResponse } from "next/server";
import { Pool } from "pg";

// Connection pool for Vercel PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Run the SQL query
async function runSQL(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(query, params); // Execute the query
  } finally {
    client.release();
  }
}

// Define the API route
export const GET = async () => {
  try {
    console.log("Fetching diet names...");

    // SQL query to fetch only the DietName column
    const result = await runSQL('SELECT "dietName" FROM "DietType"');

    // Check if any results were returned
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No diet names found" }, { status: 404 });
    }

    // Return the fetched diet names as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching diet names:", error);
    return NextResponse.json(
      { error: "Failed to fetch diet names" },
      { status: 500 }
    );
  }
};
