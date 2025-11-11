import React from "react";
import { Link } from "react-router-dom";
import "./ComingSoon.css";


function ComingSoon() {
    return (
    <div className="comingsoon-page">
        <h1>Coming Soon</h1>
        <p>
          This zenRo wears is currently in production.
          <br />
          Stay tuned for the offical drop!  
        </p>
        <Link to="/" className="back-btn">Home</Link>
    </div>
    );
}

export default ComingSoon;