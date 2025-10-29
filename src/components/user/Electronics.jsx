
import axios from "axios";
import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    ShoppingCart as CartIcon,
    Logout as LogoutIcon,
    FilterList as FilterIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";
import "./Products.css";
import "./user.css";

const Electronics = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get(
                "https://demo-deployment2-15-syk7.onrender.com/user/electronics",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching electronics:", error);
            setError("Failed to load electronics data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getElectronics();
    }, []);

    const filteredElectronics = electronics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedElectronics = [...filteredElectronics].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (item) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
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
        }
    };

    const handleLogoClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const displaySingleItem = (item) => {
        navigate("/electronicsdetails", { state: { item } });
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            {/* ===== HEADER ===== */}
            <AppBar position="sticky" sx={{ backgroundColor: "#ff6600" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* LEFT: Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            onClick={handleLogoClick}
                            style={{ width: 45, height: 45, borderRadius: "50%", cursor: "pointer" }}
                        />
                        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
                            Electronics
                        </Typography>
                    </Box>

                    {/* CENTER: Search bar */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            gap: 1,
                            background: "#fff",
                            borderRadius: 2,
                            padding: "0 10px",
                            width: "300px",
                        }}
                    >
                       
                    </Box>

                    {/* RIGHT: Icons */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<FilterIcon />}
                            onClick={() => setShowSortOptions(!showSortOptions)}
                            sx={{ backgroundColor: "#007bff", "&:hover": { backgroundColor: "#0056b3" } }}
                        >
                            Filter
                        </Button>

                        {showSortOptions && (
                            <Select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                            >
                                <MenuItem value="">Sort by</MenuItem>
                                <MenuItem value="name-asc">Name: A-Z</MenuItem>
                                <MenuItem value="name-desc">Name: Z-A</MenuItem>
                                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                            </Select>
                        )}

                        <IconButton color="inherit" component={Link} to="/cart">
                            <CartIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleLogoClick}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>

                    {/* MOBILE: Menu Icon */}
                    <IconButton
                        color="inherit"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { xs: "flex", md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* ===== DRAWER (Mobile Menu) ===== */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{
                        width: 260,
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Menu</Typography>
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Search inside drawer */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            background: "#f1f1f1",
                            borderRadius: 2,
                            padding: "0 10px",
                        }}
                    >
                        <SearchIcon color="action" />
                        <InputBase
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: "100%" }}
                        />
                    </Box>

                    {/* Filter */}
                    <Button
                        variant="contained"
                        startIcon={<FilterIcon />}
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        sx={{ backgroundColor: "#007bff", "&:hover": { backgroundColor: "#0056b3" } }}
                    >
                        Filter
                    </Button>

                    {showSortOptions && (
                        <Select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Sort by</MenuItem>
                            <MenuItem value="name-asc">Name: A-Z</MenuItem>
                            <MenuItem value="name-desc">Name: Z-A</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        </Select>
                    )}

                    <List>
                        <ListItem button component={Link} to="/cart">
                            <CartIcon sx={{ marginRight: 1 }} /> <ListItemText primary="Cart" />
                        </ListItem>
                        <ListItem button onClick={handleLogoClick}>
                            <LogoutIcon sx={{ marginRight: 1 }} /> <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* ===== PRODUCTS SECTION ===== */}
            <div className="product-container">
                {loading ? (
                    <div className="loading-message">Loading electronics...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : sortedElectronics.length > 0 ? (
                    sortedElectronics.map((item) => (
                        <div
                            key={item.id}
                            className="product-card"
                            onClick={() => displaySingleItem(item)}
                        >
                            <img src={item.image} alt={item.name} className="product-image" />
                            <div className="name">{item.name}</div>
                            <div className="description">{item.description}</div>
                            <div className="price">Price: ₹{item.price}</div>
                           
                        </div>
                    ))
                ) : (
                    <div className="no-data-message">No electronics available.</div>
                )}
            </div>
        </>
    );
};

export default Electronics;
