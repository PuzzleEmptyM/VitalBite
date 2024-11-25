// import { NextResponse } from "next/server";
// import { spawn } from "child_process";
// import path from "path";

// // Function to run Python script with a uid parameter
// async function runPythonScript(uid: string) {
//   return new Promise<string>((resolve, reject) => {
//     // Define the path to the Python script
//     const scriptPath = path.join(process.cwd(), "app", "scripts", "hello.py");

//     // Spawn a new process to run the Python script and pass the uid as an argument
//     const python = spawn("python3", [scriptPath, uid], {
//       env: {
//         POSTGRES_USER: process.env.POSTGRES_USER,
//         POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
//         POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
//         POSTGRES_HOST: process.env.POSTGRES_HOST,
//         ...process.env, // Include all other environment variables
//       },
//     });

//     console.log("Environment Variables:", process.env);
    

//     let data = "";
//     let errorData = "";

//     // Capture the output from the Python script
//     python.stdout.on("data", (chunk) => {
//       data += chunk;
//     });

//     // Capture any error messages from the Python script
//     python.stderr.on("data", (chunk) => {
//       console.error(chunk.toString());
//       errorData += chunk;
//     });

//     // Once the script finishes executing
//     python.on("close", (code) => {
//       if (code !== 0) {
//         reject(`Python script error: ${errorData}`);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }

// // API route to trigger Python script with a uid
// export const GET = async (req: Request) => {
//   try {
//     // Extract the 'uid' parameter from the query string
//     const { searchParams } = new URL(req.url);
//     const uid = searchParams.get("uid");

//     // Validate UID
//     if (!uid) {
//       console.error("UID not provided");
//       return NextResponse.json({ error: "UID is required" }, { status: 400 });
//     }

//     // Run the Python script and get the result
//     const result = await runPythonScript(uid);

//     // Parse the result as JSON and send the response
//     const jsonResponse = JSON.parse(result);

//     // Send the response back to the client
//     return NextResponse.json(jsonResponse);
//   } catch (error) {
//     console.error("Error executing Python script:", error);
//     return NextResponse.json({ error: "Failed to execute Python script" }, { status: 500 });
//   }
// };

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Function to run Python script with JSON input
async function runPythonScript(input) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "app", "scripts", "hello.py");

    // Spawn a new Python process
    const python = spawn("python3", [scriptPath], {
      env: { ...process.env }, // Pass environment variables
    });

    let data = "";
    let errorData = "";

    // Send the JSON input to Python via stdin
    python.stdin.write(JSON.stringify(input));
    python.stdin.end();

    // Capture stdout from the Python script
    python.stdout.on("data", (chunk) => {
      data += chunk;
    });

    // Capture stderr from the Python script
    python.stderr.on("data", (chunk) => {
      console.error(chunk.toString());
      errorData += chunk;
    });

    // Handle process exit
    python.on("close", (code) => {
      if (code !== 0) {
        reject(`Python script error: ${errorData}`);
      } else {
        resolve(data);
      }
    });
  });
}

// API route to handle POST requests
export const POST = async (req) => {
  try {
    // Parse the JSON payload from the POST request
    const body = await req.json();

    const { uid, message } = body;

    // Validate input
    if (!uid || !message) {
      return NextResponse.json({ error: "UID and message are required" }, { status: 400 });
    }

    // Run the Python script with the input
    const result = await runPythonScript({ uid, message });

    // Parse the result as JSON and send it back to the client
    const jsonResponse = JSON.parse(result);

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error executing Python script:", error);
    // Include the error message in the response for debugging
    return NextResponse.json({ 
      error: "Failed to execute Python script", 
      details: error.toString() 
    }, { status: 500 });
  }
};

