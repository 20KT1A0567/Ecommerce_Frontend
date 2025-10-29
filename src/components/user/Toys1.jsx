import axios from "axios";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from "../user/image.png";

const Toys1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-15-syk7.onrender.com/toys");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Toys:", error);
            setError("Failed to load Toys data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getElectronics();
    }, []);

    const getAuthToken = () => localStorage.getItem("token");

    const handleAddToCart = (event, item) => {
        event.stopPropagation();

        const token = getAuthToken();
        if (!token) {
            alert("You need to log in to add items to the cart.");
            navigate("/login");
            return;
        }
        axios
            .post("https://demo-deployment2-15-syk7.onrender.com/toys", item, {
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

    // Filter toys by search term
    const filteredElectronics = electronics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    boxShadow: 1,
                    flexWrap: "wrap",
                    gap: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img src={logo} alt="Logo" width={160} height={80} />
                   
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Link to="/login" aria-label="Login">
                        <IconButton color="primary" size="large">
                            <AccountCircleIcon fontSize="large" />
                        </IconButton>
                    </Link>
                    <Link to="/cart" aria-label="Cart">
                        <IconButton color="primary" size="large">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Link>
                </Box>
            </Box>

            {/* Product Grid */}
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
                        <Typography variant="h6">Loading Toys...</Typography>
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error" align="center" sx={{ mt: 6 }}>
                        {error}
                    </Typography>
                ) : filteredElectronics.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredElectronics.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "default",
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
                                    <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
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
                    <Typography variant="h6" align="center" sx={{ mt: 6 }}>
                        No Toys available.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default Toys1;
