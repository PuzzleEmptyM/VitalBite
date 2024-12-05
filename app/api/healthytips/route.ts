import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Connection pool for PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Function to execute SQL queries
async function runSQL(query: string, params: any[] = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error('Error running query:', error);
    throw error;
  } finally {
    client.release();
  }
}

// API Route: GET /api/healthytips?dietId=<dietId>
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const dietId = searchParams.get('dietId');

  if (!dietId) {
    return NextResponse.json({ error: 'Diet ID (dietId) is required' }, { status: 400 });
  }

  try {
    // Fetch healthy tips for the given dietId
    const query = `
      SELECT "healthyTipId", "dietId", "tip", "title"
      FROM "healthy_tips"
      WHERE "dietId" = $1
    `;
    const result = await runSQL(query, [dietId]);

    // Ensure the response is always an array
    const tips = Array.isArray(result.rows) ? result.rows : [result.rows];

    // Return the healthy tips as JSON
    return NextResponse.json(tips);
  } catch (error) {
    console.error('Error fetching healthy tips:', error);
    return NextResponse.json({ error: 'Failed to fetch healthy tips' }, { status: 500 });
  }
};
