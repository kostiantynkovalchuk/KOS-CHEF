export async function getRecipe(ingredients) {
  try {
    const response = await fetch("/.netlify/functions/getRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return `Sorry, we couldn't fetch a recipe right now. Error: ${error.message}`;
  }
}
