// Recipe API service using TheMealDB API
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchRecipesByIngredient(ingredient) {
  const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals || [];
}

export async function searchRecipesByName(name) {
  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals || [];
}

export async function getRandomRecipe() {
  const response = await fetch(`${BASE_URL}/random.php`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

export async function getRecipeDetails(recipeId) {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${recipeId}`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

export async function getRecipesByCategory(category) {
  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals || [];
}

export async function getRecipesByArea(area) {
  const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
  if (!response.ok) {
    throw new Error(`Recipe API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.meals || [];
}

export function getCookingTimeCategory(time) {
  if (time <= 15) return { label: "Quick", color: "green", icon: "⚡" };
  if (time <= 30) return { label: "Fast", color: "blue", icon: "🏃" };
  if (time <= 60) return { label: "Moderate", color: "yellow", icon: "⏰" };
  return { label: "Slow", color: "red", icon: "🐌" };
}

export function getDifficultyLevel(ingredients) {
  const ingredientCount = ingredients ? ingredients.length : 0;
  if (ingredientCount <= 5) return { label: "Easy", color: "green", icon: "😊" };
  if (ingredientCount <= 10) return { label: "Medium", color: "yellow", icon: "🤔" };
  return { label: "Hard", color: "red", icon: "😅" };
}

export function parseIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ""
      });
    }
  }
  return ingredients;
}

export function parseInstructions(instructions) {
  if (!instructions) return [];
  return instructions
    .split('\r\n')
    .filter(step => step.trim())
    .map((step, index) => ({
      step: index + 1,
      instruction: step.trim()
    }));
}
