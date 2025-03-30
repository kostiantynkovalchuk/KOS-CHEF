import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipe } from "./ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function fetchRecipe() {
    setLoading(true);
    setError(null);
    try {
      const recipeMarkdown = await getRecipe(ingredients);
      setRecipe(recipeMarkdown);
    } catch (err) {
      setError(err.message);
      setRecipe("");
    } finally {
      setLoading(false);
    }
  }

  function addIngredient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient")?.trim();
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients((prev) => [...prev, newIngredient]);
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
          required
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

      {error && <p className="error-message">{error}</p>}
      <ClaudeRecipe recipe={recipe} loading={loading} />
    </main>
  );
}
