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

// -------------------------
// API ROUTES
// -------------------------

// 1. Get All Diet Types
// Usage: GET /api/diets
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  // Determine which route to handle based on the query parameters
  if (searchParams.has("dietId")) {
    return getDietTypeById(req); // Call handler for getting diet type by dietId
  } else if (searchParams.has("uid")) {
    return getDietIdsByUid(req); // Call handler for getting dietIds by uid
  } else {
    return getAllDietTypes(); // Default to getting all diet types
  }
};

// Handler: Get All Diet Types
async function getAllDietTypes() {
  try {
    console.log("Fetching all diet types...");

    // SQL query to fetch all diet types
    const result = await runSQL('SELECT * FROM "diettype"');

    if (result.rows.length === 0) {
      console.log("No diet types found");
      return NextResponse.json({ message: "No diet types found" }, { status: 404 });
    }

    console.log("Diet types fetched successfully:", result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching diet types:", error);
    return NextResponse.json(
      { error: "Failed to fetch diet types" },
      { status: 500 }
    );
  }
}

// Handler: Get Diet Type by dietId
// Usage: GET /api/diets?dietId=<dietId>
async function getDietTypeById(req: Request) {
  try {
    console.log("Fetching diet type by dietId...");
    const { searchParams } = new URL(req.url);
    const dietId = searchParams.get("dietId");

    if (!dietId) {
      console.error("dietId not provided");
      return NextResponse.json({ error: "dietId is required" }, { status: 400 });
    }

    console.log(`Fetching diet type for dietId: ${dietId}`);
    const query = 'SELECT * FROM "diettype" WHERE "dietId" = $1';
    const result = await runSQL(query, [dietId]);

    if (result.rows.length === 0) {
      console.log(`No diet type found for dietId: ${dietId}`);
      return NextResponse.json({ message: "Diet type not found" }, { status: 404 });
    }

    console.log("Diet type fetched successfully:", result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching diet type:", error);
    return NextResponse.json(
      { error: "Failed to fetch diet type" },
      { status: 500 }
    );
  }
}

// Handler: Get dietIds by uid
// Usage: GET /api/diets?uid=<uid>
async function getDietIdsByUid(req: Request) {
  try {
    console.log("Fetching dietIds by uid...");
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    console.log(`Fetching dietIds for uid: ${uid}`);
    const query = 'SELECT "dietId" FROM "userpreference" WHERE "uid" = $1';
    const result = await runSQL(query, [uid]);

    if (result.rows.length === 0) {
      console.log(`No dietIds found for uid: ${uid}`);
      return NextResponse.json({ message: "No dietIds found" }, { status: 404 });
    }

    console.log("DietIds fetched successfully:", result.rows);
    return NextResponse.json(result.rows.map(row => row.dietId));
  } catch (error) {
    console.error("Error fetching dietIds:", error);
    return NextResponse.json(
      { error: "Failed to fetch dietIds" },
      { status: 500 }
    );
  }
}
