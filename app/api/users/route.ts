import { NextResponse } from "next/server";
import { Pool } from "pg";
import { hash } from "bcryptjs";

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
// API ROUTE TO FETCH USER DATA BY UID
// --------------------------------------------
// This API route fetches specific user data based on UID.
// Example Usage:
// - Request: GET /api/users?uid=<uid>&field=<fieldName>
// - Example: GET /api/users?uid=1&field=email
// - Response (Success):
//   { "uid": 1, "email": "bob@example.com" }
// - Response (Field Not Found):
//   { "message": "Field not found or unavailable for the specified UID" }
// - Response (Error):
//   { "error": "Failed to fetch user data" }

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const field = searchParams.get("field");

    // Check if the request is to get a specific user or all users
    if (uid && field) {
      // Handle fetching specific user data by UID and field
      if (!["email", "username"].includes(field)) {
        console.error("Invalid or unsupported field requested");
        return NextResponse.json(
          { error: "Valid field (email or username) is required" },
          { status: 400 }
        );
      }

      console.log(`Fetching field "${field}" for UID: ${uid}`);

      const query = `
        SELECT "uid", "${field}"
        FROM "users"
        WHERE "uid" = $1
      `;
      const result = await runSQL(query, [uid]);

      if (result.rows.length === 0 || !result.rows[0][field]) {
        return NextResponse.json(
          { message: "Field not found or unavailable for the specified UID" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } else {
      // Handle fetching all users and their linked information
      console.log("Fetching all users and their linked information...");

      const query = `
        SELECT "uid", "email", "username"
        FROM "users"
      `;
      const result = await runSQL(query);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "No users found" },
          { status: 404 }
        );
      }

      console.log("All users fetched successfully:", result.rows);
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
};

// --------------------------------------------
// API ROUTE TO SIGN UP A NEW USER (POST REQUEST)
// --------------------------------------------
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const checkUserQuery = `
      SELECT "uid"
      FROM "users"
      WHERE "email" = $1
    `;
    const existingUser = await runSQL(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = `
      INSERT INTO "users" ("email", "username", "password")
      VALUES ($1, $2, $3)
      RETURNING "uid", "email", "username"
    `;
    const newUser = await runSQL(insertUserQuery, [email, username, hashedPassword]);

    return NextResponse.json(
      { message: "User created successfully", user: newUser.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
