import axios from "axios";
import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Box,
    Drawer,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    ShoppingCart as CartIcon,
    AccountCircle as LoginIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";
import "./Products.css";
import "./user.css";

const Cosmetics1 = () => {
    const [cosmetics, setCosmetics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getCosmetics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/cosmetics");
            setCosmetics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching cosmetics:", error);
            setError("Failed to load cosmetics data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCosmetics();
    }, []);

    const getAuthToken = () => localStorage.getItem("token");

    const handleAddToCart = (event, item) => {
        event.stopPropagation();
        const token = getAuthToken();
        if (!token) {
            alert("You need to log in to add items to the cart.");
            navigate("/login");
            return;
        }

        axios
            .post("https://demo-deployment2-8-cq0p.onrender.com/cosmetics", item, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => alert("Item added to cart successfully!"))
            .catch((error) => {
                console.error("Error adding item to cart:", error);
                alert("Failed to add item to cart. Please Login.");
                navigate("/login");
            });
    };

    const filteredCosmetics = cosmetics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Drawer toggle
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            {/* HEADER */}
            <AppBar position="sticky" sx={{ backgroundColor: "#ff66b3" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Left: Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            width={45}
                            height={45}
                            style={{ borderRadius: "50%", cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        />
                        <Typography
                            variant="h6"
                            sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}
                        >
                            Cosmetics
                        </Typography>
                    </Box>

                    {/* Center: Search (visible on md and up) */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            backgroundColor: "white",
                            borderRadius: 2,
                            padding: "0 10px",
                            width: 300,
                        }}
                    >
                        <SearchIcon sx={{ color: "gray" }} />
                        <InputBase
                            placeholder="Search cosmetics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>

                    {/* Right icons for large screens */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <IconButton color="inherit" component={Link} to="/login">
                            <LoginIcon />
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <CartIcon />
                        </IconButton>
                    </Box>

                    {/* Hamburger for small screens */}
                    <IconButton
                        color="inherit"
                        sx={{ display: { xs: "flex", md: "none" } }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer for small screens */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 260, padding: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6">Menu</Typography>
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Search in Drawer */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#f2f2f2",
                            borderRadius: 2,
                            marginY: 2,
                            padding: "0 10px",
                        }}
                    >
                        <SearchIcon sx={{ color: "gray" }} />
                        <InputBase
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>

                    <Button
                        startIcon={<LoginIcon />}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ marginBottom: 2 }}
                        component={Link}
                        to="/login"
                    >
                        Login
                    </Button>
                    <Button
                        startIcon={<CartIcon />}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/cart"
                    >
                        Cart
                    </Button>
                </Box>
            </Drawer>

            {/* PRODUCTS SECTION */}
            <Box sx={{ padding: 3 }}>
                {loading ? (
                    <Typography variant="h6" align="center">
                        Loading Cosmetics...
                    </Typography>
                ) : error ? (
                    <Typography variant="h6" color="error" align="center">
                        {error}
                    </Typography>
                ) : filteredCosmetics.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredCosmetics.map((item) => (
                            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: 3,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "scale(1.03)" },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image}
                                        alt={item.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                                            ₹{item.price}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            color="primary"
                                            onClick={(e) => handleAddToCart(e, item)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" align="center">
                        No cosmetics available.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default Cosmetics1;
