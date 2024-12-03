"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import FooterNavigation from "@/components/FooterNavigation";

export default function DoAndDontPage() {
  const { data: session } = useSession(); // Get session data
  const [dosAndDonts, setDosAndDonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adding loading state for better UX

  useEffect(() => {
    const fetchDosAndDonts = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true); // Start loading when fetching
          const response = await fetch(`/api/dosanddonts?uid=${session.user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            setDosAndDonts(data); // Store the fetched do's and don'ts
          } else {
            setDosAndDonts([]); // Handle unexpected data format
          }
        } catch (error) {
          console.error("Error fetching do's and don'ts:", error);
          setDosAndDonts([]); // Set empty array in case of an error
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    if (session?.user?.id) fetchDosAndDonts();
  }, [session?.user?.id]); // Only refetch when the session id changes

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Head>
        <title>Do's and Don'ts | VitalBite</title>
        <meta name="description" content="A guide of do's and don'ts based on users diet needs." />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mb-16">
        <img
          src="/images/avocado.png"
          alt="avocado image"
          className="w-80 h-80"
          style={{
            marginTop: "-65px",
            marginBottom: "-75px",
          }}
        />
        <h1 className="text-2xl font-semibold text-forest_green font-playfair mb-2 mt-6">Do's and Don'ts</h1>

        {loading ? (
          <p className="text-base text-forest_green font-playfair">Loading...</p>
        ) : dosAndDonts.length === 0 ? (
          <p className="text-base text-forest_green font-playfair">
            No do's and don'ts available for your diet preferences
          </p>
        ) : (
          dosAndDonts.map((item, index) => (
            <div
              key={index}
              className="bg-mint rounded-3xl shadow-md border border-forest_green p-4 w-80 mb-6"
            >
              <h2 className="font-semibold text-lg font-playfair text-forest_green mb-2">
                {item.dietName}
              </h2>
              <h3 className="font-semibold text-md font-playfair text-forest_green">Do's</h3>
              <ul className="list-disc pl-6 text-base text-forest_green font-playfair">
                {item.do_items &&
                  item.do_items.map((doItem: string, i: number) => <li key={i}>{doItem}</li>)}
              </ul>
              <h3 className="font-semibold text-md font-playfair text-forest_green mt-4">Don'ts</h3>
              <ul className="list-disc pl-6 text-base text-forest_green font-playfair">
                {item.dont_items &&
                  item.dont_items.map((dontItem: string, i: number) => <li key={i}>{dontItem}</li>)}
              </ul>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      <FooterNavigation />
    </div>
  );
}
