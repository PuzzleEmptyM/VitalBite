'use client';

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import React from "react";

const ConditionPage = () => {
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

                {/* Info Box */}
                <section className="bg-mint w-full max-w-md rounded-lg p-4 shadow-lg">
                    <h3 className="text-lg font-semibold text-forest_green mb-2 text-center">
                        Celiac Disease and Gluten-Free Diet
                    </h3>
                    <p className="text-forest_green text-sm leading-relaxed">
                        Celiac disease is an autoimmune disorder where consuming gluten—
                        found in wheat, barley, and rye—triggers an immune response that
                        damages the small intestine lining. This damage interferes with
                        nutrient absorption and can lead to a variety of digestive and
                        systemic symptoms.
                    </p>
                    <p className="text-forest_green text-sm leading-relaxed mt-2">
                        A gluten-free diet is the cornerstone of managing celiac disease. By
                        eliminating all sources of gluten, the immune system is no longer
                        triggered, allowing the intestinal lining to heal over time.
                        Following a strict gluten-free diet helps prevent long-term
                        complications, including malnutrition, bone density loss, and an
                        increased risk of certain cancers.
                    </p>
                </section>
            </main>

            {/* Bottom Navigation */}
            <FooterNavigation />
        </div>
    );
};

export default ConditionPage;
