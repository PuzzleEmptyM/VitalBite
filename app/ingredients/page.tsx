import Head from "next/head";

export default function IngredientsAnalyzerPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4">
      <Head>
        <title>Ingredient Analyzer</title>
      </Head>

      {/* Header Section */}
      <header className="flex justify-between items-center w-full p-4">
        {/* Logo */}
        <img src="/images/vb_logo.png" alt="VB Logo" className="w-24" />
        {/* User Badge */}
        <div className="flex items-center justify-center w-12 h-12 bg-forest_green text-white rounded-full">
          TW
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center w-full mt-8 space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Ingredient Analyzer</h1>
          <p className="text-gray-600 mt-2">
            Discover which diets align with any ingredient by simply searching to get instant insights
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 text-lg bg-beige border border-gray-300 rounded-full shadow-md placeholder-gray-500 focus:outline-none focus:ring focus:ring-teal-300"
          />
        </div>

        {/* Results Section */}
        <div className="w-full max-w-md p-6 bg-teal-100 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tomatoes work with the following diets:
          </h2>
          <ul className="space-y-2">
            {["Diet 1", "Diet 2", "Diet 3", "Diet 4", "Diet 5"].map((diet, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-beige rounded-md shadow-md"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-forest_green">🥗</span>
                  <span className="text-gray-800">{diet}</span>
                </div>
                <span className="text-teal-500">{">"}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
