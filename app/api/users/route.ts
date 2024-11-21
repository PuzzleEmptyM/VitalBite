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
// API ROUTE TO FETCH USER DATA BY UID
// --------------------------------------------
// This API route fetches specific user data based on UID.
// Example Usage:
// - Request: GET /api/users?uid=<uid>&field=<fieldName>
// - Example: GET /api/users?uid=1&field=email
// - Response (Success):
//   { "uid": 1, "email": "bob@example.com" }
// - Response (Field Not Found):
//   { "message": "Field not found or unavailable for the specified UID" }
// - Response (Error):
//   { "error": "Failed to fetch user data" }

export const GET = async (req: Request) => {
  try {
    console.log("Fetching user data...");
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const field = searchParams.get("field");

    // Validate UID and field
    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }
    if (!field || !["email", "username"].includes(field)) {
      console.error("Invalid or unsupported field requested");
      return NextResponse.json(
        { error: "Valid field (email or username) is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching field "${field}" for UID: ${uid}`);

    // SQL query to fetch specific user field based on UID
    const query = `
      SELECT "uid", "${field}"
      FROM "users"
      WHERE "uid" = $1
    `;
    const result = await runSQL(query, [uid]);

    // Check if any results were returned
    if (result.rows.length === 0 || !result.rows[0][field]) {
      console.log(`Field "${field}" not found or unavailable for UID: ${uid}`);
      return NextResponse.json(
        { message: "Field not found or unavailable for the specified UID" },
        { status: 404 }
      );
    }

    console.log(`User data fetched successfully for UID: ${uid}`, result.rows[0]);
    // Return the fetched user data as a JSON response
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
};
