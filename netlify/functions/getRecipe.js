const { HfInference } = require("@huggingface/inference");

exports.handler = async (event, context) => {
  const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

  const { ingredients } = JSON.parse(event.body);

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-Small-3.1-24B-Instruct-2503",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredients}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: response.choices[0].message.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipe" }),
    };
  }
};
