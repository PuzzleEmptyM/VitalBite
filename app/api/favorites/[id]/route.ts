import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/favorites/:id
 */
export const POST = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;

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

    const exists = await favoriteExists(id, email);
    if (exists) {
      return NextResponse.json({ message: "Already favorited" });
    }

    await insertFavorite(id, email);
    return NextResponse.json({ message: "Favorite Added" });
  }
);

/**
 * DELETE /api/favorites/:id
 */
export const DELETE = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;

    const {
      user: { email }, //@ts-ignore
    } = req.auth;

    await deleteFavorite(id, email);
    return NextResponse.json({ message: "Favorite removed" });
  }
);
