import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCartContext } from "./components/context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

// Add Razorpay to window object or import properly
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { data, setData } = useCartContext();
  const userId = localStorage.getItem("userId");

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const token = getAuthToken();
  const userName = localStorage.getItem("userName") || "Venkat";
  const userEmail = localStorage.getItem("userEmail") || "venkat@example.com";
  const navigate = useNavigate();

  // Debug function to check what's in data
  const debugData = () => {
    console.log("Cart Data:", data);
    console.log("User ID:", userId);
    console.log("Token:", token);
  };

  // Fetch cart data with authentication
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !token) {
        console.log("No user ID or token found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching cart for user:", userId);

        const response = await axios.get(
          `https://demo-deployment2-12.onrender.com/api/cart/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Full API Response:", response);
        console.log("Response Data:", response.data);

        // Handle different response structures
        const cartData = response.data;

        if (cartData.items) {
          setData(cartData.items);
        } else if (Array.isArray(cartData)) {
          setData(cartData);
        } else if (cartData.cart) {
          setData(cartData.cart.items || []);
        } else {
          console.warn("Unexpected API response structure:", cartData);
          setData([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        console.error("Error response:", error.response);

        if (error.response?.status === 401) {
          alert("Please log in again.");
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          navigate("/login");
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token, setData, navigate]);

  // Update quantity with authentication
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(
        `https://demo-deployment2-12.onrender.com/api/cart/update/${userId}/${itemId}`,
        null,
        {
          params: { qty: newQty },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setData((prev) =>
        prev.map(item =>
          item.id === itemId ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  // Remove item with authentication
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(
        `https://demo-deployment2-12.onrender.com/api/cart/delete/${userId}/${itemId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setData((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Calculate total
  const calculateTotal = () => {
    if (!data || data.length === 0) return 0;

    return data.reduce((total, item) => {
      const product =
        item.menClothing || item.womenClothing || item.kidsClothing ||
        item.grocery || item.cosmetics || item.footwear || item.electronics ||
        item.laptops || item.mobiles || item.toys || item;

      const price = product?.price || item.price || 0;
      const quantity = item.qty || item.quantity || 1;

      return total + (price * quantity);
    }, 0);
  };


  const handlePayment = async () => {
    if (!data || data.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      await loadRazorpay();

      const orderResponse = await axios.post(
        "https://demo-deployment2-12.onrender.com/createOrder",
        {
          userId,
          amount: calculateTotal(),
          name: userName,
          email: userEmail,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { orderId, order } = orderResponse.data;
      console.log("Order response:", orderResponse.data);

      const options = {
        key: "rzp_test_fNhXlhgX3Ai8dA",
        amount: calculateTotal() * 100,
        currency: "INR",
        name: "Venkat ecommercesite",
        description: "Test Transaction",
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              "https://demo-deployment2-12.onrender.com/paymentCallback",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: userId,
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            console.log("Payment verification response:", verifyResponse.data);

            if (verifyResponse.data === "Payment successful") {
              alert("Payment successful! Your invoice has been generated.");
              navigate("/invoice", { state: { cartItems: data, orderId } });
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#3399cc",
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Failed to process the payment. Please try again.");
    }
  };

  // Debug button (remove in production)
  const DebugInfo = () => (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
      <button onClick={debugData} style={{ marginBottom: '10px' }}>
        Debug Cart Data
      </button>
      <div>
        <strong>Debug Info:</strong>
        <div>Items in cart: {data?.length || 0}</div>
        <div>User ID: {userId || 'Not found'}</div>
        <div>Token: {token ? 'Present' : 'Not found'}</div>
      </div>
    </div>
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      {/* Debug info - remove in production */}
      <DebugInfo />

      {loading ? (
        <p>Loading cart...</p>
      ) : !data || data.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {data.map((item, index) => {
              console.log(`Rendering item ${index}:`, item);

              const product =
                item.menClothing || item.womenClothing || item.kidsClothing ||
                item.grocery || item.cosmetics || item.footwear || item.electronics ||
                item.laptops || item.mobiles || item.toys || item;

              return (
                <div key={item.id || index} className="cart-item">
                  <h3>{product?.name || "Unknown Product"}</h3>
                  <div>
                    <img
                      src={product?.image || item.image || "https://via.placeholder.com/150"}
                      height={100}
                      width={100}
                      alt={product?.name || "Product Image"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <p>{product?.description || item.description || "No description available."}</p>
                  <p>Price: ₹{product?.price || item.price || "N/A"}</p>
                  <div className="quantity-container">
                    <button onClick={() => handleQuantityChange(item.id, (item.qty || item.quantity) - 1)}>
                      -
                    </button>
                    <span>{item.qty || item.quantity || 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, (item.qty || item.quantity) + 1)}>
                      +
                    </button>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <p>Total: ₹{calculateTotal()}</p>
            <div className="cart-actions">
              <button onClick={() => navigate("/userdashboard")} className="continue-shopping-btn">
                Continue Shopping
              </button>
              <button className="proceed-to-pay-btn" onClick={handlePayment}>
                Proceed to Pay
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;