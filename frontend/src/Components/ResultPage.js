import React from "react";

export default function ResultPage({ comparisonResult, error }) {
    console.log(comparisonResult)
  return (
    <div className="result-box">
      {error ? (
        <p className="error-message">Insufficient user fields: {error}</p>
      ) : (
        
        <p className="result-message">N-Gram Comparison:{comparisonResult.ngrams.ngrams} </p>
      )}
    </div>
  );
}
