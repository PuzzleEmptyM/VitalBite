import DisclaimerFooter from "@/components/DisclaimerFooter";
import Header from "@/components/Header";
import Head from "next/head";
import Image from "next/image";

export default function IngredientsAnalyzerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-6">
      <Head>
        <title>Ingredient Analyzer</title>
      </Head>

      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center w-full mt-8 space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-4xl font-light text-forest_green font-playfair relative pt-9">
            Ingredient Analyzer
            <span className="absolute mt-4 left-1/2 -translate-x-1/2 bottom-[-8px] w-80 h-[2px] bg-forest_green"></span>
          </h1>
          <p className="text-forest_green font-playfair mt-4">
            Discover which diets align with any ingredient by simply searching to get instant insights
          </p>
        </div>


        {/* Search Input */}
        <div className="w-full max-w-md px-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 p-3 text-lg bg-cream border border-forest_green rounded-full shadow-md pl-9 placeholder-forest_green focus:outline-none focus:ring focus:ring-forest_green text-teal"
          />
        </div>

        {/* Results Section */}
        <div className="px-8 pt-7">
          <div className="w-full h-full max-w-md p-6 bg-mint rounded-2xl border border-forest_green shadow-lg focus:outline-none focus:ring focus:ring-forest_green">
            <h2 className="text-xl font-light text-forest_green font-playfair mb-4 text-left">
              Tomatoes work with the following diets:
            </h2>
            <div className="bg-cream rounded-lg">
              <ul className="space-y-0">
                {["Diet 1", "Diet 2", "Diet 3", "Diet 4", "Diet 5"].map((diet, index) => (
                  <li key={index} className="flex flex-col items-center">
                    <div className="flex items-center justify-between w-full p-4 bg-beige rounded-md">
                      <div className="flex items-center space-x-1">
                        {/* carrot svg icon */}
                        <Image
                          src="/icons/carrot.svg"
                          alt="Carrot Icon"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-forest_green font-playfair">{diet}</span>
                      </div>
                      <span className="text-forest_green">{">"}</span>
                    </div>
                    {/* Divider */}
                    {index < 4 && (
                      <div className="w-64 border-t border-forest_green"></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      {/* <div>
        <DisclaimerFooter />
      </div> */}
    </div>
  );
}
