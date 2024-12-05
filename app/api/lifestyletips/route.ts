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
  } catch (error) {
    console.error("Error running query:", error);
    throw error;
  } finally {
    client.release();
  }
}

// API route to fetch or delete lifestyle tips
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

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

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const tipId = searchParams.get("tipId");

    if (!tipId) {
      console.error("Tip ID not provided");
      return NextResponse.json({ error: "Tip ID is required" }, { status: 400 });
    }

    const deleteQuery = `
      DELETE FROM "tip"
      WHERE "tipId" = $1
    `;
    const result = await runSQL(deleteQuery, [tipId]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "No tip found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tip deleted successfully" });
  } catch (error) {
    console.error("Error deleting tip:", error);
    return NextResponse.json(
      { error: "Failed to delete the tip" },
      { status: 500 }
    );
  }
};
