'use client';

import React from "react";

const ConditionPage = () => {
    return (
        <div className="bg-white min-h-screen p-4 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div
                    onClick={() => alert("Home!")}
                    className="cursor-pointer"
                >
                    <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
                        onClick={() => alert("User profile!")}>
                        TW
                    </div>
                    <button className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
                        onClick={() => alert("Logout!")}>
                        Logout
                    </button>
                </div>
            </header>

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
            <nav className="fixed bottom-0 left-0 right-0 bg-cream flex justify-around py-2 shadow-md border-2 border-forest_green">
                <button onClick={() => alert("Chatbot!")}>
                    <img src="/icons/chat.svg" alt="Chat" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Profile!")}>
                    <img src="/icons/user.svg" alt="Profile" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Home!")}>
                    <img src="/icons/home.svg" alt="Home" className="w-8 h-8" />
                </button>
                <button onClick={() => alert("Ingredient analyzer!")}>
                    <img src="/icons/carrot.svg" alt="Carrot" className="w-8 h-8" />
                </button>
            </nav>
        </div>
    );
};

export default ConditionPage;
