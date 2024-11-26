"use client"

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";

const RecipePage: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/recipes?uid=${session.user.id}`);
          const data = await response.json();
          if (data && data.length > 0) {
            setRecipes(data);
          } else {
            console.log("No recipes found for the logged-in user.");
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      }
    };

    fetchRecipes();
  }, [session?.user?.id]); // Re-fetch when the session changes

  return (
    <div className="flex flex-col min-h-screen px-6 bg-white p-4 font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center">
        <img
          src="/images/fork.png"
          alt="Fork image"
          className="w-60 h-60"
          style={{ marginTop: '-45px', marginBottom: '-15px', alignItems: 'center' }} 
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-2 font-playfair">Saved Recipes</h1>
        {recipes.length === 0 ? (
          <p>No recipes saved yet. Start adding some!</p>
        ) : (
          recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default RecipePage;
