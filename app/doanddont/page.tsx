"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import DoAndDont from "@/components/DoAndDont";
import FooterNavigation from "@/components/FooterNavigation";
import Image from "next/image";

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
    <div className="flex flex-col min-h-screen px-6 bg-white p-4 font-sans">
      <Head>
        <title>Do's and Don'ts | VitalBite</title>
        <meta name="description" content="A guide of do's and don'ts based on users diet needs." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center pb-12">
        <img
          src="/images/avocado.png"
          alt="avocado image"
          className="w-60 h-60 mb-0"
          style={{ marginTop: '-15px' }}
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-2 font-playfair">Do's and Don'ts</h1>

        {loading ? (
          <p>Loading...</p> // Display loading state
        ) : dosAndDonts.length === 0 ? (
          <p>No do's and don'ts available for your diet preferences</p>
        ) : (
          dosAndDonts.map((item, index) => (
            <div key={index} className="my-4 p-4 border rounded-lg shadow-md w-full max-w-lg">
              <h2 className="font-bold text-lg">{`Diet Type ${item.dietId}`}</h2>
              <h3 className="font-semibold text-md mt-2">Do's</h3>
              <ul className="list-disc pl-6">
                {item.do_items && item.do_items.map((doItem: string, i: number) => (
                  <li key={i}>{doItem}</li>
                ))}
              </ul>
              <h3 className="font-semibold text-md mt-2">Don'ts</h3>
              <ul className="list-disc pl-6">
                {item.dont_items && item.dont_items.map((dontItem: string, i: number) => (
                  <li key={i}>{dontItem}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
}
