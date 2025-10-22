
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./image.png";
import "./user1.css";
import { useEffect } from "react";
import RenderSearchResults from "./RenderSearchResults.jsx";
const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleLogoClick = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {

  }, [searchQuery, searchResults])
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://demo-deployment2-2.onrender.com/user/search?keyword=${query}`
        );
        const searchResults = [];

        response.data.forEach((entry) => {
          entry.products.forEach((product) => {
            if (
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              searchResults.push({
                ...product,
                category: entry.category
              });
            }
          });
        });

        Object.values(response.data).forEach((category) => {
          category.forEach((product) => {
            if (
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              searchResults.push(product);
            }
          });
        });

        setSearchResults(searchResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };
  const renderCategories = () => {
    return (
      <div className="amazon-style">
        <h2>Explore Categories</h2>
        <div className="amazon-categories">
          {[
            {
              to: "/groceries",
              src: "https://3.imimg.com/data3/VS/UT/MY-13965561/groceries-500x500.png",
              label: "GROCERIES",
            },
            {
              to: "/cosmetics",
              src: "https://www.marketing91.com/wp-content/uploads/2018/05/Cosmetic-Brands.jpg",
              label: "COSMETICS",
            },
            {
              to: "/electronics",
              src: "https://www.paldrop.com/wp-content/uploads/2018/09/must-have-kitchen-appliances.jpeg",
              label: "ELECTRONICS",
            },
            {
              to: "/footwear",
              src: "https://th.bing.com/th/id/OIP.NsLDX4QkBgYbKDTosjxyewHaFj?w=223&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
              label: "FOOTWEAR",
            },
            {
              to: "/kids",
              src: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQDVfjfpGGtXcmcRoq6O_5VXKuzS2gmhqCiB_7LwaGAzQeeNjTmwpprmVeGoHpvH6BbOOfYOln1N5lwrrRxy7HsEMnOtLJD1G5-LWyUCiz5eQGy_uY9ha8w_w&usqp=CAc",
              label: "KIDS WEAR",
            },
            {
              to: "/women",
              src: "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/939be75a-df75-4dfc-86e3-1b9919af21f5._CR0,0,1911,1000_SX860_QL70_.jpg",
              label: "WOMEN",
            },
            {
              to: "/men",
              src: "https://m.media-amazon.com/images/I/716KHpIWNPL.SX522.jpg",
              label: "MEN",
            },
            {
              to: "/laptops",
              src: "https://p2-ofp.static.pub/fes/cms/2022/09/26/i6zlcap44kafmcywlh54d9rd1wieh1215035.png",
              label: "LAPTOPS",
            },
            {
              to: "/toys",
              src: "https://th.bing.com/th?id=OPAC.YVFRJlLxQDxjwg474C474&w=406&h=406&o=5&dpr=1.3&pid=21.1",
              label: "TOYS",
            },
            {
              to: "/mobiles",
              src: "https://s3.amazonaws.com/images.ecwid.com/images/13261323/808798742.jpg",
              label: "MOBILES",
            },
          ].map((category) => (
            <div key={category.label} className="amazon-category-item">
              <Link to={category.to}>
                <img src={category.src} alt={category.label} width={200} height={200} />
                <p>{category.label}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="shopping-app">
        <div className="app-header">
          <div className="logo">
            <img src={logo} alt="App Logo" width={200} height={100} />
          </div>

          <div className="search-bar-container">
            <input
              type="search"
              placeholder="Search products"
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyUp={(e) => {
                if (e.key === 'Backspace' && searchQuery === '') {
                  setSearchResults([]);
                }
              }}
            />
          </div>

          <div className="cart-login">
            <div className="icon1"><i className="fa fa-user-circle"></i></div>
            <h1 className="icon">{localStorage.getItem("username")}</h1>
            <div className="cartlogin">
              <Link to="/" onClick={handleLogoClick}>
                <img
                  src="https://www.shutterstock.com/image-vector/logout-button-260nw-312305171.jpg"
                  width={40}
                  height={40}
                  className="login"
                  alt="Logout"
                />
              </Link>
            </div>
            <Link to="/cart">
              <img
                src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg"
                alt="Cart"
                width={50}
                height={50}
                className="cart-icon"
              />
            </Link>
          </div>
        </div>
      </div>
      {searchQuery.trim().length
        > 0 ? <RenderSearchResults loading={loading} searchQuery={searchQuery} searchResults={searchResults}></RenderSearchResults> : renderCategories()}
    </>
  );
};

export default UserDashboard;