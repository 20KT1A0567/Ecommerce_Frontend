import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../user/image.png";
import { Link, useNavigate } from "react-router-dom";

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
} from "@mui/material";

const Footwear1 = () => {
    const [footwear, setFootwear] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getFootwear = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-15-syk7.onrender.com/footwear");
            setFootwear(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Footwear:", error);
            setError("Failed to load Footwear data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFootwear();
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
            .post("https://demo-deployment2-15-syk7.onrender.com/cart", item, {
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

    // Optional: simple search filter on name
    const filteredFootwear = footwear.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Logo" width={50} height={50} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            Footwear Store
                        </Typography>
                    </Box>

                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <img
                                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
                                alt="Login"
                                width={40}
                                height={40}
                                style={{ cursor: "pointer" }}
                            />
                        </Link>
                        <Link to="/cart" style={{ textDecoration: "none" }}>
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

            {/* Product Grid */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, maxWidth: 1200, mx: "auto" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                        <Typography variant="h6" ml={2}>
                            Loading Footwear...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error" align="center" mt={5}>
                        {error}
                    </Typography>
                ) : filteredFootwear.length === 0 ? (
                    <Typography variant="h6" align="center" mt={5}>
                        No Footwear available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredFootwear.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        ":hover": { boxShadow: 6 },
                                    }}
                                    onClick={() => navigate(`/footweardetails`, { state: { item } })}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image || "https://via.placeholder.com/300"}
                                        alt={item.name}
                                        sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300";
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" noWrap>
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
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={(e) => handleAddToCart(e, item)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Footwear1;
