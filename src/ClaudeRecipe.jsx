import React from "react";
import ReactMarkdown from "react-markdown";

export default function ClaudeRecipe({ recipe, loading }) {
  return (
    <section
      className="suggested-recipe-container"
      style={{ backgroundColor: loading || !recipe ? "#fafaf8" : "#ffffff" }}
    >
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <ReactMarkdown>{recipe}</ReactMarkdown>
      )}
    </section>
  );
}
