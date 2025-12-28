/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let unsubscribeCart = null;

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      hydratedRef.current = false;

      if (unsubscribeCart) {
        unsubscribeCart();
        unsubscribeCart = null;
      }

      if (!currentUser) {
        setCart([]);
        return;
      }

      const cartRef = doc(db, "carts", currentUser.uid);
      unsubscribeCart = onSnapshot(
        cartRef,
        (snapshot) => {
          hydratedRef.current = true;
          if (snapshot.exists()) {
            setCart(snapshot.data().items || []);
          } else {
            setCart([]);
          }
        },
        (error) => console.error("Cart listener error:", error)
      );
    });

    return () => {
      if (unsubscribeCart) unsubscribeCart();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser || !hydratedRef.current) return;

    const cartRef = doc(db, "carts", currentUser.uid);
    (async () => {
      try {
        await setDoc(
          cartRef,
          { items: cart, updatedAt: Date.now() },
          { merge: true }
        );
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    })();
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}