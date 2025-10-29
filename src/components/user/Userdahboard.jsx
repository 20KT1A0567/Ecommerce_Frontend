

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "./image.png";
import RenderSearchResults from "./RenderSearchResults.jsx";

const categories = [
  {
    to: "/groceries",
    src: "https://3.imimg.com/data3/VS/UT/MY-13965561/groceries-500x500.png",
    label: "GROCERIES",
  },
  {
    to: "/cosmetics",
    src: "https://www.marketing91.com/wp-content/uploads/2018/05/Cosmetic-Brands.jpg",
    label: "COSMETICS",
  },
  {
    to: "/electronics",
    src: "https://www.paldrop.com/wp-content/uploads/2018/09/must-have-kitchen-appliances.jpeg",
    label: "ELECTRONICS",
  },
  {
    to: "/footwear",
    src: "https://th.bing.com/th/id/OIP.NsLDX4QkBgYbKDTosjxyewHaFj?w=223&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    label: "FOOTWEAR",
  },
  {
    to: "/kids",
    src: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQDVfjfpGGtXcmcRoq6O_5VXKuzS2gmhqCiB_7LwaGAzQeeNjTmwpprmVeGoHpvH6BbOOfYOln1N5lwrrRxy7HsEMnOtLJD1G5-LWyUCiz5eQGy_uY9ha8w_w&usqp=CAc",
    label: "KIDS WEAR",
  },
  {
    to: "/women",
    src: "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/939be75a-df75-4dfc-86e3-1b9919af21f5._CR0,0,1911,1000_SX860_QL70_.jpg",
    label: "WOMEN",
  },
  {
    to: "/men",
    src: "https://m.media-amazon.com/images/I/716KHpIWNPL.SX522.jpg",
    label: "MEN",
  },
  {
    to: "/laptops",
    src: "https://p2-ofp.static.pub/fes/cms/2022/09/26/i6zlcap44kafmcywlh54d9rd1wieh1215035.png",
    label: "LAPTOPS",
  },
  {
    to: "/toys",
    src: "https://th.bing.com/th?id=OPAC.YVFRJlLxQDxjwg474C474&w=406&h=406&o=5&dpr=1.3&pid=21.1",
    label: "TOYS",
  },
  {
    to: "/mobiles",
    src: "https://s3.amazonaws.com/images.ecwid.com/images/13261323/808798742.jpg",
    label: "MOBILES",
  },
];

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleLogoClick = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://demo-deployment2-15-syk7.onrender.com/items/search?query=${searchQuery}`
      );

      const results = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderCategories = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom textAlign="center">
        Explore Categories
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {categories.map((category) => (
          <Grid
            item
            key={category.label}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            sx={{ textAlign: "center" }}
          >
            <Link to={category.to} style={{ textDecoration: "none", color: "inherit" }}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  "&:hover": { boxShadow: 6 },
                  cursor: "pointer",
                  bgcolor: "background.paper",
                  p: 1,
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={category.src}
                  alt={category.label}
                  sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="subtitle1" mt={1} fontWeight="bold">
                  {category.label}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          boxShadow: 1,
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={logo}
            alt="App Logo"
            sx={{ width: 150, height: 80, objectFit: "contain" }}
          />
        </Box>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: "flex", flexGrow: 1, maxWidth: 600 }}
          noValidate
          autoComplete="off"
        >
        
        </Box>

        {/* User info and actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountCircleIcon sx={{ fontSize: 40 }} color="primary" />
          <Typography variant="subtitle1" noWrap sx={{ maxWidth: 100 }}>
            {localStorage.getItem("username") || "Guest"}
          </Typography>

          <IconButton onClick={handleLogout} color="primary" aria-label="Logout">
            <LogoutIcon />
          </IconButton>

          <Link to="/cart" aria-label="Cart">
            <IconButton color="primary">
              <ShoppingCartIcon />
            </IconButton>
          </Link>
        </Box>
      </Box>

      {/* Main content */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="h6">Loading...</Typography>
        </Box>
      ) : searchQuery.trim().length > 0 ? (
        <RenderSearchResults
          loading={loading}
          searchQuery={searchQuery}
          searchResults={searchResults}
          cart={cart}
          setCart={setCart}
        />
      ) : (
        renderCategories()
      )}
    </>
  );
};

export default UserDashboard;
