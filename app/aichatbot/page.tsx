'use client';

import FooterNavigation from "@/components/FooterNavigation";
import React from "react";

const Page = () => {
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

      {/* Title */}
      <section className="flex flex-col items-center w-full mt-8 flex-grow">
        <h2 className="text-xl font-semibold font-playfair text-forest_green mb-4 relative">
          AI Chatbot
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-forest_green"></span>
        </h2>


        {/* Chat Area */}
        <div className="bg-mint w-full max-w-md rounded-lg shadow-lg p-4 flex flex-col items-center justify-between min-h-[70vh]">

          {/* Chat Bubble (centered) */}
          <div className="flex items-center mb-4 font-playfair flex-grow justify-center">
            <img
              src="/images/aichatbot.png"
              alt="Chatbot Icon"
              className="w-16 h-16 rounded-full bg-forest_green mr-2"
            />
            <p className="text-forest_green text-lg">Hi there! How can I help?</p>
          </div>

          {/* Input Box (at the bottom) */}
          <div className="flex items-center w-full bg-cream rounded-full px-4 py-2 mt-auto">
            <input
              type="text"
              placeholder="Type your question..."
              className="flex-1 bg-transparent outline-none text-forest_green placeholder-forest_green"
            />
            <button className="text-forest_green text-xl ml-2"
            onClick={() => alert("Send!")}>➤</button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="mb-12">
        <FooterNavigation />
      </div>
    </div>
  );
};

export default Page;
