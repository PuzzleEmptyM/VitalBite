import { auth } from "@/auth";
import { fetchGenres, fetchTitles } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/titles
 */
export const GET = auth(async (req: NextRequest) => {
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

  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;
  const minYear = params.get("minYear") ? Number(params.get("minYear")) : 0;
  const maxYear = params.get("maxYear")
    ? Number(params.get("maxYear"))
    : new Date().getFullYear();
  const query = params.get("query") ?? "";
  const genres = params.get("genres")?.split(",") ?? (await fetchGenres());

  const title = await fetchTitles(page, minYear, maxYear, query, genres, email);

  return NextResponse.json({
    title: title,
  });
});
