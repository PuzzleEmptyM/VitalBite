import { NextResponse } from "next/server";
import { Pool } from "pg";

// Connection pool for Vercel PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Function to execute SQL queries
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

// --------------------------------------------
// API ROUTE TO FETCH DIET IDS FOR A SPECIFIC UID
// --------------------------------------------
// This API route fetches all diet IDs associated with a specific user (UID).
// Example Usage:
// - Request: GET /api/preferences?uid=<uid>
// - Example: GET /api/preferences?uid=1
// - Response (Success):
//   [
//     { "dietId": 1 },
//     { "dietId": 5 }
//   ]
// - Response (No Preferences Found):
//   { "message": "No preferences found" }
// - Response (Error):
//   { "error": "Failed to fetch preferences" }
export const GET = async (req: Request) => {
  try {
    console.log("Fetching diet IDs by UID...");
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    // Validate UID
    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    console.log(`Fetching diet IDs for UID: ${uid}`);

    // SQL query to fetch diet IDs for the specified UID
    const query = `
      SELECT "dietId"
      FROM "userpreference"
      WHERE "uid" = $1
    `;
    const result = await runSQL(query, [uid]);

    // Check if any results were returned
    if (result.rows.length === 0) {
      console.log(`No preferences found for UID: ${uid}`);
      return NextResponse.json(
        { message: "No preferences found" },
        { status: 404 }
      );
    }

    console.log("Preferences fetched successfully:", result.rows);
    // Return the fetched diet IDs as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
};
