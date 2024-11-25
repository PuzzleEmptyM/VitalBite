'use client';

import React from "react";

const HealthyTipsPage = () => {
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
                        onClick={() => alert("User profile!")}
                    >
                        TW
                    </div>
                    <button className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
                        onClick={() => alert("Logout!")}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center w-full mb-16 space-y-8">
                <div className="w-full max-w-md space-y-8">
                    {/* First Card */}
                    <section>
                        {/* Icon */}
                        <div className="w-60 h-60 flex items-center justify-center mb-2 mx-auto">
                            <img
                                src="/images/heart.png"
                                alt="Health Icon"
                                className="w-50 h-50"
                            />
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-semibold  text-forest_green mb-2 text-center font-playfair">
                            Gluten-Free Diet (Celiac Disease)
                        </h2>

                        {/* Divider */}
                        <hr className="border-forest_green w-3/4 mb-4 mx-auto" />

                        {/* Info Box */}
                        <section className="bg-mint w-full rounded-lg p-4 shadow-lg">
                            <h3 className="text-lg font-semibold text-forest_green mb-2 text-center font-playfair">
                                Mental and Emotional Health Tips:
                            </h3>
                            <div className="text-forest_green text-sm leading-relaxed font-playfair">
                                <ul className="list-disc pl-5">
                                    <li>
                                        <strong>Stay Informed:</strong> Educate yourself about celiac disease and gluten-free living. Knowledge helps you make informed choices and reduces the stress of navigating social situations or dining out.
                                    </li>
                                    <li>
                                        <strong>Join a Support Group:</strong> Connect with others who have celiac disease to share tips, recipes, and emotional support. This community can help you feel less isolated.
                                    </li>
                                    <li>
                                        <strong>Focus on What You Can Eat:</strong> Instead of focusing on restrictions, embrace the variety of naturally gluten-free foods available and experiment with new recipes.
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </section>

                    {/* Second Card */}
                    <section>
                        {/* Info Box */}
                        <section className="bg-mint w-full rounded-lg p-4 shadow-lg">
                            <h3 className="text-lg font-semibold text-forest_green mb-2 text-center font-playfair">
                                Physical Health Tips:
                            </h3>
                            <div className="text-forest_green text-sm leading-relaxed font-playfair">
                                <ul className="list-disc pl-5">
                                    <li>
                                        <strong>Read Labels Carefully:</strong> Many packaged foods contain gluten in hidden forms. Always check labels for gluten and cross-contamination warnings.
                                    </li>
                                    <li>
                                        <strong>Balance Your Diet:</strong> Ensure you're eating a variety of whole foods (fruits, vegetables, gluten-free grains, lean proteins) to avoid nutrient deficiencies.
                                    </li>
                                    <li>
                                        <strong>Avoid Processed Gluten-Free Junk Foods:</strong> While they might seem convenient, gluten-free packaged foods can often be high in sugar and fat. Focus on whole, unprocessed foods for better overall health.
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </section>
                </div>
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

export default HealthyTipsPage;
