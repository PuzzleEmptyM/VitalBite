import { sql } from "@vercel/postgres";
import { Question, User } from "./definitions";
import { db } from "./db";

/**
 * Query all titles
 */
export async function fetchTitles(
  page: number,
  minYear: number,
  maxYear: number,
  query: string,
  genres: string[],
  userEmail: string
) {
  try {
    // Get favorites title ids
    const favorites = (
      await db
        .selectFrom("favorites")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    // Get watch later title ids
    const watchLater = (
      await db
        .selectFrom("watchlater")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    //Fetch titles
    const titles = await db
      .selectFrom("titles")
      .selectAll("titles")
      .where("titles.released", ">=", minYear)
      .where("titles.released", "<=", maxYear)
      .where("titles.title", "ilike", `%${query}%`)
      .where("titles.genre", "in", genres)
      .orderBy("titles.title", "asc")
      .limit(6)
      .offset((page - 1) * 6)
      .execute();

    return titles.map((row) => ({
      ...row,
      favorited: favorites.includes(row.id),
      watchLater: watchLater.includes(row.id),
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

/**
 * Get a users favorites list.
 */
export async function fetchFavorites(page: number, userEmail: string) {
  try {
    const watchLater = (
      await db
        .selectFrom("watchlater")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    const titles = await db
      .selectFrom("titles")
      .selectAll("titles")
      .innerJoin("favorites", "titles.id", "favorites.title_id")
      .where("favorites.user_id", "=", userEmail)
      .orderBy("titles.released", "asc")
      .limit(6)
      .offset((page - 1) * 6)
      .execute();

    return titles.map((row) => ({
      ...row,
      favorited: true,
      watchLater: watchLater.includes(row.id),
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorites.");
  }
}

/**
 *  Add a title to a users favorites list.
 */
export async function insertFavorite(title_id: string, userEmail: string) {
  try {
    const data =
      await sql<Question>`INSERT INTO favorites (title_id, user_id) VALUES (${title_id}, ${userEmail})`;
    insertActivity(title_id, userEmail, "FAVORITED");
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add favorite.");
  }
}

/**
 * Remove a title from a users favorites list.
 */
export async function deleteFavorite(title_id: string, userEmail: string) {
  try {
    const data =
      await sql<Question>`DELETE FROM favorites WHERE title_id = ${title_id} AND user_id = ${userEmail}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete favorite.");
  }
}

/**
 * Check if a title is in a users favorites list.
 */
export async function favoriteExists(title_id: string, userEmail: string) {
  try {
    const data =
      await sql<Question>`SELECT * FROM favorites WHERE title_id = ${title_id} AND user_id = ${userEmail}`;
    return data.rows.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorite.");
  }
}

/**
 * Get a users watch later list.
 */
export async function fetchWatchLaters(page: number, userEmail: string) {
  try {
    const favorites = (
      await db
        .selectFrom("favorites")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    const titles = await db
      .selectFrom("titles")
      .selectAll("titles")
      .innerJoin("watchlater", "titles.id", "watchlater.title_id")
      .where("watchlater.user_id", "=", userEmail)
      .orderBy("titles.released", "asc")
      .limit(6)
      .offset((page - 1) * 6)
      .execute();

    return titles.map((row) => ({
      ...row,
      favorited: favorites.includes(row.id),
      watchLater: true,
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watchLater.");
  }
}

/**
 * Add a title to a users watch later list.
 */
export async function insertWatchLater(title_id: string, userEmail: string) {
  try {
    const data =
      await sql<Question>`INSERT INTO watchLater (title_id, user_id) VALUES (${title_id}, ${userEmail})`;

    insertActivity(title_id, userEmail, "WATCH_LATER");
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add watchLater.");
  }
}

/**
 * Remove a title from a users watch later list.
 */
export async function deleteWatchLater(title_id: string, userEmail: string) {
  try {
    const data =
      await sql`DELETE FROM watchLater WHERE title_id = ${title_id} AND user_id = ${userEmail}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add watchLater.");
  }
}

/**
 * Check if a movie title exists in a user's watch later list.
 */
export async function watchLaterExists(
  title_id: string,
  userEmail: string
): Promise<boolean> {
  try {
    const data =
      await sql`SELECT * FROM watchLater WHERE title_id = ${title_id} AND user_id = ${userEmail}`;
    return data.rows.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watchLater.");
  }
}

/**
 * Get all genres for titles.
 */
export async function fetchGenres(): Promise<string[]> {
  const data = await sql<{ genre: string }>`
        SELECT DISTINCT titles.genre
        FROM titles;
      `;
  return data.rows.map((row) => row.genre);
}

/**
 * Get a users favorites list.
 */
export async function fetchActivities(page: number, userEmail: string) {
  try {
    const activities = await db
      .selectFrom("activities")
      .innerJoin("titles", "activities.title_id", "titles.id")
      .select([
        "activities.id",
        "activities.timestamp",
        "activities.activity",
        "titles.title",
      ])
      .where("activities.user_id", "=", userEmail)
      .orderBy("activities.timestamp", "desc")
      .limit(10)
      .offset((page - 1) * 10)
      .execute();

    return activities;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorites.");
  }
}

async function insertActivity(
  title_id: string,
  userEmail: string,
  activity: "FAVORITED" | "WATCH_LATER"
) {
  try {
    const data =
      await sql<Question>`INSERT INTO activities (title_id, user_id, activity) VALUES (${title_id}, ${userEmail}, ${activity})`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add activity.");
  }
}
