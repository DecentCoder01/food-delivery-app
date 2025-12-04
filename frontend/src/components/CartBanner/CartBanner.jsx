import React, { useContext, useEffect, useState } from "react";
import "./CartBanner.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";

const CartBanner = () => {
  const { cartItems, getTotalCartAmount } = useContext(StoreContext);

  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();   // ⭐ Added

  // ⭐ If user is already on /cart page, then hide the banner
  useEffect(() => {
    if (location.pathname === "/cart") {
      setShowBanner(false);
      return;
    }
  }, [location.pathname]);


  // Check if cart is empty
  useEffect(() => {
    if (location.pathname === "/cart") {
      setShowBanner(false);
      return;
    }

    const hasItems = Object.values(cartItems).some((qty) => qty > 0);
    setShowBanner(hasItems);
  }, [cartItems, location.pathname]);   // ⭐ location dependency


  if (!showBanner) return null;

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalPrice = getTotalCartAmount();

  return (
    <div className="cart-banner">
      <div className="cart-banner-left">
        <p className="cart-banner-title">🛒 {totalItems} items added</p>
        <p className="cart-banner-price">₹{totalPrice}</p>
      </div>

      <button className="cart-banner-btn" onClick={() => navigate("/cart")}>
        Go to Cart →
      </button>

      <span className="cart-banner-close" onClick={() => setShowBanner(false)}>
        ✖
      </span>
    </div>
  );
};

export default CartBanner;
