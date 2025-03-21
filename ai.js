import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

// Make sure you set an environment variable in Scrimba
// for HF_ACCESS_TOKEN
const hfAccessToken = process.env.HF_ACCESS_TOKEN;
console.log("HF_ACCESS_TOKEN:", hfAccessToken); // Log the token value for debugging

const hf = new HfInference(hfAccessToken);

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-Small-3.1-24B-Instruct-2503",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return "Sorry, I could not fetch a recipe at this time.";
  }
}
