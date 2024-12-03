"use client";

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const username = session?.user?.name || "Guest";
  const userInitials = `${username.split(" ")[0][0].toUpperCase()}${
    username.split(" ")[1] ? username.split(" ")[1][0].toUpperCase() : ""
  }`;

  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi there! How can I help?" },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (!userMessage) return; // Prevent empty messages
  
    const newMessages = [...messages, { type: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage(""); // Clear input field
  
    // Show "Typing..." indicator
    setMessages([...newMessages, { type: "bot", text: "Typing..." }]);
  
    try {
      // Call the API route and include the user's UID
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, uid: session?.user?.id }), // Pass UID from client-side
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.message) throw new Error("Invalid response format: missing 'message' field");
  
      // Add the bot's response to the messages
      setMessages([...newMessages, { type: "bot", text: data.message }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { type: "bot", text: "Something went wrong. Please try again." }]);
    }
  };
  
  

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* Header */}
      <Header />

      {/* Title */}
      <section className="flex flex-col items-center w-full mt-8 flex-grow">
        <h2 className="text-xl font-semibold font-playfair text-forest_green mb-4 relative">
          AI Chatbot
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-forest_green"></span>
        </h2>

        {/* Chat Area */}
        <div className="bg-mint w-full max-w-md rounded-lg shadow-lg p-4 flex flex-col justify-between h-[70vh]">
          {/* Chat Bubbles */}
          <div className="flex flex-col space-y-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-forest_green scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <img
                    src="/images/aichatbot.png"
                    alt="Chatbot Icon"
                    className="w-8 h-8 rounded-full bg-forest_green mr-2"
                  />
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-forest_green text-white"
                      : "bg-white text-forest_green"
                  } font-playfair shadow-md`}
                  style={{ maxWidth: "75%" }}
                >
                  {message.text}
                </div>
                {message.type === "user" && (
                  <div className="ml-2 bg-forest_green text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {userInitials}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center w-full bg-cream rounded-full px-4 py-2 mt-4">
            <input
              type="text"
              placeholder="Type your question..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Handle Enter key
              className="flex-1 bg-transparent outline-none text-forest_green placeholder-forest_green"
            />
            <button
              className="text-forest_green text-xl ml-2"
              onClick={handleSendMessage}
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
