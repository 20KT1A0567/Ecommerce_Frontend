import axios from "axios";
import { useEffect, useState } from "react";
import './Products.css';
import "./user.css";
import logo from './image.png';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Women1 = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-2.onrender.com/women");
            setElectronics(res.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching   Women:", error);
            setError("Failed to load   Women data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (event, item) => {
        event.stopPropagation();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in to add items to the cart.");
            navigate("/login");
            return;
        }
        axios.post("https://demo-deployment2-2.onrender.com/women", item, {
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
            <div className="shopping-app">
                <div className="app-header">
                    <div className="logo">
                        <img src={logo} width={200} height={100} alt="Logo" />
                    </div>
                    <div>
                        <input type="search" placeholder="Search products" className="search-bar" />

                    </div>
                    <div className="cartlogin">
                        <Link to="/login"><img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg" width={50} height={50} className="login"></img></Link>
                        <Link to="/cart"><img src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg" width={100} height={100} className="login"></img></Link>
                    </div>
                </div>
            </div>

            <div className="product-container">
                {loading ? (
                    <div className="loading-message">Loading  Women...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : electronics.length > 0 ? (
                    electronics.map((item) => (
                        <div key={item.id} className="product-card">
                            <img src={item.image} alt={item.name} className="product-image" />
                            <div className="name">{item.name}</div>
                            <div className="description">{item.description}</div>
                            <div className="price">Price: ₹{item.price}</div>

                            <button
                                className="add-to-cart-btn"
                                onClick={(event) => handleAddToCart(event, item)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-data-message">No  Women available.</div>
                )}
            </div>
        </>
    );
};

export default Women1;
