import { useState, useEffect } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    TextField,
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
    IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

const Mobiles = () => {
    const [mobiles, setMobiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);

    const navigate = useNavigate();

    const getMobiles = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-5-zlsf.onrender.com/user/mobiles", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMobiles(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching mobiles:", error);
            setError("Failed to load mobiles. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMobiles();
    }, []);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const filteredMobiles = mobiles.filter((mobile) =>
        mobile.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    const sortedMobiles = [...filteredMobiles].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (mobile) => {
        const existingMobile = cart.find((cartItem) => cartItem.id === mobile.id);
        if (existingMobile) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === mobile.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, { ...mobile, quantity: 1 }]);
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

    const displaySingleItem = (item) => {
        navigate("/mobiledetails", { state: { item } });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setShowSortOptions(false);
    };

    return (
        <>
            {/* Header */}
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
                            Mobiles
                        </Typography>
                    </Box>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search mobiles"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: "white", borderRadius: 1, width: { xs: "100%", sm: 300 } }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => setShowSortOptions(!showSortOptions)}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Filter
                        </Button>
                        {showSortOptions && (
                            <FormControl size="small" sx={{ minWidth: 160, bgcolor: "white", borderRadius: 1 }}>
                                <InputLabel id="sort-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    value={sortOption}
                                    label="Sort by"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="">None</MenuItem>
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
                            sx={{ color: "white" }}
                            aria-label="logout"
                        >
                            <img
                                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                                alt="Logout"
                                width={35}
                                height={35}
                            />
                        </IconButton>

                        <IconButton
                            component={Link}
                            to="/cart"
                            sx={{ color: "white" }}
                            aria-label="cart"
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
                        <Typography>Loading mobiles...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : sortedMobiles.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No mobiles available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {sortedMobiles.map((item) => {
                            const cartItem = cart.find((cartItem) => cartItem.id === item.id);
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
                                                        border: "1px solid #ccc",
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

export default Mobiles;
