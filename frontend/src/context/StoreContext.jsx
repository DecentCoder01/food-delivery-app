import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-app-8g01.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Banner State
  const [bannerData, setBannerData] = useState(null);

  // Update Banner 
  const updateBanner = (cart) => {
    if (!food_list || food_list.length === 0) return;

    let totalItems = 0;
    let totalPrice = 0;

    for (const id in cart) {
      const qty = cart[id];
      if (qty > 0) {
        totalItems += qty;

        const product = food_list.find((p) => p._id === id);
        if (product) {
          totalPrice += product.price * qty;
        }
      }
    }

    if (totalItems === 0) {
      setBannerData(null);    // hide banner
    } else {
      setBannerData({
        totalItems,
        totalPrice,
      });
    }
  };

  // ADD to CART

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = {
        ...prev,
        [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
      };
      updateBanner(updated);
      return updated;
    });

    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  // REMOVE from CART

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = {
        ...prev,
        [itemId]: prev[itemId] - 1,
      };

      if (updated[itemId] <= 0) delete updated[itemId];

      updateBanner(updated);
      return updated;
    });

    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  // TOTAL CART AMOUNT

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    if (!food_list || food_list.length === 0) return totalAmount;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Fetch Food List

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  // Fetch Cart from Backend

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
    updateBanner(response.data.cartData);
  };

  
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextvalue = {
    food_list,
    cartItems,
    bannerData,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
