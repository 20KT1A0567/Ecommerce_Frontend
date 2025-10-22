import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import './single.css';
import './user.css';
import logo from '../user/image.png';
import { useNavigate } from "react-router-dom";

const Displaymen = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  if (!item) {
    return <h1>Men's Wear Details not found.</h1>;
  }
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post(
        `https://demo-deployment2-1.onrender.com/api/cart/add/${userId}/men/${item.id}`,
        null,
        { params: { qty: quantity } }
      );
      const { data } = response;
      alert(`Added ${quantity} of ${item.name} to your cart!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item to the cart.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className="shopping-app">
        <div className="app-header">
          <div className="logo">
            <img src={logo} width={200} height={100} alt="Logo" />
          </div>

          <div className="cartlogin">
            <Link to="/" onClick={handleLogout}>
              <img
                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                width={50}
                height={50}
                className="login"
                alt="Logout Icon"
              />
            </Link>
            <Link to="/cart">
              <img
                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                width={100}
                height={100}
                className="login"
                alt="Cart Icon"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="cosmetic-container">
        <h2>{item.name} Details</h2>
        <div className="cosmetic-card">
          <img
            src={item.image || 'https://via.placeholder.com/300'}
            alt={item.name || "Men's Wear Image"}
            className="cosmetic-image"
          />
          <div className="cosmetic-details">
            <h3>{item.name || 'N/A'}</h3>
            <p className="cosmetic-description">{item.description || 'No description available.'}</p>
            <p className="cosmetic-price">
              <strong>Price:</strong> ₹{item.price || 'N/A'}
            </p>
            <div className="quantity-container">
              <button className="quantity-btn" onClick={decrementQuantity}>-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-btn" onClick={incrementQuantity}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Displaymen;
