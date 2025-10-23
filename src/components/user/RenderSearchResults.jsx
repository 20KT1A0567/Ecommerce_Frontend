import React from "react";
import { useNavigate } from "react-router-dom";

const RenderSearchResults = ({
  searchQuery,
  searchResults,
  loading,
  cart,
  setCart,
}) => {
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleNavigate = (product) => {
    const category = product.category?.toLowerCase() || "";

    switch (category) {
      case "laptops":
        navigate("/laptopsdetails", { state: { item: product } });
        break;
      case "grocery":
        navigate("/grocerydetails", { state: { item: product } });
        break;
      case "cosmetics":
        navigate("/cosmeticsdetails", { state: { item: product } });
        break;
      case "electronics":
        navigate("/electronicsdetails", { state: { item: product } });
        break;
      case "kids":
        navigate("/kidsdetails", { state: { item: product } });
        break;
      case "men":
        navigate("/mendetails", { state: { item: product } });
        break;
      case "toys":
        navigate("/toysdetails", { state: { item: product } });
        break;
      case "women":
        navigate("/womendetails", { state: { item: product } });
        break;
      case "footwear":
        navigate("/footweardetails", { state: { item: product } });
        break;
      case "mobiles":
        navigate("/mobiledetails", { state: { item: product } });
        break;
      default:
        navigate("/error");
        break;
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!searchResults.length && searchQuery) {
    return <p className="no-results">No products found for "{searchQuery}"</p>;
  }

  return (
    <div className="search-results">
      {searchResults.map((product, index) => (
        <div key={index} className="search-result-item">
          <img
            src={product.image || "https://via.placeholder.com/200"}
            alt={product.name || "Product"}
            className="product-image"
            onClick={() => handleNavigate(product)}
          />
          <strong className="product-name">{product.name}</strong>
          <p className="product-price">₹{product.price}</p>
          <div className="button-group">
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="details-button"
              onClick={() => handleNavigate(product)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderSearchResults;
