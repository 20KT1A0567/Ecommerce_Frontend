import { useState, useEffect } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

const Men = () => {
    const [menProducts, setMenProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const navigate = useNavigate();

    const getMenProducts = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/user/men", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMenProducts(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching men's products:", error);
            setError("Failed to load men's products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMenProducts();
    }, []);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const filteredMenProducts = menProducts.filter((item) =>
        item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    const sortedMenProducts = [...filteredMenProducts].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (item) => {
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

    const handleQuantityChange = (itemId, change) => {
        setCart(
            cart.map((cartItem) =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) }
                    : cartItem
            )
        );
    };

    const display_singleitem = (item) => {
        navigate("/mendetails", { state: { item } });
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setShowSortOptions(false);
    };

    return (
        <>
            {/* AppBar/Header */}
            <AppBar position="sticky" sx={{ bgcolor: "primary.main" }}>
                <Toolbar
                    sx={{
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Logo" width={130} height={70} />
                        <Typography
                            variant="h6"
                            sx={{ ml: 2, color: "white", fontWeight: "bold" }}
                        >
                            Men's Products
                        </Typography>
                    </Box>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: "white", borderRadius: 1, width: { xs: "100%", sm: 300 } }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => setShowSortOptions(!showSortOptions)}
                        >
                            Filter
                        </Button>

                        {showSortOptions && (
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="sort-select-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sortOption}
                                    label="Sort by"
                                    onChange={handleSortChange}
                                    size="small"
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
                        )}

                        <IconButton
                            component={Link}
                            to="/"
                            color="inherit"
                            aria-label="logout"
                            size="large"
                            sx={{ color: "white" }}
                        >
                            <img
                                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                                alt="Logout"
                                width={30}
                                height={30}
                                style={{ borderRadius: 4 }}
                            />
                        </IconButton>

                        <IconButton
                            component={Link}
                            to="/cart"
                            color="inherit"
                            aria-label="cart"
                            size="large"
                            sx={{ color: "white" }}
                        >
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                                alt="Cart"
                                width={40}
                                height={40}
                            />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Products */}
            <Container sx={{ py: 4, maxWidth: "lg" }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 300,
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        <CircularProgress />
                        <Typography>Loading men's products...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : sortedMenProducts.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No men's products available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedMenProducts.map((item) => {
                            const cartItem = cart.find((c) => c.id === item.id);
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            cursor: "pointer",
                                            "&:hover": { boxShadow: 6 },
                                        }}
                                        onClick={() => display_singleitem(item)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={item.image}
                                            alt={item.name}
                                            sx={{ objectFit: "contain", p: 1 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" noWrap>
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
                                        <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(item);
                                                }}
                                            >
                                                Add to Cart
                                            </Button>

                                            {cartItem && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        bgcolor: "grey.200",
                                                        borderRadius: 1,
                                                        px: 1,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography>{cartItem.quantity}</Typography>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default Men;
