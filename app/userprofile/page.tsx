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
    
          {/* Illustration */}
          <div className="w-24 h-24 mb-4">
            <img
              src="/images/jalapeno.png"
              alt="Jalapeno"
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold mb-6">Tiffany's Profile</h1>
    
          {/* Saved Recipes */}
          <div className="w-full max-w-md bg-mint text-lightMint rounded-lg flex items-center justify-center p-6 mb-4 shadow-lg">
            <div className="flex flex-col items-center">
              <img
                src="/images/saladbowl.png"
                alt="Salad Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-lg font-medium">Saved Recipes</p>
            </div>
          </div>
    
          {/* Saved Lifestyle Tips */}
          <div className="w-full max-w-md bg-mint text-lightMint rounded-lg flex items-center justify-center p-6 shadow-lg">
            <div className="flex flex-col items-center">
              <img
                src="/images/leaf.png"
                alt="Leaf Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-lg font-medium">Saved Lifestyle Tips</p>
            </div>
          </div>
    
          {/* Bottom Navigation */}
          <FooterNavigation />
        </div>
      );
    };