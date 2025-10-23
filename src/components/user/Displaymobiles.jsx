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

const Displaymobiles = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  if (!item) {
    return (
      <Typography variant="h5" align="center" mt={5}>
        Mobile Details not found.
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
        message: "Please log in to add items to your cart.",
        severity: "warning",
      });
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `https://demo-deployment2-8-cq0p.onrender.com/api/cart/add/${userId}/mobiles/${item.id}`,
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
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
        setSnackbar({
          open: true,
          message: "Session expired. Please log in again.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to add item to the cart.",
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

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      {/* Header AppBar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
            <Typography variant="h6" fontWeight="bold">
              Mobile Store
            </Typography>
          </Box>

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

      {/* Product Detail Section */}
      <Box sx={{ padding: { xs: 2, md: 5 } }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
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

          {/* Details */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 3,
                borderRadius: 3,
                boxShadow: 3,
                background: "#fafafa",
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

                {/* Add to Cart Button */}
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

      {/* Snackbar for notifications */}
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

export default Displaymobiles;
