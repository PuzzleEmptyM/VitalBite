'use client';

import FooterNavigation from '@/components/FooterNavigation';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface Diet {
  dietId: number;
  dietName: string;
  diseaseName: string;
}

interface HealthyTip {
  healthyTipId: number;
  dietId: number;
  tip: string[];
  title: string;
}

const HealthyTipsPage = () => {
  const { data: session } = useSession();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [healthyTips, setHealthyTips] = useState<{ [key: string]: HealthyTip[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDietsAndTips = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);

          // Fetch dietIds the user is following
          const dietIdsResponse = await fetch(`/api/diets?uid=${session.user.id}`);
          const dietIdsData = await dietIdsResponse.json();

          if (!Array.isArray(dietIdsData)) {
            setDiets([]);
            return;
          }

          // Fetch diet details for each dietId
          const dietDetailsPromises = dietIdsData.map(async (dietId: number) => {
            const dietResponse = await fetch(`/api/diets?dietId=${dietId}`);
            const dietData = await dietResponse.json();
            return dietData;
          });

          const dietsData: Diet[] = await Promise.all(dietDetailsPromises);
          setDiets(dietsData);

          // Fetch healthy tips for each diet
          const tipsPromises = dietsData.map(async (diet) => {
            const tipsResponse = await fetch(`/api/healthytips?dietId=${diet.dietId}`);
            const tipsData = await tipsResponse.json();
            return { dietId: String(diet.dietId), tips: tipsData };
          });

          const tipsResults = await Promise.all(tipsPromises);

          const tipsData: { [key: string]: HealthyTip[] } = {};
          tipsResults.forEach(({ dietId, tips }) => {
            tipsData[dietId] = Array.isArray(tips) ? tips : [tips];
          });

          setHealthyTips(tipsData);
        } catch (error) {
          console.error('Error fetching diets or healthy tips:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDietsAndTips();
  }, [session?.user?.id]);

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* Header */}
      <Header />

      {/* Heart Icon at the Top */}
      <section>
        <div className="w-60 h-60 flex items-center justify-center mb-4 mx-auto">
          <img src="/images/heart.png" alt="Health Icon" className="w-50 h-50" />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex flex-col items-center w-full mb-16 space-y-8">
        {loading ? (
          <p>Loading...</p>
        ) : diets.length === 0 ? (
          <p>You are not following any diets yet.</p>
        ) : (
          diets.map((diet) => {
            const dietIdKey = String(diet.dietId);
            let tipsForDiet = healthyTips[dietIdKey];

            // Define the desired order
            const desiredTipOrder = ['Physical Health Tips:', 'Mental and Emotional Health Tips:'];

            // Sort tipsForDiet according to the desired order
            tipsForDiet.sort((a, b) => {
              const indexA = desiredTipOrder.indexOf(a.title.trim());
              const indexB = desiredTipOrder.indexOf(b.title.trim());
              const orderA = indexA !== -1 ? indexA : desiredTipOrder.length;
              const orderB = indexB !== -1 ? indexB : desiredTipOrder.length;
              return orderA - orderB;
            });

            return (
              <div key={`diet-${diet.dietId}`} className="w-full max-w-md space-y-8">
                {/* Diet Header */}
                <section>
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-forest_green mb-2 text-center font-playfair">
                    {diet.dietName}
                  </h2>

                  {/* Divider */}
                  <hr className="border-forest_green w-3/4 mb-4 mx-auto" />
                </section>

                {/* Healthy Tips */}
                {Array.isArray(tipsForDiet) && tipsForDiet.length > 0 ? (
                  tipsForDiet.map((tip) => (
                    <section key={`tip-${diet.dietId}-${tip.healthyTipId}`}>
                      {/* Info Box */}
                      <section className="bg-mint w-full rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg font-semibold text-forest_green mb-2 text-center font-playfair">
                          {tip.title || 'Health Tips'}
                        </h3>
                        <div className="text-forest_green text-sm leading-relaxed font-playfair">
                          {Array.isArray(tip.tip) && tip.tip.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {tip.tip.map((tipItem, index) => (
                                <li key={`tipItem-${diet.dietId}-${tip.healthyTipId}-${index}`}>
                                  {tipItem.trim()}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No tips available for this category.</p>
                          )}
                        </div>
                      </section>
                    </section>
                  ))
                ) : (
                  <p>No healthy tips available for this diet.</p>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* Bottom Navigation */}
      <FooterNavigation />
    </div>
  );
};

export default HealthyTipsPage;
