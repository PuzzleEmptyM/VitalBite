'use client';

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ConditionPage = () => {
    const { data: session } = useSession();
    const [dietIds, setDietIds] = useState<number[]>([]);
    const [conditions, setConditions] = useState<any[]>([]);

    useEffect(() => {
        // Step 1: Fetch the diet IDs associated with the logged-in user
        const fetchDietIds = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/diets?uid=${session.user.id}`);
                    const data = await response.json();
                    if (response.ok) {
                        setDietIds(data);
                    } else {
                        console.error("No dietIds found for the user:", data.message);
                    }
                } catch (error) {
                    console.error("Error fetching dietIds:", error);
                }
            }
        };

        fetchDietIds();
    }, [session?.user?.id]);

    useEffect(() => {
        // Step 2: Fetch the condition information for each dietId
        const fetchConditionInfo = async () => {
            if (dietIds.length > 0) {
                try {
                    const fetchedConditions = await Promise.all(
                        dietIds.map(async (dietId) => {
                            const response = await fetch(`/api/condition?dietId=${dietId}`);
                            if (response.ok) {
                                return await response.json();
                            } else {
                                console.error(`Error fetching condition info for dietId ${dietId}`);
                                return null;
                            }
                        })
                    );
                    setConditions(fetchedConditions.filter((condition) => condition !== null));
                } catch (error) {
                    console.error("Error fetching condition information:", error);
                }
            }
        };

        fetchConditionInfo();
    }, [dietIds]);

    return (
        <div className="bg-white min-h-screen p-4 font-sans">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex flex-col items-center w-full mb-16">
                {/* Icon */}
                <div className="w-60 h-60 flex items-center justify-center mb-2">
                    <img
                        src="/images/health.png"
                        alt="Health Icon"
                        className="w-50 h-50"
                    />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold font-playfair text-forest_green mb-2">
                    Understanding Your Condition
                </h2>

                {/* Divider */}
                <hr className="border-forest_green w-3/4 mb-4" />

                {/* Condition Info Sections */}
                {conditions.length === 0 ? (
                    <p>No information available. Please <Link href="/editdiet" className="text-teal underline">select your dietary preferences</Link>.</p>
                ) : (
                    conditions.map((condition, index) => (
                        <section
                            key={index}
                            className="bg-mint w-full max-w-md rounded-lg p-4 shadow-lg mb-6"
                        >
                            {/* Header */}
                            <h3 className="text-lg font-bold text-center text-forest_green mb-2">
                                {condition.header}
                            </h3>
                            
                            {/* Title */}
                            <h4 className="text-lg font-semibold text-forest_green mb-2 text-center">
                                {condition.condition_title}
                            </h4>
                            
                            {/* Description */}
                            <p className="text-forest_green text-sm leading-relaxed">
                                {condition.condition_description}
                            </p>
                        </section>
                    ))
                )}
            </main>

            {/* Bottom Navigation */}
            <FooterNavigation />
        </div>
    );
};

export default ConditionPage;
