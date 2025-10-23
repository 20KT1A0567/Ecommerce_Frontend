import axios from "axios";
import { useEffect, useState } from "react";
import logo from './image.png';
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    TextField,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Women1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/women");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Women:", error);
            setError("Failed to load Women data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getAuthToken = () => localStorage.getItem("token");

    const handleAddToCart = (event, item) => {
        event.stopPropagation();

        const token = getAuthToken();
        if (!token) {
            alert("You need to log in to add items to the cart.");
            navigate("/login");
            return;
        }
        axios.post("https://demo-deployment2-8-cq0p.onrender.com/women", item, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                alert("Item added to cart successfully!");
            })
            .catch((error) => {
                console.error("Error adding item to cart:", error);
                alert("Failed to add item to cart. Please try again.");
                navigate("/login");
            });
    };

    useEffect(() => {
        getElectronics();
    }, []);

    return (
        <>
            {/* Header */}
            <AppBar position="static" color="default" sx={{ mb: 3 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    {/* Logo */}
                    <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo"
                            sx={{ width: 150, height: 70, objectFit: "contain" }}
                        />
                    </Box>

                    {/* Search input */}
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search products"
                        sx={{ flexGrow: 1, maxWidth: 400, minWidth: 200 }}
                    // You can add onChange for search logic later
                    />

                    {/* Icons: Login/Profile & Cart */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Link to="/login" aria-label="login">
                            <IconButton color="primary">
                                <AccountCircleIcon fontSize="large" />
                            </IconButton>
                        </Link>
                        <Link to="/cart" aria-label="cart">
                            <IconButton color="primary">
                                <ShoppingCartIcon fontSize="large" />
                            </IconButton>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Products grid */}
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
                        <Typography variant="h6">Loading Women...</Typography>
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
                ) : electronics.length > 0 ? (
                    <Grid container spacing={3}>
                        {electronics.map((item) => (
                            <Grid
                                item
                                key={item.id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                sx={{ cursor: "default" }}
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
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        No Women available.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default Women1;
