import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  searchRecipesByIngredient, 
  searchRecipesByName, 
  getRandomRecipe,
  getRecipeDetails,
  parseIngredients,
  parseInstructions,
  getCookingTimeCategory,
  getDifficultyLevel
} from "../api/recipeApi";

export default function RecipeIdeas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("ingredient"); // ingredient, name
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let results = [];
      if (searchType === "ingredient") {
        results = await searchRecipesByIngredient(searchQuery);
      } else {
        results = await searchRecipesByName(searchQuery);
      }
      setRecipes(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRandomRecipeSuggestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const randomRecipe = await getRandomRecipe();
      if (randomRecipe) {
        setRecipes([randomRecipe]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const details = await getRecipeDetails(recipeId);
      setSelectedRecipe(details);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen">
      <div className="professional-container">
        {/* Back Button */}
        <div className="pt-6 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        {/* Header Section */}
        <header className="text-center py-8">
          <h1 className="elegant-title text-5xl md:text-6xl mb-6">
            🍳 Recipe Ideas
          </h1>
          <p className="elegant-subtitle max-w-2xl mx-auto mb-8">
            Find delicious recipes based on ingredients you have, cooking time, or your mood. Perfect for busy professionals.
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="elegant-card p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="professional-input"
                      placeholder={searchType === "ingredient" ? "Enter ingredient (e.g., chicken, pasta, tomato)..." : "Enter recipe name..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`professional-btn ${!searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!searchQuery.trim() || loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchType === "ingredient" 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSearchType("ingredient")}
                    >
                      By Ingredient
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchType === "name" 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSearchType("name")}
                    >
                      By Name
                    </button>
                  </div>
                  
                  <div className="text-gray-500">or</div>
                  
                  <button
                    type="button"
                    onClick={getRandomRecipeSuggestion}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                  >
                    🎲 Random Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white text-lg">Finding delicious recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="elegant-card p-8 text-center mb-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Recipe search failed</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Recipes Grid */}
        {recipes.length > 0 && !loading && (
          <div className="professional-grid mb-8">
            {recipes.map((recipe) => (
              <div key={recipe.idMeal} className="book-card">
                <div className="relative">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="book-image"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="book-year">{recipe.strCategory}</span>
                  </div>
                </div>
                
                <div className="book-content">
                  <h3 className="book-title">{recipe.strMeal}</h3>
                  <p className="book-author">{recipe.strArea} Cuisine</p>
                  
                  <div className="book-meta">
                    <span className="text-xs text-gray-500">
                      {recipe.strCategory}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => viewRecipeDetails(recipe.idMeal)}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Details Modal */}
        {showModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="elegant-card max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedRecipe.strMeal}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedRecipe.strMealThumb}
                      alt={selectedRecipe.strMeal}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">🍽️</div>
                        <div className="font-semibold text-gray-800">{selectedRecipe.strCategory}</div>
                        <div className="text-sm text-gray-600">Category</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">🌍</div>
                        <div className="font-semibold text-gray-800">{selectedRecipe.strArea}</div>
                        <div className="text-sm text-gray-600">Cuisine</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h3>
                    <div className="space-y-2 mb-6">
                      {parseIngredients(selectedRecipe).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700">{item.ingredient}</span>
                          <span className="text-gray-500 text-sm">{item.measure}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4">Instructions</h3>
                    <div className="space-y-3">
                      {parseInstructions(selectedRecipe.strInstructions).map((step) => (
                        <div key={step.step} className="flex gap-3">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {step.step}
                          </span>
                          <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Persona Info */}
        <div className="elegant-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Designed for Taylor</h3>
            <p className="text-gray-600 mb-6">
              <strong>Busy Professional</strong> - Taylor needs quick recipe ideas based on available ingredients, 
              cooking time constraints, and personal preferences after a long work day.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 font-semibold mb-2">⏰ Time-Saving</div>
                <p className="text-gray-600">Find recipes that fit your schedule</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 font-semibold mb-2">🥘 Ingredient-Based</div>
                <p className="text-gray-600">Cook with what you have at home</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-purple-600 font-semibold mb-2">🎲 Inspiration</div>
                <p className="text-gray-600">Discover new dishes randomly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-white/70 text-sm">
            Powered by <span className="font-semibold">TheMealDB API</span> • 
            Built with <span className="text-red-400">❤️</span> and React
          </p>
        </footer>
      </div>
    </div>
  );
}
