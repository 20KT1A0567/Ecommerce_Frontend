
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCartContext } from "./components/context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {

  localStorage.setItem("userName", "Venkat");
  localStorage.setItem("userEmail", "venkat@example.com");

  const [loading, setLoading] = useState(true);
  const { data, setData } = useCartContext();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const isTestMode = true;

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post("https://demo-deployment2-6.onrender.com/createOrder", {
        userId,
        amount: calculateTotal(),
        name: userName,
        email: userEmail,
      });

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
            const verifyResponse = await axios.post("https://demo-deployment2-6.onrender.com/paymentCallback", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              user_id: userId,

            });

            console.log("Payment verification response:", verifyResponse.data);

            if (verifyResponse.data === "Payment successful") {
              alert("Payment successful! Your invoice has been generated.");
              navigate("/invoice", { state: { cartItems: data, orderId } });
              console.log("Cart Items:", cartItems);

              console.log(data);
              console.log(orderId)
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);

          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Failed to process the payment. Please try again.");
    }
  };
  const generateInvoice = (orderDetails) => {
    // Invoice structure
    const invoiceData = `
      <h2>Invoice</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Name:</strong> ${orderDetails.name || "N/A"}</p>
      <p><strong>Email:</strong> ${orderDetails.email || "N/A"}</p>
      <p><strong>Amount:</strong> ₹${orderDetails.amount}</p>
      <p><strong>Order Status:</strong> ${orderDetails.orderStatus}</p>
      <p><strong>Razorpay Order ID:</strong> ${orderDetails.razorpayOrderId}</p>
      <hr />
      <h3>Items</h3>
      <ul>
        ${data.map((item) => {

      const product = item.menClothing || item.womenClothing || item.kidsClothing ||
        item.grocery || item.cosmetics || item.footwear || item.electronics ||
        item.laptops || item.mobiles || item.toys;
      return `
            <li>
              <strong>${product?.name}</strong> (₹${product?.price}) x ${item.qty}
            </li>
          `;
    }).join('')}
      </ul>
      <p><strong>Total Amount:</strong> ₹${orderDetails.amount}</p>
      <p>Thank you for shopping with us!</p>
    `;
    const invoiceContainer = document.createElement("div");
    invoiceContainer.innerHTML = invoiceData;
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(invoiceContainer.innerHTML);
    invoiceWindow.document.close();
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`https://demo-deployment2-6.onrender.com/api/cart/${userId}`);
        const { items } = response.data;
        setData(items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, setData]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(`https://demo-deployment2-6.onrender.com/api/cart/update/${userId}/${itemId}`, null, { params: { qty: newQty } });
      setData((prev) => prev.map(item => item.id === itemId ? { ...item, qty: newQty } : item));
    } catch (error) {
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`https://demo-deployment2-6.onrender.com/api/cart/delete/${userId}/${itemId}`);
      setData((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      alert("Failed to remove item from cart.");
    }
  };

  const calculateTotal = () => {
    return data.reduce((total, item) => {
      const product = item.menClothing || item.womenClothing || item.electronics || item.kidsClothing ||
        item.grocery || item.cosmetics || item.footwear ||
        item.laptops || item.mobiles || item.toys;
      return total + (product?.price * item.qty || 0);
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : data?.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {data.map((item) => {
            const product = item.menClothing || item.electronics || item.womenClothing || item.kidsClothing ||
              item.grocery || item.cosmetics || item.footwear ||
              item.laptops || item.mobiles || item.toys;

            return (
              <div key={item.id} className="cart-item">
                <h3>{product?.name || "Unknown Product"}</h3>
                <div>
                  <img
                    src={product?.image || "https://via.placeholder.com/150"}
                    height={100}
                    width={100}
                    alt={product?.name || "Product Image"}
                  />
                </div>
                <p>{product?.description || "No description available."}</p>
                <p>Price: ₹{product?.price}</p>
                <div className="quantity-container">
                  <button onClick={() => handleQuantityChange(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.qty + 1)}>+</button>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {data.length > 0 && (
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
      )}
    </div>
  );
};

export default Cart;
