"use client"

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import Head from "next/head";

export default function UserProfilePage() {
    return (
        <div className="flex flex-col min-h-screen px-6">
        <Head>
          <title>User Profile</title>
        </Head>
  
        {/* Header Section */}
        <Header />
    
          {/* Main content */}
            <main className="flex-grow flex flex-col items-center">
                <img
                src="/images/jalapeno.png"
                alt="jalapeno image"
                className="w-60 h-60"
                style={{ marginTop: '-15px',
                marginBottom: '-35px',
                 }} 
                />
                <h1 className="text-2xl font-semibold text-forest_green font-playfair mb-6">Tiffany's Profile</h1>
            
                {/* Saved Recipes */}
                <div className="w-full max-w-md bg-mint rounded-3xl border border-forest_green focus:outline focus:ring focus:ring-forest_green flex items-center justify-center p-2 mb-4 shadow-xl">
                    <div className="flex flex-col items-center">
                    <img
                        src="/images/saladbowl.png"
                        alt="salad bowl image"
                        className="w-40 h-40"
                        onClick={() => alert('Saved Recipes selected')}
                        style={{ marginTop: '-15px' }} 
                        />
                    <p className="text-lg font-medium text-forest_green font-playfair "
                        style={{ 
                            marginTop: '-15px',
                            marginBottom: '6px',
                        }}>
                            Saved Recipes
                    </p>
                    </div>
                </div>
            
                {/* Saved Lifestyle Tips */}
                <div className="w-full max-w-md bg-mint rounded-3xl border border-forest_green focus:outline focus:ring focus:ring-forest_green flex items-center justify-center p-6 shadow-xl">
                    <div className="flex flex-col items-center">
                    <img
                        src="/images/leaf.png"
                        alt="salad bowl image"
                        className="w-40 h-40"
                        onClick={() => alert('Saved Lifestyle Tips selected')}
                        style={{ marginTop: '-15px' }} 
                        />
                    <p className="text-lg text-forest_green font-playfair font-medium"
                        style={{ 
                            marginTop: '-15px',
                            marginBottom: '2px',
                        }}>
                            Saved Lifestyle Tips
                    </p>
                    </div>
                </div>
          </main>
          {/* Bottom Navigation */}
          <FooterNavigation />
        </div>
      );
    };