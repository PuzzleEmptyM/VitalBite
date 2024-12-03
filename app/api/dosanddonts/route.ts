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
  console.log("Connected to the database");

  try {
    const result = await client.query(query, params); // Execute the query
    return result;
  } catch (error) {
    console.error("Error running query:", error);
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// API route to fetch do's and don'ts for all diet preferences of the logged-in user
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Fetch dietIds associated with the user from userpreference
    const dietQuery = `
      SELECT "dietId" FROM "userpreference" WHERE "uid" = $1
    `;
    const dietResult = await runSQL(dietQuery, [uid]);

    if (dietResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No diet preferences found for this user" },
        { status: 404 }
      );
    }

    const dietIds = dietResult.rows.map((row: { dietId: number }) => row.dietId);

    // Now fetch do's and don'ts for these dietIds along with the diet name
    const dosAndDontsQuery = `
      SELECT 
        "do_items", 
        "dont_items", 
        "dos_and_donts"."dietId", 
        "diettype"."dietName"
      FROM "dos_and_donts"
      JOIN "diettype" ON "dos_and_donts"."dietId" = "diettype"."dietId"
      WHERE "dos_and_donts"."dietId" = ANY($1)
    `;
    const dosAndDontsResult = await runSQL(dosAndDontsQuery, [dietIds]);

    if (dosAndDontsResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No do's and don'ts found for the user's diet preferences" },
        { status: 404 }
      );
    }

    return NextResponse.json(dosAndDontsResult.rows);
  } catch (error) {
    console.error("Error fetching do's and don'ts:", error);
    return NextResponse.json(
      { error: "Failed to fetch do's and don'ts" },
      { status: 500 }
    );
  }
};
