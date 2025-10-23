import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCartContext } from "./components/context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Load Razorpay script function remains same
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

  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  const userName = localStorage.getItem("userName") || "Venkat";
  const userEmail = localStorage.getItem("userEmail") || "venkat@example.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://demo-deployment2-5-zlsf.onrender.com/api/cart/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const cartData = response.data;

        if (cartData.items) setData(cartData.items);
        else if (Array.isArray(cartData)) setData(cartData);
        else if (cartData.cart) setData(cartData.cart.items || []);
        else setData([]);

        setLoading(false);
      } catch (error) {
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

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(
        `https://demo-deployment2-5-zlsf.onrender.com/api/cart/update/${userId}/${itemId}`,
        null,
        {
          params: { qty: newQty },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(
        `https://demo-deployment2-5-zlsf.onrender.com/api/cart/delete/${userId}/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      alert("Failed to remove item from cart.");
    }
  };

  const calculateTotal = () => {
    if (!data || data.length === 0) return 0;

    return data.reduce((total, item) => {
      const product =
        item.menClothing ||
        item.womenClothing ||
        item.kidsClothing ||
        item.grocery ||
        item.cosmetics ||
        item.footwear ||
        item.electronics ||
        item.laptops ||
        item.mobiles ||
        item.toys ||
        item;

      const price = product?.price || item.price || 0;
      const quantity = item.qty || item.quantity || 1;

      return total + price * quantity;
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
        "https://demo-deployment2-5-zlsf.onrender.com/createOrder",
        {
          userId,
          amount: calculateTotal(),
          name: userName,
          email: userEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { orderId, order } = orderResponse.data;

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
              "https://demo-deployment2-5-zlsf.onrender.com/paymentCallback",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: userId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyResponse.data === "Payment successful") {
              alert("Payment successful! Your invoice has been generated.");
              navigate("/invoice", { state: { cartItems: data, orderId } });
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#3399cc" },
        prefill: { name: userName, email: userEmail },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      alert("Failed to process the payment. Please try again.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Shopping Cart
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !data || data.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {data.map((item, index) => {
              const product =
                item.menClothing ||
                item.womenClothing ||
                item.kidsClothing ||
                item.grocery ||
                item.cosmetics ||
                item.footwear ||
                item.electronics ||
                item.laptops ||
                item.mobiles ||
                item.toys ||
                item;

              return (
                <Grid item xs={12} sm={6} md={4} key={item.id || index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={product?.image || item.image || "https://via.placeholder.com/150"}
                      alt={product?.name || "Product Image"}
                      sx={{
                        height: 150,
                        objectFit: "contain",
                        mb: 2,
                        borderRadius: 1,
                        bgcolor: "background.paper",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />

                    <Typography variant="h6" component="h3" noWrap>
                      {product?.name || "Unknown Product"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flexGrow: 1,
                        mt: 1,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product?.description || item.description || "No description available."}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Price: ₹{product?.price || item.price || "N/A"}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.id, (item.qty || item.quantity) - 1)
                          }
                          disabled={(item.qty || item.quantity) <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{ mx: 1, minWidth: 24, textAlign: "center" }}
                        >
                          {item.qty || item.quantity || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.id, (item.qty || item.quantity) + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: { xs: 2, sm: 0 } }}>
              Total: ₹{calculateTotal()}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/userdashboard")}
              >
                Continue Shopping
              </Button>
              <Button variant="contained" color="success" onClick={handlePayment}>
                Proceed to Pay
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
