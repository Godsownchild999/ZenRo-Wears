import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import ProductSkeleton from "../components/ProductSkeleton";
import "./Shop.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the import based on your file structure
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../Firebase"; // adjust path if needed

import WhiteTee from "../assets/white-tee.png";
import Hoodie from "../assets/hoodie.png";
import Joggers from "../assets/joggers.png";
import Sleeveless from "../assets/sleeveless.png";
import VarsityJacket from "../assets/varsity-jacket.png";
import TrackSuit from "../assets/track-suit.png";
import SweaterBlack from "../assets/sweater-black.png";
import Streetwear from "../assets/streetwear.png";
import RainProofJacket from "../assets/rain-proof-jacket.png";
import PufferVest from "../assets/puffer-vest.png";
import PufferJacket from "../assets/puffer-jacket.png";
import PremiumTee from "../assets/premium-tee.png";
import PremiumJacket from "../assets/premium-jacket.png";
import OverShirt from "../assets/overshirt.png";
import OverShirtSilk from "../assets/over-shirt-silk.png";
import MatteJacket from "../assets/matte-jacket.png";
import LuxuryTrousers from "../assets/luxury-trousers.png";
import KnitSweater from "../assets/knit-sweater.png";
import KimonoJacket from "../assets/kimono-jacket.png";
import GraphicsTee from "../assets/graphics-tee.png";
import Flannel from "../assets/flannel.png";
import CargoPants from "../assets/cargo-pants.png";
import BrownHoodie from "../assets/brown-hoodie.png";
import BlackTee from "../assets/black-tee.png";
import ZenClassicTee from "../assets/zen-classic-tee.png";
import Cap from "../assets/cap.png";
import leatherPremiumJacket from "../assets/leather-premium-jacket.png";

const priceRanges = [
  { label: "All", test: () => true },
  { label: "Under ₦40,000", test: (price) => price < 40000 },
  {
    label: "₦40,000 – ₦70,000",
    test: (price) => price >= 40000 && price <= 70000,
  },
  { label: "Above ₦70,000", test: (price) => price > 70000 },
];

const categories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Jackets",
  "Trousers",
  "Joggers",
  "Shirts",
  "Sportswear",
  "Accessories",
];

