import axios from "axios";
import { useEffect, useState } from "react";
import './Products.css';
import "./user.css";
import logo from '../user/image.png';
import { Link, useNavigate } from "react-router-dom";

const Electronics = () => {
    const [electronics, setElectronics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const navigate = useNavigate();
    const getElectronics = async () => {
        try {
            const res = await axios.get("https://demo-deployment2-4.onrender.com/user/electronics", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
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
    const filteredElectronics = electronics.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedElectronics = [...filteredElectronics].sort((a, b) => {
        if (sortOption === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "name-desc") {
            return b.name.localeCompare(a.name);
        } else if (sortOption === "price-asc") {
            return a.price - b.price;
        } else if (sortOption === "price-desc") {
            return b.price - a.price;
        }
        return 0;
    });
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setShowSortOptions(false);
    };
    const handleAddToCart = (item) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            const existingItem = cart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                setCart(
                    cart.map((cartItem) =>
                        cartItem.id === item.id
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                    )
                );
            } else {
                setCart([...cart, { ...item, quantity: 1 }]);
            }
        }
    };
    const displaySingleItem = (item) => {
        navigate("/electronicsdetails", { state: { item } });
    };

    const handleLogoClick = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            <div className="shopping-app">
                <div className="app-header">
                    <div className="logo">
                        <img src={logo} width={200} height={100} alt="Logo" />
                    </div>
                    <div>
                        <input
                            type="search"
                            placeholder="Search products"
                            className="search-bar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="filter-container">
                        <button className="filter-btn" onClick={() => setShowSortOptions(!showSortOptions)}>
                            Filter
                        </button>
                        {showSortOptions && (
                            <div className="sort-options">
                                <select
                                    className="sort-dropdown"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                >
                                    <option value="">Sort by</option>
                                    <option value="name-asc">Name: A-Z</option>
                                    <option value="name-desc">Name: Z-A</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="cartlogin">
                        <Link to="/" onClick={handleLogoClick}>
                            <img
                                src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                                width={50}
                                height={50}
                                className="login"
                                alt="Logout"
                            />
                        </Link>
                        <Link to="/cart">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                                width={100}
                                height={100}
                                className="login"
                                alt="Cart"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="product-container">
                {loading ? (
                    <div className="loading-message">Loading electronics...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : sortedElectronics.length > 0 ? (
                    sortedElectronics.map((item) => (
                        <div key={item.id} className="product-card" onClick={() => displaySingleItem(item)}>
                            <img src={item.image} alt={item.name} className="product-image" />
                            <div className="name">{item.name}</div>
                            <div className="description">{item.description}</div>
                            <div className="price">Price: ₹{item.price}</div>
                            <button
                                onClick={(e) => {
                                    handleAddToCart(item);

                                }}
                                className="add-to-cart-btn"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-data-message">No electronics available.</div>
                )}
            </div>
        </>
    );
};

export default Electronics;
