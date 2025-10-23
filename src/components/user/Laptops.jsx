import axios from "axios";
import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    IconButton,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import logo from '../user/image.png';

const Laptops = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const navigate = useNavigate();

    const getLaptops = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/user/laptops", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setLaptops(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching laptops:", error);
            setError("Failed to load laptops data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLaptops();
    }, []);

    const filteredLaptops = laptops.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedLaptops = [...filteredLaptops].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSortChange = (e) => setSortOption(e.target.value);

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

    const displaySingleItem = (item) => {
        navigate("/laptopsdetails", { state: { item } });
    };

    const handleLogoClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" color="primary">
                <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleLogoClick}>
                        <img src={logo} alt="Logo" width={120} height={60} />
                        <Typography variant="h6" sx={{ ml: 2, color: "white" }}>
                            Laptops Shop
                        </Typography>
                    </Box>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search laptops"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: "white", borderRadius: 1, width: { xs: "100%", sm: 300 } }}
                    />

                    <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 150, bgcolor: "white", borderRadius: 1 }}
                    >
                        <InputLabel>Sort by</InputLabel>
                        <Select value={sortOption} onChange={handleSortChange} label="Sort by">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="name-asc">Name: A-Z</MenuItem>
                            <MenuItem value="name-desc">Name: Z-A</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton onClick={handleLogoClick} color="inherit" aria-label="logout" size="large">
                            <LogoutIcon fontSize="large" />
                        </IconButton>
                        <IconButton component={Link} to="/cart" color="inherit" aria-label="cart" size="large">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Product Grid */}
            <Container sx={{ py: 4, maxWidth: "lg" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading laptops...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : sortedLaptops.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No laptops available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedLaptops.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: 6 },
                                    }}
                                    onClick={() => displaySingleItem(item)}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(item);
                                            }}
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

export default Laptops;
