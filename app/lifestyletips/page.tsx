"use client";

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import LifestyleTipCard from "@/components/LifestyleTipCard";

const LifestyleTipsPage: React.FC = () => {
  const { data: session } = useSession();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
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

    if (session?.user?.id) fetchTips();
  }, [session?.user?.id]);

  const handleDeleteTip = (tipId: number) => {
    setTips((prevTips) => prevTips.filter((tip) => tip.tipId !== tipId));
  };

  const sortedTips = tips
    ? [...tips].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center mb-12">
        <img
          src="/images/branch.png"
          alt="Branch image"
          className="w-60 h-60"
          style={{
            marginTop: "-45px",
            marginBottom: "-15px",
            alignItems: "center",
          }}
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-6 font-playfair">
          Lifestyle Tips
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : sortedTips.length === 0 ? (
          <p>No lifestyle tips available yet. Check back soon!</p>
        ) : (
          sortedTips.map((tip) => (
            <LifestyleTipCard
              key={tip.tipId}
              tipId={tip.tipId}
              timestamp={tip.timestamp}
              summary={tip.summary}
              tip={tip.tip}
              onDelete={handleDeleteTip}
              uid={session?.user?.id || ""}
            />
          ))
        )}
      </main>

      <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
