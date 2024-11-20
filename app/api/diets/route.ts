import { NextResponse } from "next/server";
import { Pool } from "pg";

// Connection pool for Vercel PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Run the SQL query
async function runSQL(query: string, params: any[] = []) {
  const client = await pool.connect(); // Connect to the pool
  console.log("Connected to the database"); // Log database connection success

  try {
    console.log("Executing query:", query, "with params:", params); // Log the query
    const result = await client.query(query, params); // Execute the query
    console.log("Query result:", result); // Log the result of the query
    return result;
  } catch (error) {
    console.error("Error running query:", error); // Log errors
    throw error; // Re-throw the error for further handling
  } finally {
    client.release(); // Release the client back to the pool
    console.log("Database connection released"); // Log the connection release
  }
}

// API route
export const GET = async () => {
  try {
    console.log("Fetching diets...");

    // SQL query to fetch all diet types
    const result = await runSQL('SELECT * FROM "diettype"');

    // Check if any results were returned
    if (result.rows.length === 0) {
      console.log("No diets found");
      return NextResponse.json({ message: "No diets found" }, { status: 404 });
    }

    console.log("Diets fetched successfully:", result.rows);
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
