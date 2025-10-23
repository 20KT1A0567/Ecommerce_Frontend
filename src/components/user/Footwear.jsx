import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../user/image.png";
import { Link, useNavigate } from "react-router-dom";

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
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Footwear = () => {
    const [footwear, setFootwear] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const navigate = useNavigate();

    const getFootwear = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-5-zlsf.onrender.com/user/footwear", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFootwear(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching footwear:", error);
            setError("Failed to load footwear data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFootwear();
    }, []);

    const filteredFootwear = footwear.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFootwear = [...filteredFootwear].sort((a, b) => {
        if (sortOption === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "name-desc") {
            return b.name.localeCompare(a.name);
        } else if (sortOption === "price-asc") {
            return a.price - b.price;
        } else if (sortOption === "price-desc") {
            return b.price - a.price;
        }
        return 0;
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleAddToCart = (item, event) => {
        event.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        // Call backend API to add item to cart (adjust as needed)
        axios
            .post(
                `https://demo-deployment2-5-zlsf.onrender.com/cart`,
                item,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setSnackbar({ open: true, message: "Item added to cart!", severity: "success" });
            })
            .catch(() => {
                setSnackbar({ open: true, message: "Failed to add item to cart.", severity: "error" });
            });
    };

    const displaySingleItem = (item) => {
        navigate("/footweardetails", { state: { item } });
    };

    const handleLogoClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleLogoClick}>
                        <img src={logo} alt="Logo" width={50} height={50} />
                        <Typography variant="h6" color="inherit" sx={{ ml: 1 }}>
                            Footwear Store
                        </Typography>
                    </Box>

                    <TextField
                        size="small"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ flexGrow: 1, maxWidth: 400, bgcolor: "white", borderRadius: 1 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 150, bgcolor: "white", borderRadius: 1 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOption} label="Sort By" onChange={handleSortChange}>
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="name-asc">Name: A-Z</MenuItem>
                            <MenuItem value="name-desc">Name: Z-A</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>

                    <Box>
                        <IconButton color="inherit" onClick={handleLogoClick} title="Logout">
                            <LogoutIcon />
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/cart" title="Cart">
                            <ShoppingCartIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Content */}
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                        <Typography variant="h6" ml={2}>
                            Loading footwear...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" variant="h6" align="center" mt={5}>
                        {error}
                    </Typography>
                ) : sortedFootwear.length === 0 ? (
                    <Typography variant="h6" align="center" mt={5}>
                        No footwear available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedFootwear.map((item) => (
                            <Grid key={item.id} item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        cursor: "pointer",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        ":hover": { boxShadow: 6 },
                                    }}
                                    onClick={() => displaySingleItem(item)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.image || "https://via.placeholder.com/300"}
                                        alt={item.name}
                                        sx={{ height: 200, objectFit: "contain", bgcolor: "#f5f5f5" }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300";
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="subtitle1" mt={1} fontWeight="bold">
                                            Price: ₹{item.price}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={(e) => handleAddToCart(item, e)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Footwear;
