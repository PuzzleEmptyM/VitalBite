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

