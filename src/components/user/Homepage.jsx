import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../user/image.png";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  TextareaAutosize,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const images = [
  {
    src: "https://tse1.mm.bing.net/th/id/OIP.r9swUkudWzWLJCFjNVkypQHaEJ?pid=Api&P=0&h=180",
    alt: "Shopping",
  },
  {
    src: "https://tse3.mm.bing.net/th/id/OIP.mO9EhCoHe-ddGDmRmQMn0gHaE6?pid=Api&P=0&h=180",
    alt: "Footwear",
  },
  {
    src: "https://tse4.mm.bing.net/th/id/OIP.zJ56fxZnSrg7Tc_oL6MTOQHaE7?pid=Api&P=0&h=180",
    alt: "Electronics",
  },
  {
    src: "https://e0.pxfuel.com/wallpapers/598/149/desktop-wallpaper-there-is-no-denying-that-online-shopping-is-one-of-the-biggest-groceries.jpg",
    alt: "Shopping Again",
  },
  {
    src: "https://th.bing.com/th/id/R.0fba4a18a87e15cde343d651e6098368?rik=0vds9MtcdsBfhQ&riu=http%3a%2f%2fwww.kumartoys.co.in%2fmedia%2fwysiwyg%2fzendcube%2fslider%2fbanner-1.jpg&ehk=IglqzwBfNieh%2fsZzBhDYTUXXagxh10N8AHClmjvWxkI%3d&risl=&pid=ImgRaw&r=0",
    alt: "Banner",
  },
];

const productCategories = [
  {
    name: "GROCERIES",
    img: "https://3.imimg.com/data3/VS/UT/MY-13965561/groceries-500x500.png",
    link: "/groceries1",
  },
  {
    name: "COSMETICS",
    img: "https://www.marketing91.com/wp-content/uploads/2018/05/Cosmetic-Brands.jpg",
    link: "/cosmetics1",
  },
  {
    name: "ELECTRONICS",
    img: "https://www.paldrop.com/wp-content/uploads/2018/09/must-have-kitchen-appliances.jpeg",
    link: "/electronics1",
  },
  {
    name: "FOOT WEAR",
    img: "https://th.bing.com/th/id/OIP.NsLDX4QkBgYbKDTosjxyewHaFj?w=223&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    link: "/footwear1",
  },
  {
    name: "KIDS WEAR",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQDVfjfpGGtXcmcRoq6O_5VXKuzS2gmhqCiB_7LwaGAzQeeNjTmwpprmVeGoHpvH6BbOOfYOln1N5lwrrRxy7HsEMnOtLJD1G5-LWyUCiz5eQGy_uY9ha8w_w&usqp=CAc",
    link: "/kids1",
  },
  {
    name: "WOMENS",
    img: "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/939be75a-df75-4dfc-86e3-1b9919af21f5._CR0,0,1911,1000_SX860_QL70_.jpg",
    link: "/women1",
  },
  {
    name: "MEN",
    img: "https://m.media-amazon.com/images/I/716KHpIWNPL._SX522_.jpg",
    link: "/men1",
  },
  {
    name: "LAPTOPS",
    img: "https://p2-ofp.static.pub/fes/cms/2022/09/26/i6zlcap44kafmcywlh54d9rd1wieh1215035.png",
    link: "/laptops1",
  },
  {
    name: "TOYS",
    img: "https://th.bing.com/th?id=OPAC.YVFRJlLxQDxjwg474C474&w=406&h=406&o=5&dpr=1.3&pid=21.1",
    link: "/toys1",
  },
  {
    name: "MOBILES",
    img: "https://s3.amazonaws.com/images.ecwid.com/images/13261323/808798742.jpg",
    link: "/mobiles1",
  },
];

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" width={50} height={50} />
            <Typography variant="h6" sx={{ ml: 1, color: "#fff" }}>
              ShoppingApp
            </Typography>
          </Box>


          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/login" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
                alt="Login"
                width={40}
                height={40}
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Link to="/cart" style={{ display: "flex", alignItems: "center" }}>
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

      {/* Carousel */}
      <Box
        sx={{
          position: "relative",
          maxWidth: 1200,
          mx: "auto",
          mt: 3,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          height={isSmUp ? 400 : 250}
          image={images[currentIndex].src}
          alt={images[currentIndex].alt}
          sx={{ objectFit: "cover", width: "100%" }}
        />
        {/* Controls */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.3)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
          }}
          aria-label="previous"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.3)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
          }}
          aria-label="next"
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Categories Grid */}
      <Container sx={{ py: 5, maxWidth: "lg" }}>
        <Grid container spacing={4}>
          {productCategories.map(({ name, img, link }) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={name}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                component={Link}
                to={link}
                sx={{
                  textDecoration: "none",
                  width: 1,
                  maxWidth: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                  boxShadow: 4,
                  "&:hover": { boxShadow: 8 },
                }}
              >
                <CardMedia
                  component="img"
                  image={img}
                  alt={name}
                  sx={{ height: 200, objectFit: "contain", mb: 2 }}
                />
                <CardContent sx={{ textAlign: "center", p: 0 }}>
                  <Typography variant="h6" component="div" color="text.primary">
                    {name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: "#1976d2", color: "#fff", pt: 6, pb: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                About ShoppingApp
              </Typography>
              <Typography variant="body2">
                Shop the latest and greatest products online. Great deals, fast shipping,
                and quality service.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Home", "Shop Now", "Deals & Offers", "Your Cart"].map((item) => (
                  <li key={item}>
                    <a href={"#" + item.toLowerCase().replace(/ /g, "")} style={{ color: "white", textDecoration: "none" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Customer Service
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Help Center", "Returns & Exchanges", "Shipping Info", "Contact Us"].map((item) => (
                  <li key={item}>
                    <a href={"#" + item.toLowerCase().replace(/ /g, "")} style={{ color: "white", textDecoration: "none" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Policies
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href={"#" + item.toLowerCase().replace(/ /g, "")} style={{ color: "white", textDecoration: "none" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>
              <Typography variant="h6" gutterBottom>
                Stay Updated
              </Typography>
              <Typography variant="body2" mb={1}>
                Sign up for our newsletter to receive the latest offers and updates.
              </Typography>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Subscribed!");
                }}
                sx={{ display: "flex", gap: 1, maxWidth: 400 }}
              >
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  required
                  size="small"
                  sx={{ bgcolor: "white", borderRadius: 1, flexGrow: 1 }}
                />
                <Button type="submit" variant="contained" color="secondary">
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            mt={5}
            pt={3}
            borderTop="1px solid rgba(255, 255, 255, 0.3)"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <Box>
              {/* Social icons */}
              {["facebook", "twitter", "instagram", "youtube"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  style={{ color: "white", marginRight: 12, fontSize: 20 }}
                  className={`fab fa-${icon}`}
                />
              ))}
            </Box>
            <Typography variant="body2" sx={{ fontSize: 14 }}>
              &copy; 2024 ShoppingApp. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Homepage;
