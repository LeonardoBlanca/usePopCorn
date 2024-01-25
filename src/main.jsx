import React, { useState } from "react";

import ReactDOM from "react-dom/client";
import App from './App.jsx'
import './index.css'
import StarRating from "./StarRating";

function Test() {
  // Esse setMovieRating vai ser passado lá no componente StarRating
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating}/>
      <p>This movies was rated {movieRating} stars</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating
      size={24}
      color="red"
      className="test"
      defaultRating={3}
      buttonText="Limpar"
    />
    <Test /> */}
  </React.StrictMode>
);
