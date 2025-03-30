const { HfInference } = require("@huggingface/inference");

const SYSTEM_PROMPT = `
You are a culinary assistant that suggests recipes based on available ingredients. 
- Use some or all of the provided ingredients
- You may include common pantry staples (salt, pepper, oil, etc.)
- Format your response in clear markdown with sections for: Title, Ingredients, Instructions
- Keep instructions concise but clear
- Estimated cooking time would be helpful
`;

exports.handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  }

  try {
    if (!process.env.HF_ACCESS_TOKEN) {
      throw new Error("Hugging Face access token not configured");
    }

    console.log("HF_ACCESS_TOKEN:", process.env.HF_ACCESS_TOKEN);

    const { ingredients } = JSON.parse(event.body);

    // Validate input
    if (!ingredients || !Array.isArray(ingredients)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Ingredients array is required" }),
      };
    }

    // Clean and validate ingredients
    const cleanedIngredients = ingredients
      .map((i) => i.toString().trim())
      .filter((i) => i.length > 0);

    if (cleanedIngredients.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Please provide at least one valid ingredient",
        }),
      };
    }

    if (cleanedIngredients.length > 20) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Please provide 20 or fewer ingredients",
        }),
      };
    }

    const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have these ingredients: ${cleanedIngredients.join(", ")}. 
          Please suggest a delicious recipe I could make with them.`,
        },
      ],
      max_tokens: 1024,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        recipe: response.choices[0]?.message?.content || "No recipe generated",
      }),
    };
  } catch (err) {
    console.error("Error in getRecipe function:", err.message);
    console.error("Stack trace:", err.stack);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to generate recipe",
        details: err.message,
      }),
    };
  }
};
// This code is a serverless function for generating recipes based on user-provided ingredients.
