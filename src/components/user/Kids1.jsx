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
    CircularProgress,
    Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

const Kids1 = () => {
    const [kids, setKids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getKids = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-15-syk7.onrender.com/kids");
            setKids(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Kids:", error);
            setError("Failed to load Kids data. Please try again.");
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
        axios
            .post("https://demo-deployment2-15-syk7.onrender.com/kids", item, {
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
        getKids();
    }, []);

    const filteredKids = kids.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" color="primary">
                <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                        <img src={logo} alt="Logo" width={120} height={60} />
                        <Typography variant="h6" sx={{ ml: 2, color: "white" }}>
                            Kids Shop
                        </Typography>
                    </Box>

                    

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton component={Link} to="/login" color="inherit" aria-label="login" size="large">
                            <AccountCircleIcon fontSize="large" />
                        </IconButton>
                        <IconButton component={Link} to="/cart" color="inherit" aria-label="cart" size="large">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Container sx={{ py: 4, maxWidth: "lg" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading Kids...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : filteredKids.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No Kids available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredKids.map((item) => (
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
                                            onClick={(e) => handleAddToCart(e, item)}
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

export default Kids1;
