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
// API ROUTE TO FETCH USER DATA
// --------------------------------------------
// Handles different query parameters:
// - GET /api/users?uid=<uid> - Fetch a user by UID
// - GET /api/users?uid=<uid>&field=<field> - Fetch specific field of a user by UID
// - GET /api/users?email=<email> or GET /api/users?username=<username> - Fetch user by email or username
// - GET /api/users - Fetch all users
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const field = searchParams.get("field");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    // Fetch user by UID (entire record)
    if (uid && !field && !email && !username) {
      console.log(`Fetching user by UID: ${uid}`);
      const query = `
        SELECT "uid", "email", "username"
        FROM "users"
        WHERE "uid" = $1
      `;
      const result = await runSQL(query, [uid]);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Fetch specific field for user by UID
    if (uid && field) {
      if (!["email", "username"].includes(field)) {
        return NextResponse.json(
          { error: "Invalid field. Only 'email' or 'username' are allowed." },
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

      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "Field not found or unavailable for the specified UID" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }


    // Fetch user by email or username
    if (email || username) {
      let query = `
        SELECT "uid", "email", "username"
        FROM "users"
        WHERE `;
      const params = [];

      if (email) {
        query += `"email" = $1`;
        params.push(email);
      } else if (username) {
        query += `"username" = $1`;
        params.push(username);
      }

      console.log(`Fetching user by ${email ? "email" : "username"}...`);
      const result = await runSQL(query, params);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Fetch all users
    console.log("Fetching all users...");
    const query = `
      SELECT "uid", "email", "username"
      FROM "users"
    `;
    const result = await runSQL(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    console.log("All users fetched successfully:", result.rows);
    return NextResponse.json(result.rows);
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
    const { email, password, username, diets } = body;

    // Check if the required fields are provided
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
    const userId = newUser.rows[0].uid;

    // Insert user preferences (selected diets)
    if (diets && Array.isArray(diets) && diets.length > 0) {
      // Create an array of parameters for the diets and userId
      const preferenceValues = diets.map((dietId, index) => `($1, $${index + 2})`).join(", ");
      const insertPreferencesQuery = `
        INSERT INTO "userpreference" ("uid", "dietId")
        VALUES ${preferenceValues}
      `;
      const preferenceParams = [userId, ...diets];

      await runSQL(insertPreferencesQuery, preferenceParams);
    }

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
