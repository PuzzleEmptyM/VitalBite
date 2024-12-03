"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import Head from "next/head";

const LifestyleTipsPage: React.FC = () => {
  const { data: session } = useSession();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLifestyleTips = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/lifestyletips?uid=${session.user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            setTips(data);
          } else {
            setTips([]);
          }
        } catch (error) {
          console.error("Error fetching lifestyle tips:", error);
          setTips([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) fetchLifestyleTips();
  }, [session?.user?.id]);

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Head>
        <title>Lifestyle Tips | VitalBite</title>
      </Head>

      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mb-16">
        <img
          src="/images/branch.png"
          alt="Branch image"
          className="w-80 h-80"
          style={{ marginTop: "-65px", marginBottom: "-75px" }}
        />
        <h1 className="text-2xl font-semibold text-forest_green font-playfair mb-2">
          Lifestyle Tips
        </h1>

        {loading ? (
          <p className="text-base text-forest_green font-playfair">Loading...</p>
        ) : tips.length === 0 ? (
          <p className="text-base text-forest_green font-playfair">
            No lifestyle tips available for you.
          </p>
        ) : (
          tips.map((tip) => (
            <div
              key={tip.tipId}
              className="bg-mint rounded-3xl shadow-md border border-forest_green p-4 w-80 mb-6"
            >
              <h3 className="font-semibold text-lg font-playfair text-forest_green mb-2">
                {tip.summary || "Tip"}
              </h3>
              <p className="text-base text-center font-playfair text-forest_green mb-6">
                {tip.tip}
              </p>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
