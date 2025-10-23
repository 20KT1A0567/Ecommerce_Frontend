import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
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
    const category = product.category?.toLowerCase() || "";

    switch (category) {
      case "laptops":
        navigate("/laptopsdetails", { state: { item: product } });
        break;
      case "grocery":
        navigate("/grocerydetails", { state: { item: product } });
        break;
      case "cosmetics":
        navigate("/cosmeticsdetails", { state: { item: product } });
        break;
      case "electronics":
        navigate("/electronicsdetails", { state: { item: product } });
        break;
      case "kids":
        navigate("/kidsdetails", { state: { item: product } });
        break;
      case "men":
        navigate("/mendetails", { state: { item: product } });
        break;
      case "toys":
        navigate("/toysdetails", { state: { item: product } });
        break;
      case "women":
        navigate("/womendetails", { state: { item: product } });
        break;
      case "footwear":
        navigate("/footweardetails", { state: { item: product } });
        break;
      case "mobiles":
        navigate("/mobiledetails", { state: { item: product } });
        break;
      default:
        navigate("/error");
        break;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!searchResults.length && searchQuery) {
    return (
      <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
        No products found for &quot;{searchQuery}&quot;
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {searchResults.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.image || "https://via.placeholder.com/200"}
                alt={product.name || "Product"}
                sx={{ objectFit: "contain", p: 1, cursor: "pointer" }}
                onClick={() => handleNavigate(product)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  noWrap
                  title={product.name}
                >
                  {product.name}
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  ₹{product.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleNavigate(product)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RenderSearchResults;
