import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Aboutimg from "../assets/Zenro.jpg"
import './About.css';

function About() {
  return (
    <div className="about-page">
      {/* Hero / Intro Section */}
      <section className="bg-dark text-light text-center py-5">
        <div className="container">
          <h1 className="fw-bold display-5">About ZenRo Wears</h1>
          <p className="lead mt-3">
            “Simplicity is the ultimate sophistication.” — Leonardo da Vinci
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src= {Aboutimg}
                alt="ZenRo Studio"
                className="img-fluid rounded shadow-sm"
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-semibold mb-3">The Essence of ZenRo</h2>
              <p className="text-secondary">
                ZenRo Wears was born from the idea that fashion should express thought,
                not just style. Each design carries a sense of reflection — merging art,
                curiosity, and individuality.
              </p>
              <p className="text-secondary">
                Inspired by Da Vinci’s pursuit of balance between creativity and logic,
                ZenRo designs speak to the thinker, the dreamer, and the creator.
              </p>
              <p className="text-secondary">
                Every stitch, every tone, every curve in our logo reflects that quiet
                dialogue between art and reason — between simplicity and depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-semibold mb-4">The ZenRo Mindset</h2>
          <p className="col-md-8 mx-auto text-secondary">
            At ZenRo, creation isn’t rushed — it’s studied, felt, and understood.
            We believe that imperfection is beauty, that silence holds meaning,
            and that fashion is another language of philosophy.
          </p>
          <p className="col-md-8 mx-auto text-secondary mt-3">
            Our goal isn’t just to design clothes — it’s to awaken a mindset:
            to remind you that art can be worn, and thought can be seen.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;