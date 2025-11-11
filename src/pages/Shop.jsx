import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Shop.css";
import WhiteTee from "../assets/White-Tee.png";
import hoodie from "../assets/hoodie.png";
import joggers from "../assets/joggers.png";
import Sleeveless from "../assets/Sleeveless.png"
import VarsityJacket from "../assets/Varsity-Jacket.png"
import Tracksuit from "../assets/Track-suit.png"
import Sweaterblack from "../assets/Sweater-black.png"
import streetwear from "../assets/streetwear.png"
import RainProofJacket from "../assets/Rain-ProofJacket.png"
import Puffervest from "../assets/Puffer-vest.png"
import pufferjacket from "../assets/puffer-jacket.png"
import PremiumTee from "../assets/Premium-Tee.png"
import PremiumJacket from "../assets/Premium-Jacket.png"
import overshirt from "../assets/overshirt.png"
import OverShirtSlik from "../assets/Over-Shirt-Slik.png"
import mattejacket from "../assets/matte-jacket.png"
import LuxuryTrousers from "../assets/Luxury-Trousers.png"
import KnitSweater from "../assets/Knit-Sweater.png"
import kimonoJacket from "../assets/kimono-Jacket.png"
import GraphicsTee from "../assets/Graphics-Tee.png"
import Flannel from "../assets/Flannel.png"
import CargoPants from "../assets/Cargo-Pants.png"
import BrownHoodie from "../assets/BrownHoodie.png"
import BlackTee from "../assets/Black-Tee.png"
import ZenClassicTee from "../assets/Zen Classic Tee.png"
import cap from "../assets/cap.png"
import LeatherPremiumJacket from "../assets/Leather-Premium-Jacket.png"