const fallbackProducts = [
  {
    id: 1,
    name: "ZenRo Classic Tee",
    price: 39500,
    category: "T-Shirts",
    images: { front: WhiteTee, back: WhiteTee },
    sizes: ["S", "M", "L", "XL"],
    description: "Minimalist streetwear piece — calm yet bold.",
    status: "available",
  },
  {
    id: 2,
    name: "ZenRo Black Hoodie",
    price: 45000,
    category: "Hoodies",
    images: { front: Hoodie, back: Hoodie },
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Soft cotton comfort with the ZenRo mark of depth.",
    status: "coming-soon",
  },
  {
    id: 3,
    name: "ZenRo Joggers",
    price: 63000,
    category: "Joggers",
    images: { front: Joggers, back: Joggers },
    sizes: ["S", "M", "L", "XL"],
    description: "Sleek streetwear bottoms — move freely in style.",
    status: "available",
  },
  {
    id: 4,
    name: "ZenRo Black Sleeveless",
    price: 44000,
    category: "T-Shirts",
    images: { front: Sleeveless, back: Sleeveless },
    sizes: ["S", "M", "L", "XL"],
    description: "Cozy and versatile — perfect for layering.",
    status: "out-of-stock",
  },
  {
    id: 5,
    name: "ZenRo Varsity Jacket",
    price: 46000,
    category: "Jackets",
    images: { front: VarsityJacket, back: VarsityJacket },
    sizes: ["M", "L", "XL"],
    description: "Classic varsity design with a modern street twist.",
    status: "out-of-stock",
  },
  {
    id: 6,
    name: "ZenRo Track Suit",
    price: 56000,
    category: "Sportswear",
    images: { front: TrackSuit, back: TrackSuit },
    sizes: ["S", "M", "L", "XL"],
    description: "Athleisure essential — style and comfort in one.",
    status: "coming-soon",
  },
  {
    id: 7,
    name: "ZenRo Black Sweatshirt",
    price: 40000,
    category: "Hoodies",
    images: { front: SweaterBlack, back: SweaterBlack },
    sizes: ["S", "M", "L", "XL"],
    description: "Minimalist black sweatshirt — timeless and practical.",
    status: "available",
  },
  {
    id: 8,
    name: "ZenRo Streetwear Tee",
    price: 31000,
    category: "T-Shirts",
    images: { front: Streetwear, back: Streetwear },
    sizes: ["S", "M", "L", "XL"],
    description: "Effortless street style — everyday wear made easy.",
    status: "coming-soon",
  },
  {
    id: 9,
    name: "ZenRo Rain-Proof Jacket",
    price: 60000,
    category: "Jackets",
    images: { front: RainProofJacket, back: RainProofJacket },
    sizes: ["M", "L", "XL"],
    description: "Stay dry in style — perfect for unpredictable weather.",
    status: "coming-soon",
  },
  {
    id: 10,
    name: "ZenRo Puffer Vest",
    price: 96000,
    category: "Jackets",
    images: { front: PufferVest, back: PufferVest },
    sizes: ["S", "M", "L", "XL"],
    description: "Lightweight layering — warmth without bulk.",
    status: "coming-soon",
  },
  {
    id: 11,
    name: "ZenRo Puffer Jacket",
    price: 100000,
    category: "Jackets",
    images: { front: PufferJacket, back: PufferJacket },
    sizes: ["M", "L", "XL"],
    description: "Statement winter jacket — sleek and cozy.",
    status: "coming-soon",
  },
  {
    id: 12,
    name: "ZenRo Premium Tee",
    price: 35000,
    category: "T-Shirts",
    images: { front: PremiumTee, back: PremiumTee },
    sizes: ["S", "M", "L", "XL"],
    description: "Soft premium cotton — elevated casual wear.",
    status: "available",
  },
  {
    id: 13,
    name: "ZenRo Premium Jacket",
    price: 150000,
    category: "Jackets",
    images: { front: PremiumJacket, back: PremiumJacket },
    sizes: ["M", "L", "XL"],
    description: "Refined outerwear — style meets quality.",
    status: "coming-soon",
  },
  {
    id: 14,
    name: "ZenRo Overshirt",
    price: 60000,
    category: "Shirts",
    images: { front: OverShirt, back: OverShirt },
    sizes: ["S", "M", "L", "XL"],
    description: "Layer it up — casual comfort with edge.",
    status: "coming-soon",
  },
  {
    id: 15,
    name: "ZenRo Silk Overshirt",
    price: 67000,
    category: "Shirts",
    images: { front: OverShirtSilk, back: OverShirtSilk },
    sizes: ["S", "M", "L", "XL"],
    description: "Silky smooth finish — dress up or down effortlessly.",
    status: "coming-soon",
  },
  {
    id: 16,
    name: "ZenRo Matte Jacket",
    price: 90000,
    category: "Jackets",
    images: { front: MatteJacket, back: MatteJacket },
    sizes: ["M", "L", "XL"],
    description: "Matte finish for a subtle yet bold look.",
    status: "out-of-stock",
  },
  {
    id: 17,
    name: "ZenRo Luxury Trousers",
    price: 59000,
    category: "Trousers",
    images: { front: LuxuryTrousers, back: LuxuryTrousers },
    sizes: ["30", "32", "34", "36"],
    description: "Smart-casual bottoms — comfort meets elegance.",
    status: "available",
  },
  {
    id: 18,
    name: "ZenRo Knit Sweater",
    price: 65000,
    category: "Hoodies",
    images: { front: KnitSweater, back: KnitSweater },
    sizes: ["S", "M", "L", "XL"],
    description: "Handsome knit texture — warmth with style.",
    status: "available",
  },
  {
    id: 19,
    name: "ZenRo Kimono Jacket",
    price: 150000,
    category: "Jackets",
    images: { front: KimonoJacket, back: KimonoJacket },
    sizes: ["M", "L", "XL"],
    description: "Inspired by tradition — modern street-ready.",
    status: "available",
  },
  {
    id: 20,
    name: "ZenRo Graphics Tee",
    price: 26000,
    category: "T-Shirts",
    images: { front: GraphicsTee, back: GraphicsTee },
    sizes: ["S", "M", "L", "XL"],
    description: "Expressive graphics — make a statement effortlessly.",
    status: "available",
  },
  {
    id: 21,
    name: "ZenRo Flannel Shirt",
    price: 35000,
    category: "Shirts",
    images: { front: Flannel, back: Flannel },
    sizes: ["S", "M", "L", "XL"],
    description: "Classic flannel check — cozy and versatile.",
    status: "available",
  },
  {
    id: 22,
    name: "ZenRo Cargo Pants",
    price: 30000,
    category: "Trousers",
    images: { front: CargoPants, back: CargoPants },
    sizes: ["30", "32", "34", "36"],
    description: "Functional pockets, rugged style — everyday utility.",
    status: "available",
  },
  {
    id: 23,
    name: "ZenRo Brown Hoodie",
    price: 50000,
    category: "Hoodies",
    images: { front: BrownHoodie, back: BrownHoodie },
    sizes: ["S", "M", "L", "XL"],
    description: "Earthy tones with cozy comfort — perfect daily wear.",
    status: "available",
  },
  {
    id: 24,
    name: "ZenRo Black Tee",
    price: 33000,
    category: "T-Shirts",
    images: { front: BlackTee, back: BlackTee },
    sizes: ["S", "M", "L", "XL"],
    description: "Timeless black tee — effortless casual staple.",
    status: "available",
  },
  {
    id: 25,
    name: "ZenRo Classic Tee",
    price: 30000,
    category: "T-Shirts",
    images: { front: ZenClassicTee, back: ZenClassicTee },
    sizes: ["S", "M", "L", "XL"],
    description: "Signature style — minimal, clean, and confident.",
    status: "available",
  },
  {
    id: 26,
    name: "ZenRo Cap",
    price: 21000,
    category: "Accessories",
    images: { front: Cap, back: Cap },
    sizes: ["One Size"],
    description: "Complete your look — stylish headwear essential.",
    status: "available",
  },
  {
    id: "leather-premium-jacket",
    name: "Leather Premium Jacket",
    price: 155000,
    category: "Jackets",
    images: { front: leatherPremiumJacket, back: leatherPremiumJacket },
    sizes: ["M", "L", "XL"],
    description: "Luxury leather outerwear — premium finish, bold style.",
    status: "coming-soon",
  },
];

