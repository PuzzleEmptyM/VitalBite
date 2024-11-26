"use client"

import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";

const RecipePage: React.FC = () => {
  const recipes = [
    {
      prepTime: '15 mins',
      startTime: '12:00 PM',
      recipeName: 'Avocado Salad',
      ingredients: 'Avocado, Lettuce, Tomatoes',
      instructions: 'Mix all ingredients and then serve fresh.',
    },
    {
      prepTime: '20 mins',
      startTime: '5:30 PM',
      recipeName: 'Vegan Stir Fry',
      ingredients: 'Broccoli, Carrots, Soy Sauce',
      instructions: 'Stir fry ingredients in pan and serve fresh',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-6 bg-white p-4 font-sans">
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
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default RecipePage;
