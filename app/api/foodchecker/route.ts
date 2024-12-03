import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   console.log("POST request received at /api/chatbot");
//   return NextResponse.json({ message: "API route is working" });
// }

// Google Cloud Function URL
const cloudFunctionUrl = "https://vitalbite2-335404116403.us-central1.run.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, uid }: { message: string; uid?: string } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing UID" }, { status: 400 });
    }

    const payload = { uid, message };

    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

