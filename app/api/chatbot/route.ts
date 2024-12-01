import { NextRequest, NextResponse } from "next/server";
import { useSession } from "next-auth/react";

// export async function POST(req: NextRequest) {
//   console.log("POST request received at /api/chatbot");
//   return NextResponse.json({ message: "API route is working" });
// }

// Google Cloud Function URL
const cloudFunctionUrl = "https://function-2-335404116403.us-central1.run.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message }: { message: string } = body;

    const { data: session } = useSession(); // Get session data
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const uid = session.user.id; // Extract the user's ID from the session

    const payload = { uid, message };

    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return NextResponse.json(
        { error: "Failed to call Google Cloud Function" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Ensure the result has the expected structure
    if (!result.message || typeof result.message !== "string") {
      throw new Error("Invalid response format from Cloud Function");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
