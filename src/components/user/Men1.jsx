import axios from "axios";
import { useEffect, useState } from "react";
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
    CircularProgress,
    IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

const Men1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-5-zlsf.onrender.com/men");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Men:", error);
            setError("Failed to load Men data. Please try again.");
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
            .post("https://demo-deployment2-5-zlsf.onrender.com/men", item, {
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

    const filteredElectronics = electronics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                        <img src={logo} alt="Logo" width={130} height={70} />
                        <Typography variant="h6" sx={{ ml: 2, color: "white", fontWeight: "bold" }}>
                            Men Products
                        </Typography>
                    </Box>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ bgcolor: "white", borderRadius: 1, width: { xs: "100%", sm: 300 } }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton component={Link} to="/login" sx={{ color: "white" }} aria-label="login">
                            <img
                                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
                                alt="Login"
                                width={35}
                                height={35}
                            />
                        </IconButton>

                        <IconButton component={Link} to="/cart" sx={{ color: "white" }} aria-label="cart">
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
                        <Typography>Loading Men...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : filteredElectronics.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No Men available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredElectronics.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Card
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
                                    <CardActions>
                                        <Button
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
                )}
            </Container>
        </>
    );
};

export default Men1;
