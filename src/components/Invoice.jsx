import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";

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
      .delete(`https://demo-deployment2-5-zlsf.onrender.com/api/cart/clear/${userId}`)
      .then(() => {
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
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`https://demo-deployment2-5-zlsf.onrender.com/api/cart/${userId}`);
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
        const response = await axios.get(`https://demo-deployment2-5-zlsf.onrender.com/orders/${orderId}`);
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
    <Container
      maxWidth="md"
      id="invoice-to-download"
      sx={{
        mt: 4,
        mb: 6,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Invoice
      </Typography>

      <Typography variant="subtitle1" align="center" gutterBottom>
        Order ID: <strong>{orderId || "N/A"}</strong>
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Total Amount: ₹{orderDetails.amount || 0}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Items Purchased
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredItems.length > 0 ? (
          <Grid container spacing={3}>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      maxWidth: 180,
                      height: "auto",
                      mb: 2,
                      borderRadius: 1,
                      objectFit: "contain",
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      mb: 1,
                      textAlign: "center",
                      height: 40,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography variant="body1">
                    Qty: {item.qty} &nbsp; x &nbsp; ₹{item.price}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No items found in this order.</Typography>
        )}
      </Box>

      <Typography
        variant="h6"
        align="center"
        sx={{ mt: 6, fontStyle: "italic", color: "text.secondary" }}
      >
        Thank you for shopping with us!
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackToDashboard}
          sx={{ minWidth: 150 }}
        >
          Back to Dashboard
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ minWidth: 150 }}
        >
          Download Invoice
        </Button>
      </Box>
    </Container>
  );
};

export default Invoice;
