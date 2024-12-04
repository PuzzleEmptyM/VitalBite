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

// API route to fetch recipes by UID
export const GET = async (req: Request) => {
  try {
    console.log("Fetching recipes by UID...");
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid"); // Get the 'uid' from the query string

    // Validate UID
    if (!uid) {
      console.error("UID not provided");
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    console.log(`Fetching recipes for UID: ${uid}`);

    // SQL query to fetch recipes by UID
    const query = `
      SELECT * FROM "recipe"
      WHERE "uid" = $1
    `;
    const result = await runSQL(query, [uid]); // Execute the query with the provided UID

    // Check if any results were returned
    if (result.rows.length === 0) {
      console.log(`No recipes found for UID: ${uid}`);
      return NextResponse.json(
        { message: "No recipes found" }, // If no recipes were found, return a message
        { status: 404 }
      );
    }

    console.log("Recipes fetched successfully:", result.rows);
    // Return the fetched recipes as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" }, // If an error occurs, return an error message
      { status: 500 }
    );
  }
};

// API route to delete a recipe by RID and UID
export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const rid = searchParams.get("rid"); // Get 'rid' from query params

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }
    if (!rid) {
      return NextResponse.json({ error: "Recipe ID (rid) is required" }, { status: 400 });
    }

    // Verify that the recipe belongs to the user
    const verifyQuery = `
      SELECT * FROM "recipe"
      WHERE "recipeId" = $1 AND "uid" = $2
    `;
    const verifyResult = await runSQL(verifyQuery, [parseInt(rid, 10), uid]);

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Recipe not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the recipe
    const deleteQuery = `
      DELETE FROM "recipe"
      WHERE "recipeId" = $1 AND "uid" = $2
    `;
    await runSQL(deleteQuery, [rid, uid]);

    return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
};
