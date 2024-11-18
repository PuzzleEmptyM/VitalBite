import { fetchGenres } from "@/lib/data";
import { NextResponse } from "next/server";

/**
 * GET /api/genres
 */
export const GET = async () => {
  const genres = await fetchGenres();
  return NextResponse.json({ genres });
};
