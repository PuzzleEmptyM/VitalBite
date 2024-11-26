import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function runSQL(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

// Handler: Get Condition Info by dietId
// Usage: GET /api/conditions?dietId=<dietId>
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const dietId = searchParams.get("dietId");

    if (!dietId) {
      return NextResponse.json({ error: "dietId is required" }, { status: 400 });
    }

    const query = `
      SELECT * FROM "understanding_conditions"
      WHERE "dietId" = $1
    `;
    const result = await runSQL(query, [dietId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No condition found for the given dietId" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching condition:", error);
    return NextResponse.json({ error: "Failed to fetch condition" }, { status: 500 });
  }
};
