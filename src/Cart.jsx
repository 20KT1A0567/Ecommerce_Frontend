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
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const API_BASE_URL = "https://demo-deployment2-15-syk7.onrender.com";

const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "", showDemoOption: false });
  const { data, setData } = useCartContext();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Customer";
  const userEmail = localStorage.getItem("userEmail") || "customer@example.com";
  const navigate = useNavigate();

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const showErrorDialog = (message, showDemoOption = false) => {
    setErrorDialog({ open: true, message, showDemoOption });
  };

  // Check authentication
  useEffect(() => {
    if (!userId || !token) {
      showAlert("Please login to access your cart", "warning");
      navigate("/login");
      return;
    }
  }, [userId, token, navigate]);

  // Enhanced API call function with better error handling
  const apiCall = async (url, options = {}) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
      ...options
    };

    try {
      const response = await axios(url, config);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      if (error.response?.status === 401) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.clear();
        navigate("/login");
        throw new Error("Authentication failed");
      }

      if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error("Network error: Please check your internet connection");
      }

      throw error;
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const cartData = await apiCall(`${API_BASE_URL}/api/cart/${userId}`);
        let cartItems = [];

        if (cartData.items) cartItems = cartData.items;
        else if (Array.isArray(cartData)) cartItems = cartData;
        else if (cartData.cart) cartItems = cartData.cart.items || [];

        setData(cartItems);
        setLoading(false);
      } catch (error) {
        console.error("Cart fetch error:", error);
        showAlert("Failed to load cart. Please try again.", "error");
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token, setData, navigate]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      await apiCall(
        `${API_BASE_URL}/api/cart/update/${userId}/${itemId}?qty=${newQty}`,
        { method: 'PUT' }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      showAlert("Failed to update quantity", "error");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await apiCall(
        `${API_BASE_URL}/api/cart/delete/${userId}/${itemId}`,
        { method: 'DELETE' }
      );

      setData((prev) => prev.filter((item) => item.id !== itemId));
      showAlert("Item removed from cart", "success");
    } catch (error) {
      showAlert("Failed to remove item from cart", "error");
    }
  };

  const calculateTotal = () => {
    if (!data || data.length === 0) return 0;

    return data.reduce((total, item) => {
      const product = getProductFromItem(item);
      const price = product?.price || item.price || 0;
      const quantity = item.qty || item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const calculateItemTotal = (item) => {
    const product = getProductFromItem(item);
    const price = product?.price || item.price || 0;
    const quantity = item.qty || item.quantity || 1;
    return price * quantity;
  };

  const getProductFromItem = (item) => {
    return item.menClothing ||
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
  };

  const createDemoOrder = () => {
    const orderId = `demo_${Date.now()}`;
    showAlert("Order created in demo mode", "info");

    // Clear cart after successful order
    setData([]);

    navigate("/invoice", {
      state: {
        cartItems: [...data],
        orderId: orderId,
        total: calculateTotal(),
        paymentStatus: "DEMO_SUCCESS",
        isDemo: true
      }
    });
  };

  const handlePayment = async () => {
    if (!data || data.length === 0) {
      showAlert("Your cart is empty!", "warning");
      return;
    }

    if (!userId || !token) {
      showAlert("Please login to proceed with payment", "warning");
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      await loadRazorpay();

      // Create order using your backend API
      const orderData = await apiCall(`${API_BASE_URL}/api/payment/createOrder`, {
        method: 'POST',
        data: {
          userId: parseInt(userId),
          amount: calculateTotal(),
        }
      });

      console.log("Order response:", orderData);

      // Handle Razorpay payment
      const options = {
        key: "rzp_test_fNhXlhgX3Ai8dA", // Your test key
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment with your backend
            const verifyResponse = await apiCall(`${API_BASE_URL}/api/payment/verifyPayment`, {
              method: 'POST',
              data: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            });

            if (verifyResponse.status === "success") {
              showAlert("Payment successful! Your order has been placed.", "success");
              // Clear cart after successful payment
              setData([]);
              navigate("/invoice", {
                state: {
                  cartItems: [...data],
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  total: calculateTotal(),
                  paymentStatus: "SUCCESS",
                  isDemo: false
                }
              });
            } else {
              showAlert("Payment verification failed. Please try again.", "error");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showAlert("Payment completed but verification failed. Please contact support.", "warning");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            showAlert("Payment cancelled", "info");
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error details:", error);

      if (error.message.includes("Network error")) {
        showErrorDialog(
          "Network error: Please check your internet connection and try again.",
          true
        );
      } else if (error.response?.status === 500) {
        showErrorDialog(
          "Payment service is currently unavailable. Please try again later or use demo mode.",
          true
        );
      } else {
        showErrorDialog(
          `Payment failed: ${error.response?.data?.error || error.message}`,
          true
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDemoMode = () => {
    setErrorDialog({ open: false, message: "", showDemoOption: false });
    createDemoOrder();
  };

  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, message: "", showDemoOption: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          Your Cart is Empty
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start shopping to add items to your cart
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/userdashboard")}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4, fontWeight: "bold" }}>
        🛒 Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {data.map((item, index) => {
            const product = getProductFromItem(item);
            const itemTotal = calculateItemTotal(item);

            return (
              <Card key={item.id || index} sx={{ mb: 2, display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, objectFit: 'cover' }}
                  image={product?.image || item.image || "https://via.placeholder.com/150"}
                  alt={product?.name || "Product Image"}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" noWrap>
                    {product?.name || "Unknown Product"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mt: 1 }}>
                    {product?.description || item.description || "No description available."}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      ₹{product?.price || item.price || "N/A"}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, (item.qty || item.quantity) - 1)}
                        disabled={(item.qty || item.quantity) <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center' }}>
                        {item.qty || item.quantity || 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, (item.qty || item.quantity) + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ minWidth: 100, textAlign: 'right' }}>
                      ₹{itemTotal}
                    </Typography>

                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{ ml: 2 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Summary
            </Typography>

            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Items ({data.length})</Typography>
                <Typography>₹{calculateTotal()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h6" color="primary">
                  ₹{calculateTotal()}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handlePayment}
              disabled={processing || data.length === 0}
              sx={{ py: 1.5, mb: 2 }}
            >
              {processing ? <CircularProgress size={24} /> : "Proceed to Payment"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/userdashboard")}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onClose={handleCloseErrorDialog}>
        <DialogTitle>Payment Error</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>
            Cancel
          </Button>
          {errorDialog.showDemoOption && (
            <Button onClick={handleDemoMode} variant="contained" color="primary">
              Continue in Demo Mode
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cart;