import React from "react";
import { useNavigate } from "react-router-dom";

const RenderSearchResults = ({ searchQuery, searchResults, loading, cart, setCart }) => {
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
    const category = product.category.toLowerCase();
    
    if (category === "laptops") {
      navigate("/laptopsdetails", { state: { item: product } });
    } else if(category === "grocery"){
      navigate(`/grocerydetails`, { state: { item: product } });
    }else if(category === "cosmetics"){
      navigate(`/cosmeticsdetails`, { state: { item: product } });
    }else if(category === "electronics"){
      navigate(`/electronicsdetails`, { state: { item: product } });
    }else if(category === "kids"){
      navigate(`/kidsdetails`, { state: { item: product } });
    }else if(category === "men"){
      navigate(`/mendetails`, { state: { item: product } });
    }else if(category === "toys"){
      navigate(`/toysdetails`, { state: { item: product } });
    }else if(category === "women"){
      navigate(`/womendetails`, { state: { item: product } });
    }else if(category === "footwear"){
      navigate(`/footweardetails`, { state: { item: product } });
    }else if(category === "mobiles"){
      navigate(`/mobiledetails`, { state: { item: product } });
    }else{
      navigate('/error')
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!searchResults.length) {
    return <p className="no-results">No products found for "{searchQuery}"</p>;
  }

  return (
    <div className="search-results">
      {searchResults.map((product, index) => (
        <div key={index} className="search-result-item">
          <img
            src={product.image || "https://via.placeholder.com/200"}
            alt={product.name || "Product"}
          />
          <strong>{product.name}</strong>
          <p className="price">₹{product.price}</p>
          <button
            className="add-to-cart-button"

            onClick={(e) => handleNavigate(e, product)}
          >
            Add to Cart

          </button>
        </div>
      ))}
    </div>
  );
};

export default RenderSearchResults;
