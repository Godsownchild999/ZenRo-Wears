import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "./Firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsappFab from "./pages/WhatsappFab";

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
import WhiteTee from "./assets/white-tee.png";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function App() {
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("zenro:user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [initialising, setInitialising] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [cartAnnouncement] = useState(null);

  // Derive cart count cheaply
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  // --- AUTH & CART HYDRATION ---
  useEffect(() => {
    setInitialising(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!currentUser) {
          setUser(null);
          setCart([]);
          return;
        }

        const isAdmin = ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() ?? "");
        const nextUser = {
          id: currentUser.uid,
          name: currentUser.displayName ?? "ZenRo customer",
          displayName: currentUser.displayName ?? "",
          email: currentUser.email ?? "",
          isAdmin,
        };

        setUser(nextUser);

        try {
          const snapshot = await getDoc(doc(db, "carts", currentUser.uid));
          const remoteItems = snapshot.data()?.items;
          if (Array.isArray(remoteItems)) {
            setCart(remoteItems);
          }
        } catch (cartError) {
          console.warn("Failed to hydrate cart from Firestore:", cartError);
          setLoadError("Could not load your saved cart. Showing local items instead.");
        }
      } catch (authError) {
        console.error("Auth initialisation failed:", authError);
        setLoadError("We had trouble signing you in. Please refresh.");
        setUser(null);
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
        const cartRef = doc(db, "carts", user.id);
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
  const addToCart = useCallback((incomingProduct) => {
    setCart((prevCart) => {
      const normalized = {
        ...incomingProduct,
        id: incomingProduct.id,
        size: incomingProduct.size ?? incomingProduct.selectedSize ?? null,
        quantity: Number(incomingProduct.quantity) || 1,
        price: Number(incomingProduct.price) || 0,
        image: (() => {
          const candidates = [
            incomingProduct.image,
            incomingProduct.images?.front,
            incomingProduct.imageUrl,
            incomingProduct.frontImageUrl,
            incomingProduct.frontImage,
          ];
          for (const option of candidates) {
            if (typeof option === "string" && option.trim()) {
              return option.trim();
            }
          }
          return WhiteTee;
        })(),
      };

      const existingIndex = prevCart.findIndex(
        (item) => item.id === normalized.id && item.size === normalized.size
      );

      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + normalized.quantity,
        };
        return updated;
      }

      return [...prevCart, normalized];
    });
  }, []);

  const removeFromCart = useCallback((itemOrId) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => {
        if (typeof itemOrId === "object" && itemOrId !== null) {
          if (itemOrId.size) {
            return !(cartItem.id === itemOrId.id && cartItem.size === itemOrId.size);
          }
          return cartItem.id !== itemOrId.id;
        }
        return cartItem.id !== itemOrId;
      })
    );
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
      await setDoc(doc(db, "carts", user.id), { items: [] }, { merge: true });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [user]);

  const hideWhatsappFab = ["/checkout", "/order-success", "/admin"].includes(
    location.pathname
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("zenro:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("zenro:user");
    }
  }, [user]);

  const storageKey = useMemo(
    () => (user?.id ? `zenro:cart:${user.id}` : "zenro:cart:guest"),
    [user]
  );

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch {
      // ignore bad payloads
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const AdminGuard = useCallback(
    ({ children }) => {
      if (!user?.isAdmin) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
      }
      return children;
    },
    [user?.isAdmin, location.pathname]
  );

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

      <div aria-live="polite" className="sr-only">
        {cartAnnouncement}
      </div>

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
          element={<Checkout cart={cart} clearCart={clearCart} />}
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/myorders"
          element={user ? <MyOrders user={user} /> : <Navigate to="/login" replace />}
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
            <AdminGuard>
              <AdminDashboard user={user} />
            </AdminGuard>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <WhatsappFab
        phoneNumber="2349044592275"
        presetMessage="Hi ZenRo team, I'd like to finalise my order."
        hidden={hideWhatsappFab}
      />
    </ErrorBoundary>
  );
}

export default App;