import { NextResponse } from "next/server";
import { Pool } from "pg";

// Connection pool for Vercel PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Function to execute SQL queries
async function runSQL(query: string, params: any[] = []) {
  const client = await pool.connect();
  console.log("Connected to the database");

  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error("Error running query:", error);
    throw error;
  } finally {
    client.release();
  }
}

// API route to fetch lifestyle tips for the logged-in user
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Fetch lifestyle tips associated with the user
    const tipsQuery = `
      SELECT 
        "tipId", 
        "tip", 
        "summary", 
        "timestamp" 
      FROM "tip"
      WHERE "uid" = $1
      ORDER BY "timestamp" DESC
    `;
    const tipsResult = await runSQL(tipsQuery, [uid]);

    if (tipsResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No lifestyle tips found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(tipsResult.rows);
  } catch (error) {
    console.error("Error fetching lifestyle tips:", error);
    return NextResponse.json(
      { error: "Failed to fetch lifestyle tips" },
      { status: 500 }
    );
  }
};
