'use client';

import React, { useState } from "react";
import FooterNavigation from "@/components/FooterNavigation";

const Page = () => {
  // State to hold user messages
  const [messages, setMessages] = useState<{ type: "bot" | "user"; text: string }[]>([
    { type: "bot", text: "Hi there! How can I help?" }
  ]);
  const [input, setInput] = useState(""); // State to track the input field

  // Handler to send a message
  const handleSend = () => {
    if (input.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the message list
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput(""); // Clear the input field
  };

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div onClick={() => alert("Home!")} className="cursor-pointer">
          <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
            onClick={() => alert("User profile!")}
          >
            TW
          </div>
          <button
            className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
            onClick={() => alert("Logout!")}
          >
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
        <div className="bg-mint w-full max-w-md rounded-lg shadow-lg p-4 flex flex-col min-h-[70vh]">
          {/* Chat Messages */}
          <div className="flex flex-col space-y-4 overflow-y-auto flex-grow">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  message.type === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                {message.type === "bot" ? (
                  <>
                    <img
                      src="/images/aichatbot.png"
                      alt="Chatbot Icon"
                      className="w-10 h-10 rounded-full bg-forest_green mr-2"
                    />
                    <p className="text-left bg-cream px-4 py-2 rounded-lg shadow-md text-forest_green">
                      {message.text}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-right bg-cream px-4 py-2 rounded-lg shadow-md text-forest_green">
                      {message.text}
                    </p>
                    <div className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md ml-2">
                      TW
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center w-full bg-cream rounded-full px-4 py-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-transparent outline-none text-forest_green placeholder-forest_green"
            />
            <button
              className="text-forest_green text-xl ml-2"
              onClick={handleSend}
            >
              ➤
            </button>
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
