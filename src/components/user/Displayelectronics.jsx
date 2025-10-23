import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../user/image.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const Displayelectronics = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!item) {
    return (
      <Typography variant="h5" align="center" mt={4}>
        Electronics Details not found.
      </Typography>
    );
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const getAuthToken = () => localStorage.getItem("token");

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = getAuthToken();

    if (!userId || !token) {
      setSnackbar({
        open: true,
        message: "Please log in to add items to the cart.",
        severity: "warning",
      });
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `https://demo-deployment2-5-zlsf.onrender.com/api/cart/add/${userId}/electronics/${item.id}`,
        null,
        {
          params: { qty: quantity },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSnackbar({
        open: true,
        message: `Added ${quantity} of ${item.name} to your cart!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please log in again.",
          severity: "error",
        });
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to add item.",
          severity: "error",
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* --- HEADER --- */}
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Electronics Store
            </Typography>
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="inherit" component={Link} to="/cart">
              <CartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- PRODUCT DETAILS --- */}
      <Box sx={{ padding: { xs: 2, md: 5 } }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 4,
                borderRadius: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  borderRadius: 2,
                }}
                image={item.image || "https://via.placeholder.com/300"}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                padding: 3,
                backgroundColor: "#fafafa",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {item.name}
                </Typography>

                <Typography variant="body1" color="text.secondary" mt={1}>
                  {item.description || "No description available."}
                </Typography>

                <Typography variant="h6" color="primary" mt={2}>
                  Price: ₹{item.price || "N/A"}
                </Typography>

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={decrementQuantity}
                    sx={{
                      border: "1px solid #1976d2",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography variant="h6">{quantity}</Typography>

                  <IconButton
                    color="primary"
                    onClick={incrementQuantity}
                    sx={{
                      border: "1px solid #1976d2",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Add to Cart */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, py: 1.5 }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Displayelectronics;
