import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from "../user/image.png";

const Toys = () => {
    const [toys, setToys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const navigate = useNavigate();

    const getToys = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-7-bbpl.onrender.com/user/toys", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setToys(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching toys:", error);
            setError("Failed to load toys. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getToys();
    }, []);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const filteredToys = toys.filter((toy) =>
        toy.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    const sortedToys = [...filteredToys].sort((a, b) => {
        if (sortOption === "name-asc") return a.name.localeCompare(b.name);
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (toy) => {
        const existingToy = cart.find((cartItem) => cartItem.id === toy.id);
        if (existingToy) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === toy.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, { ...toy, quantity: 1 }]);
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
        navigate("/toysdetails", { state: { item } });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setShowSortOptions(false);
    };

    return (
        <>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img src={logo} alt="Logo" width={160} height={80} />
                    <TextField
                        variant="outlined"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="small"
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Filter
                    </Button>
                    {showSortOptions && (
                        <FormControl sx={{ minWidth: 160 }} size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortOption}
                                label="Sort By"
                                onChange={handleSortChange}
                                autoWidth
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
                    <Link to="/" aria-label="Logout">
                        <IconButton color="primary">
                            <LogoutIcon fontSize="large" />
                        </IconButton>
                    </Link>
                    <Link to="/cart" aria-label="Cart">
                        <IconButton color="primary">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Link>
                </Box>
            </Box>

            {/* Products Grid */}
            <Box sx={{ p: 2 }}>
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
                        <Typography variant="h6">Loading toys...</Typography>
                    </Box>
                ) : error ? (
                    <Typography
                        variant="h6"
                        color="error"
                        align="center"
                        sx={{ mt: 6 }}
                    >
                        {error}
                    </Typography>
                ) : sortedToys.length > 0 ? (
                    <Grid container spacing={3}>
                        {sortedToys.map((item) => {
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
                                        tabIndex={0}
                                        role="button"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") display_singleitem(item);
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
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                noWrap
                                                title={item.name}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {item.description}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                                Price: ₹{item.price}
                                            </Typography>
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                justifyContent: "space-between",
                                                px: 2,
                                                pb: 2,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleAddToCart(item)}
                                            >
                                                Add to Cart
                                            </Button>

                                            {cartItem && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography>{cartItem.quantity}</Typography>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
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
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 6 }}>
                        No toys available.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default Toys;
