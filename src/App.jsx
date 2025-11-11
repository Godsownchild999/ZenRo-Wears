import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Load cart when user logs in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const cartRef = doc(db, "carts", currentUser.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCart(cartSnap.data().items || []);
        } else {
          setCart([]);
        }
      } else {
        setCart([]); // clears local when logged out
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 💾 Save cart to Firestore only when user is logged in
  useEffect(() => {
    if (user && cart.length >= 0) {
      const saveCart = async () => {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: cart }, { merge: true });
      };
      saveCart();
    }
  }, [cart, user]);

  // 🛒 Add item
  const addToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 🧹 Clear cart locally
  const clearCart = () => {
    setCart([]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        clearCart={clearCart}
      />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/cart"
          element={
            user ? (
              <Cart cart={cart} removeFromCart={removeFromCart} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;