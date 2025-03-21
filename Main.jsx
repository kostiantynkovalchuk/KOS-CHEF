import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipe } from "./ai"; // Import the getRecipe function

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false); // Add loading state

  async function fetchRecipe() {
    setLoading(true); // Set loading to true before fetching the recipe
    const recipeMarkdown = await getRecipe(ingredients);
    setRecipe(recipeMarkdown);
    setLoading(false); // Set loading to false after fetching the recipe
  }

  function addIngredient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      event.target.reset();
    }
  }

  return (
    <main>
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={fetchRecipe}
          loading={loading}
        />
      )}

      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
