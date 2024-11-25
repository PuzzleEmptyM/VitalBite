const { spawn } = require("child_process");

const uid = 1; // Example static UID
const message = "Can you give me an example of communicating clearly to a waiter?";

// JSON input for the Python script
const input = JSON.stringify({uid, message});

// Spawn the Python process
const pythonProcess = spawn("python3", ["../chatBot/chatbot.py"], {
    env: { ...process.env } // Pass existing Node.js environment to Python
});

// Send input to the Python script
pythonProcess.stdin.write(input);
pythonProcess.stdin.end();

// Listen for data from Python stdout
let result = "";

pythonProcess.stdout.on("data", (data) => {
  result += data.toString();
});

// Listen for errors from Python stderr
pythonProcess.stderr.on("data", (data) => {
  console.error("Error:", data.toString());
});

// Handle the close event when the process ends
pythonProcess.on("close", (code) => {
  if (code === 0) {
    try {
      // Parse and log the Python script's JSON output
      const output = JSON.parse(result);
      console.log("Response from Python:", output);
    } catch (error) {
      console.error("Failed to parse JSON:", error.message);
    }
  } else {
    console.error(`Python process exited with code ${code}`);
  }
});
