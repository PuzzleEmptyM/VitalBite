import { getToken } from "next-auth/jwt";
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
  console.log("Request Headers:", req.headers);
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

// --------------------------------------------
// API ROUTE TO SAVE DIET PREFERENCES FOR A USER (POST)
// --------------------------------------------
export const POST = async (req: Request) => {
  console.log("Request Headers:", req.headers);
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    // Validate UID
    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    const { diets } = await req.json();

    // Validate diets array
    if (!diets || !Array.isArray(diets)) {
      return NextResponse.json({ error: "Invalid diets data" }, { status: 400 });
    }

    // Delete existing preferences for the user before adding new ones
    const deleteQuery = `
      DELETE FROM "userpreference"
      WHERE "uid" = $1
    `;
    await runSQL(deleteQuery, [uid]);

    // Insert the new preferences into the database
    if (diets.length > 0) {
      const insertQuery = `
        INSERT INTO "userpreference" ("uid", "dietId")
        VALUES ${diets.map((_, index) => `($1, $${index + 2})`).join(", ")}
      `;
      const params = [uid, ...diets];
      await runSQL(insertQuery, params);
    }

    return NextResponse.json(
      { message: "Preferences saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// --------------------------------------------
// API ROUTE TO DELETE DIET PREFERENCE FOR A SPECIFIC UID AND DIETID
// --------------------------------------------
// This API route deletes a specific diet preference associated with a user (UID).
// Example Usage:
// - Request: DELETE /api/preferences?uid=<uid>&dietId=<dietId>
// - Example: DELETE /api/preferences?uid=1&dietId=5
// - Response (Success):
//   { "message": "Preference deleted successfully" }
// - Response (No Preference Found):
//   { "message": "No matching preference found" }
// - Response (Error):
//   { "error": "Failed to delete preference" }
export const DELETE = async (req: Request) => {
  console.log("Request Headers:", req.headers);
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const dietId = searchParams.get("dietId");

    // Validate UID and dietId
    if (!uid || !dietId) {
      console.error("UID or dietId not provided");
      return NextResponse.json({ error: "UID and dietId are required" }, { status: 400 });
    }

    console.log(`Deleting diet ID: ${dietId} for UID: ${uid}`);

    // SQL query to delete the specific diet preference for the specified UID
    const query = `
      DELETE FROM "userpreference"
      WHERE "uid" = $1 AND "dietId" = $2
    `;
    const result = await runSQL(query, [uid, dietId]);

    // Check if any rows were affected (i.e., a preference was deleted)
    if (result.rowCount === 0) {
      console.log(`No matching preference found for UID: ${uid} and dietId: ${dietId}`);
      return NextResponse.json(
        { message: "No matching preference found" },
        { status: 404 }
      );
    }

    console.log("Preference deleted successfully");
    return NextResponse.json(
      { message: "Preference deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting preference:", error);
    return NextResponse.json(
      { error: "Failed to delete preference" },
      { status: 500 }
    );
  }
};
