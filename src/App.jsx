import { useEffect, useMemo, useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "./Firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./pages/AdminRoute";

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Derive cart count cheaply
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  // --- AUTH & CART HYDRATION ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadError(null);

      if (!currentUser) {
        setCart([]);
        setInitialising(false);
        return;
      }

      try {
        const cartRef = doc(db, "carts", currentUser.uid);
        const snapshot = await getDoc(cartRef);
        const firestoreCart = snapshot.exists() ? snapshot.data().items || [] : [];
        setCart(firestoreCart);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setLoadError("We couldn't load your cart. Try refreshing.");
        setCart([]);
      } finally {
        setInitialising(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- FIRESTORE SYNC (debounced) ---
  useEffect(() => {
    if (!user || initialising) return;

    setSyncing(true);
    const timeout = setTimeout(async () => {
      try {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(
          cartRef,
          { items: cart.map((item) => ({ ...item, price: Number(item.price) || 0 })) },
          { merge: true }
        );
      } catch (error) {
        console.error("Failed to sync cart:", error);
      } finally {
        setSyncing(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [cart, user, initialising]);

  // --- CART HELPERS ---
  const addToCart = useCallback(
    (product) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { id, size, quantity = 1 } = product;
      if (!id) return;

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.id === id && item.size === size
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        return [...prev, { ...product, quantity }];
      });
    },
    [navigate, user]
  );

  const removeFromCart = useCallback((id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  }, []);

  const updateQuantity = useCallback((id, size, nextQuantity) => {
    if (nextQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity: nextQuantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (!user) return;
    try {
      await setDoc(doc(db, "carts", user.uid), { items: [] }, { merge: true });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [user]);

  if (initialising) {
    return <LoadingSpinner message="Loading ZenRo..." />;
  }

  return (
    <ErrorBoundary>
      <Navbar
        cartCount={cartCount}
        syncing={syncing}
        user={user}
        clearCart={clearCart}
      />

      {loadError && (
        <div className="alert alert-warning text-center m-0 rounded-0">
          {loadError}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/cart"
          element={
            user ? (
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/checkout"
          element={
            cart.length > 0 ? (
              <Checkout cart={cart} clearCart={clearCart} />
            ) : (
              <Navigate to="/shop" replace />
            )
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/myorders"
          element={user ? <MyOrders /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </ErrorBoundary>
  );
}

export default App;