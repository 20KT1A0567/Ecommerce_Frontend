import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../user/image.png";

import {
    AppBar,
    Toolbar,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    TextField,
    CircularProgress,
    IconButton,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Groceries = () => {
    const [groceries, setGroceries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const navigate = useNavigate();

    const getGroceries = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-15-syk7.onrender.com/user/grocery", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setGroceries(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching groceries:", error);
            setError("Failed to load groceries. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGroceries();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredGroceries = groceries.filter((item) => {
        const itemName = item.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        return itemName.startsWith(term);
    });

    const sortedGroceries = [...filteredGroceries].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (event, item) => {
        event.stopPropagation();
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                )
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (event, itemId, change) => {
        event.stopPropagation();
        setCart(
            cart.map((cartItem) =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) }
                    : cartItem
            )
        );
    };

    const display_singleitem = (item) => {
        navigate("/grocerydetails", { state: { item } });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setShowSortOptions(false);
    };

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar
                    sx={{
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Logo" width={50} height={50} />
                        <Typography variant="h6" sx={{ ml: 1, color: "#fff" }}>
                            Groceries Store
                        </Typography>
                    </Box>

                    

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => setShowSortOptions(!showSortOptions)}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Filter
                        </Button>
                        {showSortOptions && (
                            <TextField
                                select
                                SelectProps={{ native: true }}
                                value={sortOption}
                                onChange={handleSortChange}
                                size="small"
                                sx={{ bgcolor: "white", borderRadius: 1, minWidth: 140 }}
                            >
                                <option value="">Sort by</option>
                                <option value="name-asc">Name: A-Z</option>
                                <option value="name-desc">Name: Z-A</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </TextField>
                        )}

                        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                                alt="Logout"
                                width={40}
                                height={40}
                                style={{ cursor: "pointer" }}
                            />
                        </Link>
                        <Link to="/cart" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                                alt="Cart"
                                width={50}
                                height={50}
                                style={{ cursor: "pointer" }}
                            />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Products Grid */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, maxWidth: 1200, mx: "auto" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                        <Typography variant="h6" ml={2}>
                            Loading groceries...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error" align="center" mt={5}>
                        {error}
                    </Typography>
                ) : sortedGroceries.length === 0 ? (
                    <Typography variant="h6" align="center" mt={5}>
                        No groceries available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedGroceries.map((item) => {
                            const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                            return (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <Card
                                        sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
                                        onClick={() => display_singleitem(item)}
                                        variant="outlined"
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={item.image || "https://via.placeholder.com/300"}
                                            alt={item.name}
                                            sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" noWrap>
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
                                            

                                            {cartItem && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 1,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleQuantityChange(e, item.id, -1)}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography variant="body1">{cartItem.quantity}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleQuantityChange(e, item.id, 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Groceries;
