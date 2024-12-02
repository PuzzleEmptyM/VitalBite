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
// API ROUTE TO FETCH DO'S AND DON'TS BY DIET ID
// --------------------------------------------
// This API route fetches "do_items" and "dont_items" for a specific diet based on dietId.
//
// Example Usage:
// - Request: GET /api/dosanddonts?dietId=<dietId>
// - Example: GET /api/dosanddonts?dietId=1
// - Response (Success):
//   {
//     "do_items": ["Eat fruits", "Drink water"],
//     "dont_items": ["Avoid gluten", "Limit sugar"]
//   }
// - Response (No Data Found):
//   { "message": "No do's and don'ts found for the specified dietId" }
// - Response (Error):
//   { "error": "Failed to fetch do's and don'ts" }

export const GET = async (req: Request) => {
  try {
    console.log("Fetching do's and don'ts by dietId...");
    const { searchParams } = new URL(req.url);
    const dietId = searchParams.get("dietId");

    // Validate dietId
    if (!dietId) {
      console.error("dietId not provided");
      return NextResponse.json({ error: "dietId is required" }, { status: 400 });
    }

    console.log(`Fetching do's and don'ts for dietId: ${dietId}`);

    // SQL query to fetch do_items and dont_items by dietId
    const query = `
      SELECT "do_items", "dont_items"
      FROM "dos_and_donts"
      WHERE "dietId" = $1
    `;
    const result = await runSQL(query, [dietId]);

    // Check if any results were returned
    if (result.rows.length === 0) {
      console.log(`No do's and don'ts found for dietId: ${dietId}`);
      return NextResponse.json(
        { message: "No do's and don'ts found for the specified dietId" },
        { status: 404 }
      );
    }

    console.log("Do's and don'ts fetched successfully:", result.rows[0]);
    // Return the fetched do_items and dont_items as a JSON response
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching do's and don'ts:", error);
    return NextResponse.json(
      { error: "Failed to fetch do's and don'ts" },
      { status: 500 }
    );
  }
};
