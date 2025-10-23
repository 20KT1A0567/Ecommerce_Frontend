import axios from "axios";
import { useEffect, useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Select,
    MenuItem,
    FormControl,
    CircularProgress,
    Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

const Kids = () => {
    const [kidsProducts, setKidsProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const navigate = useNavigate();

    const getKidsProducts = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/user/kids", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setKidsProducts(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching kids' products:", error);
            setError("Failed to load kids' products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getKidsProducts();
    }, []);

    const filteredKidsProducts = kidsProducts.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedKidsProducts = [...filteredKidsProducts].sort((a, b) => {
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
        setShowSortOptions(false);
    };

    const handleAddToCart = (item, e) => {
        e.stopPropagation(); // prevent card click event
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
        navigate("/kidsdetails", { state: { item } });
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" color="primary">
                <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Logo" width={120} height={60} />
                        <Typography variant="h6" sx={{ ml: 2, color: "white" }}>
                            Kids Shop
                        </Typography>
                    </Box>

                    {/* Search */}
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: "white", borderRadius: 1, width: { xs: "100%", sm: 300 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Filter */}
                    <Box sx={{ position: "relative" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowSortOptions((prev) => !prev)}
                        >
                            Filter
                        </Button>
                        {showSortOptions && (
                            <FormControl
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    mt: 1,
                                    bgcolor: "background.paper",
                                    boxShadow: 3,
                                    borderRadius: 1,
                                    minWidth: 160,
                                    zIndex: 10,
                                }}
                            >
                                <Select value={sortOption} onChange={handleSortChange} displayEmpty>
                                    <MenuItem value="">Sort by</MenuItem>
                                    <MenuItem value="name-asc">Name: A-Z</MenuItem>
                                    <MenuItem value="name-desc">Name: Z-A</MenuItem>
                                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {/* Logout and Cart */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton color="inherit" onClick={handleLogoutClick} aria-label="logout">
                            <LogoutIcon />
                        </IconButton>
                        <IconButton
                            component={Link}
                            to="/cart"
                            color="inherit"
                            aria-label="cart"
                            size="large"
                        >
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container sx={{ py: 4, maxWidth: "lg" }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 300,
                        }}
                    >
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading kids' products...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : sortedKidsProducts.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No kids' products available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedKidsProducts.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Card
                                    onClick={() => displaySingleItem(item)}
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: 6 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: "contain", p: 1 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
                                        >
                                            {item.description}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                            Price: ₹{item.price}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => handleAddToCart(item, e)}
                                            fullWidth
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default Kids;
