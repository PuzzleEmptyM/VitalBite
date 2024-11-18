import * as seed from "@/lib/seed";

/**
 * Exposes an API endpoint `GET /api/seed`. When hit, runs the commands against the database to create tables and load data.
 */
export async function GET() {
  try {
    await seed.begin();
    await seed.seedTitles();
    await seed.seedFavorites();
    await seed.seedWatchLater();
    await seed.seedActivity();
    await seed.commit();

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await seed.rollback();
    return Response.json({ error }, { status: 500 });
  }
}
