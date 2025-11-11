import { Link } from "react-router-dom";
import "./Home.css";
import ZenRo from "../assets/Zenro.jpg"; 
import WhiteTee from "../assets/White-Tee.png";
import hoodie from "../assets/hoodie.png"
import joggers from "../assets/joggers.png"

const products = [
  {
    id: 1,
    name: "Zen Classic Tee",
    image: WhiteTee,
    price: 39500,
  },
  {
    id: 2,
    name: "Zen Hoodie",
    image: hoodie,
    price: 45000,
  },
  {
    id: 3,
    name: "Zen Joggers",
    image: joggers,
    price: 63000,
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage:   `url(${ZenRo})` }}>
        <div className="overlay"></div> {/* ← Added overlay div */}
        <div className="hero-content">
          <h1>Welcome to ZenRo Wears</h1>
          <p>Luxury • Streetwear • Style</p>
          <Link to="/shop" className="explore-btn">Explore Collection</Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured">
        <h2>Featured Pieces</h2>
        <div className="product-grid">
          {products.map((item) => (
            <Link to="/shop" className="product-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="product-info">
                <h3>{item.name}</h3>
                <p>₦{item.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;