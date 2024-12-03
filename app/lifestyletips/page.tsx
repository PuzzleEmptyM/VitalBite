"use client"

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import Head from "next/head";

const LifestyleTipsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
        <Head>
          <title>User Profile</title>
        </Head>
  
        {/* Header Section */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center mb-16">
                    <img
                    src="/images/branch.png"
                    alt="Branch image"
                    className="w-80 h-80"
                    style={{ marginTop: '-65px',
                    marginBottom: '-75px',
                    }} 
                    />
                    <h1 className="text-2xl font-semibold text-forest_green font-playfair mb-2">Lifestyle Tips</h1>
                

            {/* Tip Cards */}
            <div className="mt-2 flex flex-col items-center mb-4"
                onClick={() => alert('detailed lifestyle tips')}>
                {/* Tip Card #1 */}
                <div className="bg-mint rounded-3xl shadow-md border border-forest_green p-2 w-80 mb-10">
                    <h3 className="font-semibold text-lg font-playfair text-forest_green mb-2">Tip #1</h3>
                    <p className="text-base text-center font-playfair text-forest_green mb-6">Beans are bad</p>
                </div>

                {/* Tip Card #2 */}
                <div className="bg-mint rounded-3xl shadow-md border border-forest_green p-2 w-80">
                    <h3 className="font-semibold text-lg font-playfair text-forest_green mb-2">Tip #2</h3>
                    <p className="text-base text-center font-playfair text-forest_green mb-6">You should probably touch grass today</p>
                </div>
            </div>
        </main>

        {/* Footer */}
        <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
