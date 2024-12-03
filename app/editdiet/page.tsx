"use client";

import ConditionSelector from "@/components/ConditionSelector";
import Link from "next/link";
import FooterNavigation from "@/components/FooterNavigation";
import { useState } from "react";
import Header from "@/components/Header";

export default function EditDietPage() {
    const [selectedDiets, setSelectedDiets] = useState<number[]>([]);

    return (
        <div className="flex flex-col min-h-screen px-2">
          {/* Header Section */}
          <div>
          <Header />
          </div>
          <div className="w-11/12 max-w-md p-4">
            <div className="flex flex-col items-center">
                  
              {/* Icon */}
              <img
                src="/images/salad.png"
                alt="VitalBite Logo"
                className="w-48 h-48"
                style={{ marginBottom: '-50px',
                        marginTop: '-50px'
                }}
              />
            </div>
    
            <div>
                <h1 className="text-2xl font-light text-forest_green font-playfair relative text-center pt-9">
                    Change Diet
                    <span className="absolute mt-4 left-1/2 -translate-x-1/2 bottom-[-8px] w-80 h-[2px] rounded bg-forest_green"></span>
                </h1>
            </div>
            
    
              {/* Condition Selector */}
              <div className="flex items-center justify-center mt-6">
                <h2 className="relative w-52 h-16 text-center text-forest_green bg-mint font-playfair py-2 px-2 rounded-full  border-teal shadow-md mb-2">
                  Please select your <br /> Diet(s)
                </h2>
              </div>
              <ConditionSelector onSelectConditions={setSelectedDiets} /> {/* Pass correct prop name */}
                <div className="mb-6"></div>
            {/* Footer */}
            <FooterNavigation />
          </div>
        </div>
    );

}