function Shop({ addToCart }) {
  // 🧱 Product Data
const products = [
  {
    id: 1,
    name: "ZenRo Classic Tee",
    price: 39500,
    image: WhiteTee,
    description: "Minimalist streetwear piece — calm yet bold.",
    available: true,
  },
  {
    id: 2,
    name: "ZenRo Black Hoodie",
    price: 45000,
    image: hoodie,
    description: "Soft cotton comfort with the ZenRo mark of depth.",
    comingSoon: true,
  },
  {
    id: 3,
    name: "ZenRo Joggers",
    price: 63000,
    image: joggers,
    description: "Sleek streetwear bottoms — move freely in style.",
    available: true,
  },
  {
    id: 4,
    name: "ZenRo Black Sleeveless",
    price: 44000,
    image: Sleeveless,
    description: "Cozy and versatile — perfect for layering.",
    available: false,
  },
  {
    id: 5,
    name: "ZenRo Varsity Jacket",
    price: 46000,
    image: VarsityJacket,
    description: "Classic varsity design with a modern street twist.",
    available: false,
  },
  {
    id: 6,
    name: "ZenRo Track-suit",
    price: 56000,
    image: Tracksuit,
    description: "Athleisure essential — style and comfort in one.",
    comingSoon: true,
  },
  {
    id: 7,
    name: "ZenRo Black Sweat-Shirt ",
    price: 40000,
    image: Sweaterblack,
    description: "Minimalist black sweat-Shirt — timeless and practical.",
    available: true,
  },
  {
    id: 8,
    name: "ZenRo Streetwear",
    price: 31000,
    image: streetwear,
    description: "Effortless street style — everyday wear made easy.",
   comingSoon: true,
  },
  {
    id: 9,
    name: "ZenRo Rain-Proof Jacket",
    price: 60000,
    image: RainProofJacket,
    description: "Stay dry in style — perfect for unpredictable weather.",
   comingSoon:true,
  },
  {
    id: 10,
    name: "ZenRo Puffer-Vest",
    price: 96000,
    image: Puffervest,
    description: "Lightweight layering — warmth without bulk.",
   comingSoon:true,
  },
  {
    id: 11,
    name: "ZenRo Puffer-Jacket",
    price: 100000,
    image: pufferjacket,
    description: "Statement winter jacket — sleek and cozy.",
   comingSoon:true,
  },
  {
    id: 12,
    name: "ZenRo Premium Tee",
    price: 35000,
    image: PremiumTee,
    description: "Soft premium cotton — elevated casual wear.",
    available: true,
  },
  {
    id: 13,
    name: "ZenRo Premium Jacket",
    price: 150000,
    image: PremiumJacket,
    description: "Refined outerwear — style meets quality.",
   comingSoon:true,
  },
  {
    id: 14,
    name: "ZenRo Overshirt",
    price: 60000,
    image: overshirt,
    description: "Layer it up — casual comfort with edge.",
   comingSoon:true,
  },
  {
    id: 15,
    name: "ZenRo Over-Shirt Slik",
    price: 67000,
    image: OverShirtSlik,
    description: "Silky smooth finish — dress up or down effortlessly.",
   comingSoon:true,
  },
  {
    id: 16,
    name: "ZenRo Matte Jacket",
    price: 90000,
    image: mattejacket,
    description: "Matte finish for a subtle yet bold look.",
    available: false,
  },
  {
    id: 17,
    name: "ZenRo Luxury Trousers",
    price: 59000,
    image: LuxuryTrousers,
    description: "Smart-casual bottoms — comfort meets elegance.",
    available: true,
  },
  {
    id: 18,
    name: "ZenRo Knit Sweater",
    price: 65000,
    image: KnitSweater,
    description: "Handsome knit texture — warmth with style.",
    available: true,
  },
  {
    id: 19,
    name: "ZenRo Kimono Jacket",
    price: 150000,
    image: kimonoJacket,
    description: "Inspired by traditional style — modern street-ready.",
    available: true,
  },
  {
    id: 20,
    name: "ZenRo Graphics Tee",
    price: 26000,
    image: GraphicsTee,
    description: "Expressive graphics — make a statement effortlessly.",
    available: true,
  },
  {
    id: 21,
    name: "ZenRo Flannel",
    price: 35000,
    image: Flannel,
    description: "Classic flannel check — cozy and versatile.",
    available: true,
  },
  {
    id: 22,
    name: "ZenRo Cargo Pants",
    price: 30000,
    image: CargoPants,
    description: "Functional pockets, rugged style — everyday utility.",
    available: true,
  },
  {
    id: 23,
    name: "ZenRo Brown Hoodie",
    price: 50000,
    image: BrownHoodie,
    description: "Earthy tones with cozy comfort — perfect daily wear.",
    available: true,
  },
  {
    id: 24,
    name: "ZenRo Black Tee",
    price: 33000,
    image: BlackTee,
    description: "Timeless black tee — effortless casual staple.",
    available: true,
  },
  {
    id: 25,
    name: "ZenRo Zen Classic Tee",
    price: 30000,
    image: ZenClassicTee,
    description: "Signature style — minimal, clean, and confident.",
    available: true,
  },
  {
    id: 26,
    name: "ZenRo Cap",
    price: 21000,
    image: cap,
    description: "Complete your look — stylish headwear essential.",
    available: true,
  },
  {
    id: 27,
    name: "ZenRo Leather Premium Jacket",
    price: 55000,
    image: LeatherPremiumJacket,
    description: "Luxury leather outerwear — premium finish, bold style.",
    comingSoon: true,
  },

  ];

  return (
    <div className="shop-page py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center">ZenRo Collections</h2>
        <p className="text-center text-secondary mb-5">
          Discover pieces that speak the language of balance, thought, and style.
        </p>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-sm-6 col-md-4">
              <div className="card h-100 border-0 shadow-sm position-relative">
                {/* 🖼 Image */}
                <div className="image-wrapper position-relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top rounded-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  {/* 🩶 Overlays */}
                  {!product.available && !product.comingSoon && (
                    <div className="overlay-text">Available Again Soon</div>
                  )}
                  {product.comingSoon && (
                    <div className="overlay-text">Coming Soon</div>
                  )}
                </div>

                {/* 🧾 Product Info */}
                <div className="card-body text-center">
                  <h5 className="fw-semibold">{product.name}</h5>
                  <p className="text-muted small">{product.description}</p>
                  <p className="fw-bold">₦{product.price.toLocaleString()}</p>

                  {/* 🛒 Buttons */}
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-dark rounded-pill px-4">
                      Discover
                    </button>
                    <button
                      className="btn btn-dark rounded-pill px-4"
                      onClick={() => addToCart(product)}
                      disabled={!product.available || product.comingSoon}
                      style={{
                        opacity:
                          !product.available || product.comingSoon ? 0.6 : 1,
                        cursor:
                          !product.available || product.comingSoon
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {product.comingSoon
                        ? "Coming Soon"
                        : !product.available
                        ? "Unavailable"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;