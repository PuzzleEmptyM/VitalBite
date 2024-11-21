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
// API ROUTE TO FETCH CHAT CONTEXT BY UID
// --------------------------------------------
// This API route fetches all chat data associated with a given UID.
// Example Usage:
// - Request: GET /api/context?uid=<uid>
// - Example: GET /api/context?uid=1
// - Response (Success):
//   [
//     {
//       "chatId": 1,
//       "uid": 1,
//       "userQuestion": "Can I eat broccoli?",
//       "chatResponse": "Yes, but only steamed",
//       "recipeId": null,
//       "tipId": null,
//       "timestamp": "2024-11-18T10:00:00.000Z"
//     },
//     ...
//   ]
// - Response (No Chats Found):
//   { "message": "No chats found for the specified UID" }
// - Response (Error):
//   { "error": "Failed to fetch chat data" }

export const GET = async (req: Request) => {
  try {
    console.log("Fetching chat context by UID...");
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    // Validate UID
    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    console.log(`Fetching chat context for UID: ${uid}`);

    // SQL query to fetch all chat data for the given UID
    const query = `
      SELECT 
        "chatId", 
        "uid", 
        "userQuestion", 
        "chatResponse", 
        "recipeId", 
        "tipId", 
        "timestamp" 
      FROM "context"
      WHERE "uid" = $1
    `;
    const result = await runSQL(query, [uid]);

    // Check if any results were returned
    if (result.rows.length === 0) {
      console.log(`No chats found for UID: ${uid}`);
      return NextResponse.json(
        { message: "No chats found for the specified UID" },
        { status: 404 }
      );
    }

    console.log("Chat context fetched successfully:", result.rows);
    // Return the fetched chat data as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching chat context:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat context" },
      { status: 500 }
    );
  }
};
