import fetch from "node-fetch";

const uid = "2a28b491-44d5-40c5-a824-2d9469ddf9d9"; // Example static UUID
const message = "Please give me a recipe for something with shrimp";

// Google Cloud Function URL
const cloudFunctionUrl = "https://function-2-335404116403.us-central1.run.app";

// Prepare the JSON payload
const payload = { uid, message };

// Send a POST request to the Google Cloud Function
async function callGoogleFunction() {
  try {
    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return;
    }

    const result = await response.json();
    console.log("Response from Google Cloud Function:", result);
  } catch (error) {
    console.error("Failed to call Google Cloud Function:", error.message);
  }
}

// Call the function
callGoogleFunction();

