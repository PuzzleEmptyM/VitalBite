import React from "react";

const Page = () => {
  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <img src="/images/vb_logo.png" alt="VB Logo" className="w-20 h-20" />
        <div className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-sm">
          TW
        </div>
      </header>

      {/* Welcome Section */}
      <section className="text-center mb-6">
        <img src="/images/vitalbite.png" alt="VitalBite Logo" className="mx-auto mb-2" />
        <h2 className="text-4xl font-bold font-hellowin text-teal">Welcome, Tiffany</h2>
        <div className="mt-4 text-left font-playfair flex items-center justify-between">
          <div className="w-full text-left ml-4">
            <h3 className="text-xl font-bold text-forest_green">Understand Your Condition</h3>
            <p className="text-sm text-forest_green mt-2 font-semibold">
              Get clear, reliable information about your medical
              condition(s) to make informed decisions
              about your health and lifestyle
            </p>
            <button className="mt-4 bg-teal text-white px-4 py-2 rounded-full border-2 border-forest_green w-40 shadow-md">
              Learn More
            </button>
          </div>

          <div className="w-full flex justify-center">
            <img src="/images/health.png" alt="Medical Condition" className="w-110 h-110 sm:h-112 md:h-128 lg:h-140 xl:h-160 object-contain mb-2" />
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="grid grid-cols-2 gap-4">
        {/* First Card */}
        <div className="bg-mint rounded-lg p-4 flex flex-col items-center border-2 border-forest_green mt-8 shadow-lg">
          <img src="/images/avocado.png" alt="Do's and Don'ts" className="w-25 h-25 mb-2" />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">Do's and Don'ts</h4>
        </div>

        {/* Second Card */}
        <div className="bg-mint rounded-lg p-4 flex flex-col items-center border-2 border-forest_green mt-8 shadow-lg">
          <img src="/images/heart.png" alt="Healthy Tips" className="w-25 h-25 mb-2" />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">Healthy Tips</h4>
        </div>

        {/* Third Card */}
        <div className="bg-mint rounded-lg p-4 flex flex-col items-center col-span-2 border-2 border-forest_green mt-8 shadow-lg">
          <img src="/images/spoon.png" alt="Ingredient Analyzer" className="w-25 h-25 mb-2" />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">Ingredient Analyzer</h4>
        </div>
      </section>



      {/* AI Chatbot Section */}
      <section className="mt-6 bg-white p-4 rounded-lg font-playfair flex items-center">
        <div className="w-1/3 pr-6 pl-0">
          <img
            src="/images/tomato.png"
            alt="AI Chatbot"
            className="w-auto h-auto max-w-none mb-2 ml-[-50]"
          />
        </div>

        <div className="w-full text-left ml-8">
          <h3 className="text-lg font-bold text-forest_green">AI Chatbot</h3>
          <p className="text-sm text-forest_green mt-2 font-semibold">
          Chat with our AI assistant to get personalized recipes, meal suggestions, and lifestyle tips tailored to your health needs. Your questions, answered instantly and effortlessly!
          </p>
          <button className="mt-4 bg-teal text-white px-4 py-2 rounded-full border-2 border-forest_green w-40 shadow-md">
            Try Now
          </button>
        </div>
      </section>



      <div className="mb-12"></div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-cream flex justify-around py-2 shadow-md border-2 border-forest_green">
        <button>
          <img src="/icons/chat.svg" alt="Home" className="w-8 h-8" />
        </button>
        <button>
          <img src="/icons/user.svg" alt="Profile" className="w-8 h-8" />
        </button>
        <button>
          <img src="/icons/home.svg" alt="Settings" className="w-8 h-8" />
        </button>
        <button>
          <img src="/icons/carrot.svg" alt="Carrot" className="w-8 h-8 " />
        </button>
      </nav>
    </div>
  );
};

export default Page;
