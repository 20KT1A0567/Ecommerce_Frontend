import axios from "axios";
import { useEffect, useState } from "react";
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
    CircularProgress,
    Box,
    IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from '../user/image.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Laptops1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/laptops");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching Laptops:", error);
            setError("Failed to load Laptops data. Please try again.");
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

        axios.post("https://demo-deployment2-8-cq0p.onrender.com/laptops", item, {
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

    const filteredElectronics = electronics.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
                <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src={logo} alt="Logo" width={130} height={70} />
                        <Typography variant="h6" sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}>
                            Laptop Store
                        </Typography>
                    </Box>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search laptops"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 1, width: { xs: '100%', sm: 300 } }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton component={Link} to="/login" color="inherit" size="large">
                            <AccountCircleIcon fontSize="large" />
                        </IconButton>
                        <IconButton component={Link} to="/cart" color="inherit" size="large">
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Product Grid */}
            <Container sx={{ py: 4, maxWidth: 'lg' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading Laptops...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ mt: 4 }}>
                        {error}
                    </Typography>
                ) : filteredElectronics.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        No Laptops available.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredElectronics.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'default',
                                        "&:hover": { boxShadow: 6 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: 'contain', p: 1 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}
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
                                            color="primary"
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

export default Laptops1;
