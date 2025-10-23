import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../user/image.png";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    TextField,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Electronics1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-7-bbpl.onrender.com/electronics");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching electronics:", error);
            setError("Failed to load electronics data. Please try again.");
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
            setSnackbar({ open: true, message: "You need to log in to add items to the cart.", severity: "warning" });
            navigate("/login");
            return;
        }
        axios
            .post("https://demo-deployment2-7-bbpl.onrender.com/cart", item, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setSnackbar({ open: true, message: "Item added to cart successfully!", severity: "success" });
            })
            .catch((error) => {
                console.error("Error adding item to cart:", error);
                setSnackbar({ open: true, message: "Failed to add item to cart. Please try again.", severity: "error" });
                navigate("/login");
            });
    };

    // Filter electronics by search term
    const filteredElectronics = electronics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <>
            {/* Header with logo, search, and links */}
            <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            width={50}
                            height={50}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        />
                        <Typography variant="h6" fontWeight="bold" color="inherit" noWrap>
                            Electronics Store
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexGrow: 1,
                            maxWidth: { xs: "100%", sm: 400 },
                            mt: { xs: 1, sm: 0 },
                        }}
                    >
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search products"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                endAdornment: <SearchIcon color="action" />,
                                sx: { bgcolor: "white", borderRadius: 1 },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
                        <IconButton color="inherit" component={Link} to="/login">
                            <AccountCircleIcon fontSize="large" />
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Products Grid */}
            <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: "auto" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                        <Typography variant="h6" ml={2}>
                            Loading electronics...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" variant="h6" align="center" mt={5}>
                        {error}
                    </Typography>
                ) : filteredElectronics.length === 0 ? (
                    <Typography variant="h6" align="center" mt={5}>
                        No electronics found.
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {filteredElectronics.map((item) => (
                            <Grid key={item.id} item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: 3,
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.image || "https://via.placeholder.com/300"}
                                        alt={item.name}
                                        sx={{ height: 200, objectFit: "contain", bgcolor: "#f5f5f5" }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300";
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap>
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
                                            color="primary"
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

            {/* Snackbar Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Electronics1;
