
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./invoice.css";
import html2pdf from "html2pdf.js";

const Invoice = () => {
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    id: "",
    amount: 0,
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId || "";
  const userId = localStorage.getItem("userId");

  const clearCartAndNavigate = (isBackToDashboard = false) => {
    axios
      .delete(`https://demo-deployment2-11.onrender.com/api/cart/clear/${userId}`)
      .then(() => {
        console.log("Cart cleared successfully.");
        setCartItems([]);

        if (isBackToDashboard) {
          navigate("/userdashboard");
        } else {
          navigate(`/invoice?orderId=${orderId}`);
        }
      })
      .catch((error) => {
        console.error("Error clearing the cart:", error);
        alert("Failed to clear the cart. Please try again.");
      });
  };

  const handleBackToDashboard = () => {
    setTimeout(() => {
      clearCartAndNavigate(true);
    }, 1000);
  };

  const fetchCartData = async () => {
    if (!userId) return setLoading(false);
    try {
      const response = await axios.get(`https://demo-deployment2-11.onrender.com/api/cart/${userId}`);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://demo-deployment2-11.onrender.com/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Unable to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    fetchCartData();
  }, [userId]);

  const handleDownload = () => {
    const invoiceElement = document.getElementById("invoice-to-download");
    const opt = {
      margin: 0.5,
      filename: `Invoice_${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(invoiceElement).set(opt).save();
  };

  const filteredItems = cartItems.map((item) => {
    const category = Object.keys(item).find(
      (key) => !["id", "price", "qty"].includes(key) && item[key] !== null
    );

    return {
      ...item,
      name: item[category]?.name || "Unknown Item",
      description: item[category]?.description || "",
      image: item[category]?.image || "https://via.placeholder.com/150",
    };
  });

  return (
    <div id="invoice-to-download" className="invoice-container">
      <h2 className="invoice-title">Invoice</h2>
      <p className="invoice-id">Order ID: {orderId || "N/A"}</p>
      <p className="invoice-amount">Total Amount: ₹{orderDetails.amount || 0}</p>

      <div className="invoice-items">
        <h3>Items Purchased</h3>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="invoice-item">
              <img
                src={item.image}
                alt={item.name}
                className="item-image"
                style={{ width: "100px", height: "auto", marginBottom: "10px" }}
              />
              <p>
                <span className="item-name">{item.name}</span> - {item.qty} x ₹{item.price}
              </p>
              <p className="item-description">{item.description}</p>
            </div>
          ))
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>

      <p className="thank-you-message">Thank you for shopping with us!</p>
      <button className="back-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      <button className="download-button" onClick={handleDownload}>
        Download Invoice
      </button>
    </div>
  );
};

export default Invoice;
