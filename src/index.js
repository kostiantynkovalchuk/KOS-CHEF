// filepath: /Users/konstantinkovalcuk/MCB/KOS-CHEF/src/index.js
import { getRecipeFromMistral } from "../ai.js";

// Example usage
const ingredients = ["tomato", "cheese", "basil"];
getRecipeFromMistral(ingredients).then((recipe) => {
  console.log(recipe);
});
