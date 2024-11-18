import { auth } from "@/auth";
import { fetchActivities } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/activities
 */
export const GET = auth(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;

  //@ts-ignore
  if (!req.auth) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  const {
    user: { email }, //@ts-ignore
  } = req.auth;

  const activities = await fetchActivities(page, email);
  return NextResponse.json({ activities });
});
