import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Aboutimg from "../assets/zenro.jpg"
import "./About.css";

function About() {
  return (
    <div className="about-page page-fade-in">
      {/* Hero / Intro Section */}
      <section className="about-hero">
        <h1 className="fw-bold display-5">About ZenRo Wears</h1>
        <p className="lead mt-3">
          “Simplicity is the ultimate sophistication.” — Leonardo da Vinci
        </p>
      </section>

      {/* Story Section */}
      <section className="about-grid container">
        <article className="about-card">
          <h2>Our story</h2>
          <p>
            Born in Lagos, ZenRo set out to design pieces that feel effortless yet intentional—garments you can wear from sunrise hustles to moonlit hangouts.
          </p>
        </article>

        <article className="about-card">
          <h2>What drives us</h2>
          <ul>
            <li>Premium fabrics sourced responsibly</li>
            <li>Small-batch drops to keep outfits exclusive</li>
            <li>Community-first collaborations</li>
          </ul>
        </article>

        <article className="about-card">
          <h2>Join the tribe</h2>
          <p>
            Follow @ZenRoWears, tag your fits, and be part of every launch. Your voice shapes our next collection.
          </p>
        </article>
      </section>

      {/* Philosophy Section */}
      <section className="about-highlight container">
        <div>
          <h3>Vision</h3>
          <p>Empowering creatives with wardrobe staples that speak calm confidence.</p>
        </div>
        <div>
          <h3>Values</h3>
          <p>Quality, authenticity, consistency.</p>
        </div>
        <div>
          <h3>Promise</h3>
          <p>Deliver fits that look premium, feel comfortable, and stay accessible.</p>
        </div>
      </section>
    </div>
  );
}

export default About;