function FilterPanel({
  open,
  onClose,
  onApply,
  onReset,
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
}) {
  if (!open) return null;

  return (
    <div className="filter-overlay" role="dialog" aria-modal="true">
      <div className="filter-panel">
        <header className="filter-panel__header">
          <h3>Filter &amp; sort</h3>
          <button
            type="button"
            className="filter-panel__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </header>

        <section className="filter-panel__section">
          <h4>Categories</h4>
          <div className="filter-chip-grid">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-chip ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="filter-panel__section">
          <h4>Price range</h4>
          <div className="filter-chip-grid">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                type="button"
                className={`filter-chip ${
                  selectedPrice === range.label ? "active" : ""
                }`}
                onClick={() => onPriceChange(range.label)}
                aria-pressed={selectedPrice === range.label}
              >
                {range.label}
              </button>
            ))}
          </div>
        </section>

        <footer className="filter-panel__footer">
          <button type="button" className="btn btn-light" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="btn btn-dark" onClick={onApply}>
            Apply filters
          </button>
        </footer>
      </div>
    </div>
  );
}

FilterPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  selectedPrice: PropTypes.string.isRequired,
  onPriceChange: PropTypes.func.isRequired,
};

function Shop({ addToCart }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ref = collection(db, "products");
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Products snapshot:", items);
        setLiveProducts(items);
        setLoading(false);
      },
      (err) => {
        console.error("Products listener failed:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setVisibleCount(9);
  }, [selectedCategory, priceRange, searchQuery]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (quickViewProduct) setQuickViewProduct(null);
        if (isFilterOpen) setIsFilterOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [quickViewProduct, isFilterOpen]);

  useEffect(() => {
    const shouldLock = Boolean(quickViewProduct || isFilterOpen);
    document.body.style.overflow = shouldLock ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickViewProduct, isFilterOpen]);

  const productsSource = useMemo(() => {
    if (!liveProducts.length) return fallbackProducts;

    const buildKey = (item) => {
      const base = item?.slug ?? item?.name ?? item?.id;
      if (typeof base === "string" && base.trim()) return base.trim().toLowerCase();
      if (typeof base === "number") return String(base);
      return String(item?.id ?? item?.name ?? Math.random());
    };

    const merged = new Map();
    fallbackProducts.forEach((product) => {
      merged.set(buildKey(product), { ...product });
    });
    liveProducts.forEach((product) => {
      const key = buildKey(product);
      const existing = merged.get(key) ?? {};
      merged.set(key, {
        ...existing,
        ...product,
      });
    });

    return Array.from(merged.values());
  }, [liveProducts]);

  const filteredProducts = useMemo(() => {
    const priceTest =
      priceRanges.find((option) => option.label === priceRange)?.test ??
      priceRanges[0].test;

    return productsSource.filter((product) => {
      const description = (product.description ?? "").toLowerCase();
      const name = (product.name ?? "").toLowerCase();
      const matchesSearch =
        !searchQuery ||
        name.includes(searchQuery.toLowerCase()) ||
        description.includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesPrice = priceTest(Number(product.price) || 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [productsSource, searchQuery, selectedCategory, priceRange]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleProductSelect = (product) => {
    if (product.status === "available") {
      setQuickViewProduct(product);
      return;
    }

    if (product.status === "coming-soon") {
      setToast({
        tone: "info",
        message: "🔥 This product is coming soon. Stay tuned!",
      });
      return;
    }

    if (product.status === "out-of-stock") {
      setToast({
        tone: "error",
        message: "😔 This product is currently out of stock.",
      });
    }
  };

  const handleQuickViewAdd = useCallback(
    (productWithOptions) => {
      addToCart(productWithOptions);
      setQuickViewProduct(null);
      setToast({
        tone: "success",
        message: `✅ ${productWithOptions.name} added to cart.`,
      });
    },
    [addToCart]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setPriceRange("All");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCredential.user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });
      // Optionally redirect or show success
    } catch (error) {
      alert("Sign up failed: " + error.message);
    }
  };

  return (
    <div className="shop-page page-fade-in">
      <div className="container py-5">
        <header className="shop-header text-center">
          <h2 className="fw-bold mb-3">ZenRo Collections</h2>
          <p className="text-secondary">
            Discover pieces that speak the language of balance, thought, and
            style.
          </p>
        </header>

        <div className="shop-controls">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setIsFilterOpen(true)}
          >
            <span aria-hidden="true">⚙️</span> Filter &amp; sort
          </button>
        </div>

        <section className="catalog-grid mt-5">
          {loading ? (
            Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)
          ) : displayedProducts.length ? (
            displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => handleProductSelect(product)}
              />
            ))
          ) : (
            <div className="no-results">
              <i className="fas fa-search" aria-hidden="true"></i>
              <p>No products found matching your criteria.</p>
              <button
                className="btn btn-dark rounded-pill px-4"
                onClick={() => {
                  setSearchQuery("");
                  handleResetFilters();
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {hasMore && !loading && (
            <div className="text-center mt-4">
              <button type="button" className="btn btn-outline-dark load-more" onClick={handleLoadMore}>
                Load more
              </button>
            </div>
          )}
        </section>
      </div>

      <FilterPanel
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onReset={() => {
          handleResetFilters();
          setSearchQuery("");
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPrice={priceRange}
        onPriceChange={setPriceRange}
      />

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          addToCart={handleQuickViewAdd}
        />
      )}

      {toast && (
        <div
          className={`shop-toast shop-toast--${toast.tone ?? "info"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

Shop.propTypes = {
  addToCart: PropTypes.func.isRequired,
};

export default Shop;
