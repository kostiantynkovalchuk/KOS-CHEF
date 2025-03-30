export async function getRecipe(ingredients) {
  // Basic client-side validation
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return "Please provide at least one ingredient";
  }

  try {
    const response = await fetch("/.netlify/functions/getRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredients
          .map((i) => i.trim())
          .filter((i) => i.length > 0),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.recipe || "No recipe was generated";
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return `Sorry, we couldn't generate a recipe right now. ${error.message}`;
  }
}
