import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

// API Route handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message }: { message: string } = body; // Type the input message
    const uid = 1; // Static UID for now

    // Prepare the input for the Python script
    const input = JSON.stringify({ uid, message });

    // Spawn the Python process, referencing the correct file path 'chatBot.py'
    const pythonProcess = spawn("python3", ["app/api/chatbot/chatbot.py"], {
      env: { ...process.env }, // Pass existing Node.js environment to Python
    });

    // Send input to Python script
    pythonProcess.stdin.write(input);
    pythonProcess.stdin.end();

    let result = "";

    // Collect the data from Python stdout
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    // Collect any errors from Python stderr
    pythonProcess.stderr.on("data", (data) => {
      console.error("Error:", data.toString());
    });

    // Handle the closing of the process
    return new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            // Parse the JSON response from Python
            const output = JSON.parse(result);
            resolve(NextResponse.json(output)); // Send the response back to the frontend
          } catch (error) {
            console.error("Failed to parse Python response:", error);
            reject(
              NextResponse.json(
                { error: "Error processing response from Python." },
                { status: 500 }
              )
            );
          }
        } else {
          console.error(`Python process exited with code ${code}`);
          reject(
            NextResponse.json({ error: "Python process failed" }, { status: 500 })
          );
        }
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
