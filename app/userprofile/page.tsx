"use client";

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Make sure you're using the correct `useRouter`

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  // Extract the user's first name
  const fullName = session?.user?.name || "Guest";
  const firstName = fullName.split(" ")[0];
  const capitalizedFirstName = capitalizeFirstLetter(firstName);

  function capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Head>
        <title>User Profile</title>
      </Head>

      {/* Header Section */}
      <Header />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center mb-16">
        <img
          src="/images/jalapeno.png"
          alt="jalapeno image"
          className="w-60 h-60"
          style={{ marginTop: "-45px", marginBottom: "-25px" }}
        />
        <h2 className="text-4xl font-bold font-hellowin text-teal mb-6">
        {capitalizedFirstName}'s profile
        </h2>

        {/* Saved Recipes */}
        <div
          className="w-full max-w-md bg-mint rounded-3xl border border-forest_green focus:outline focus:ring focus:ring-forest_green flex items-center justify-center p-2 mb-6 shadow-xl"
          onClick={() => router.push("/savedrecipes")}
        >
          <div className="flex flex-col items-center">
            <img
              src="/images/saladbowl.png"
              alt="salad bowl image"
              className="w-40 h-40"
              style={{ marginTop: "-15px" }}
            />
            <p
              className="text-lg font-medium text-forest_green font-playfair"
              style={{
                marginTop: "-15px",
                marginBottom: "6px",
              }}
            >
              Saved Recipes
            </p>
          </div>
        </div>

        {/* Saved Lifestyle Tips */}
        <div
          className="w-full max-w-md bg-mint rounded-3xl border border-forest_green focus:outline focus:ring focus:ring-forest_green flex items-center justify-center p-6 shadow-xl"
          onClick={() => router.push("/lifestyletips")}
        >
          <div className="flex flex-col items-center">
            <img
              src="/images/leaf.png"
              alt="leaf image"
              className="w-40 h-40"
              style={{ marginTop: "-15px" }}
            />
            <p
              className="text-lg text-forest_green font-playfair font-medium"
              style={{
                marginTop: "-15px",
                marginBottom: "2px",
              }}
            >
              Saved Lifestyle Tips
            </p>
          </div>
        </div>
        <div
          className="w-full max-w-md bg-mint rounded-3xl border border-forest_green focus:outline focus:ring focus:ring-forest_green flex items-center justify-center p-2 mb-6 shadow-xl mt-6"
          onClick={() => router.push("/editdiet")}
        >
          <div className="flex flex-col items-center ">
            <img
              src="/images/salad.png"
              alt="salad bowl image"
              className="w-40 h-40"
              style={{ marginTop: "-15px" }}
            />
            <p
              className="text-lg font-medium text-forest_green font-playfair"
              style={{
                marginTop: "-15px",
                marginBottom: "6px",
              }}
            >
              Change Your Diet
            </p>
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <FooterNavigation />
    </div>
  );
}
