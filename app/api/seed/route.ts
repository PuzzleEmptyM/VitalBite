import { NextResponse } from "next/server";
import { seedDatabase } from "../../../lib/seed";

export const GET = async () => {
  try {
    console.log("Seeding database...");
    await seedDatabase(); // Call your seeding logic
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
};
