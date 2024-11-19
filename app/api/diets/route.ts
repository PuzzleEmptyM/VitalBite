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
    console.log("Fetching diets...");

    // SQL qu ery to fetch all diet types
    const result = await runSQL("SELECT * FROM diet_types");

    // Check if any results were returned
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No diets found" }, { status: 404 });
    }

    // Return the fetched diet types as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching diets:", error);
    return NextResponse.json(
      { error: "Failed to fetch diets" },
      { status: 500 }
    );
  }
};
