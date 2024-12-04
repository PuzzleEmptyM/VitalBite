"use client"

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";

const RecipePage: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adding loading state for better UX

  useEffect(() => {
    const fetchRecipes = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true); // Start loading when fetching
          const response = await fetch(`/api/recipes?uid=${session.user.id}`);
          const data = await response.json();

          // Ensure data is an array before setting recipes
          if (Array.isArray(data)) {
            setRecipes(data); 
          } else {
            setRecipes([]); // Handle unexpected data format
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
          setRecipes([]); // Set empty array in case of an error
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    if (session?.user?.id) fetchRecipes();
  }, [session?.user?.id]); // Only refetch when the session id changes

  const handleDeleteRecipe = (recipeId: number) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.recipeId !== recipeId)
    );
  };

  // Sort recipes after they've been fetched
  const sortedRecipes = recipes ? [...recipes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center mb-16">
      <img
            src="/images/fork.png"
            alt="Fork image"
            className="w-60 h-60"
            style={{ marginTop: '-45px',
            marginBottom: '-15px',
            alignItems: 'center',
            }} 
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-2 font-playfair">Saved Recipes</h1>

        {loading ? (
          <p>Loading...</p>
        ) : sortedRecipes.length === 0 ? (
          <p>No recipes saved yet. Start adding some!</p>
        ) : (
          sortedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.recipeId}
              recipeId={recipe.recipeId}
              prepTime={recipe.prepTime}
              timestamp={recipe.timestamp}
              recipeName={recipe.recipeName}
              ingredients={recipe.ingredients}
              instructions={recipe.instructions}
              onDelete={handleDeleteRecipe}
              uid={session?.user?.id || ""}
            />
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default RecipePage;
