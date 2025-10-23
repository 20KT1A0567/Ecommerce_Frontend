import axios from "axios";
import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../user/image.png";
import { Link, useNavigate } from "react-router-dom";

const Women = () => {
    const [womenProducts, setWomenProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const navigate = useNavigate();

    const getWomenProducts = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-7-bbpl.onrender.com/user/women", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setWomenProducts(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching women's products:", error);
            setError("Failed to load women's products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWomenProducts();
    }, []);

    const filteredWomenProducts = womenProducts.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedWomenProducts = [...filteredWomenProducts].sort((a, b) => {
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

    const handleAddToCart = (item, e) => {
        e.stopPropagation();
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

    const displaySingleItem = (item) => {
        navigate("/womendetails", { state: { item } });
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            {/* Header */}
            <AppBar position="static" color="default" sx={{ mb: 3 }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                        onClick={handleLogoutClick}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo"
                            sx={{ width: 150, height: 70, objectFit: "contain" }}
                        />
                    </Box>

                    {/* Search Field */}
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ flexGrow: 1, maxWidth: 400, minWidth: 200 }}
                    />

                    {/* Sort / Filter Select */}
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="sort-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sortOption}
                            label="Sort By"
                            onChange={handleSortChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="name-asc">Name: A-Z</MenuItem>
                            <MenuItem value="name-desc">Name: Z-A</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Logout & Cart Buttons */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={handleLogoutClick} color="primary" aria-label="logout">
                            <LogoutIcon />
                        </IconButton>
                        <Link to="/cart" aria-label="cart">
                            <IconButton color="primary">
                                <ShoppingCartIcon />
                            </IconButton>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Product Grid */}
            <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
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
                        <Typography variant="h6">Loading women's products...</Typography>
                    </Box>
                ) : error ? (
                    <Typography
                        variant="h6"
                        color="error"
                        align="center"
                        sx={{ mt: 4 }}
                    >
                        {error}
                    </Typography>
                ) : sortedWomenProducts.length > 0 ? (
                    <Grid container spacing={3}>
                        {sortedWomenProducts.map((item) => (
                            <Grid
                                item
                                key={item.id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                onClick={() => displaySingleItem(item)}
                                sx={{ cursor: "pointer" }}
                            >
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        "&:hover": { boxShadow: 6 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image}
                                        alt={item.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div" noWrap>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                        <Typography variant="subtitle1" mt={1} fontWeight="bold">
                                            ₹{item.price}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            onClick={(e) => handleAddToCart(item, e)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        No women's products available.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default Women;
