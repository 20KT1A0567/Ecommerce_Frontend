import { Link } from "react-router-dom";
import "./user.css";
import React, { useEffect, useRef } from "react";
import logo from '../user/image.png'

const Homepage = () => {
  const carouselRef = useRef(null);
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextButton = carouselRef.current.querySelector(".carousel-control-next");
        if (nextButton) {
          nextButton.click();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <div className="shopping-app">
        <div className="app-header">
          <div className="logo"><img src={logo} width={200} height={100}></img></div><div className="search-bar-container">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search products"
                className="search-bar"
              />
              
            </div>

          </div>

          <div className="cartlogin">
            <Link to="/login"><img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg" width={50} height={50} className="login"></img></Link>
            <Link to="/cart"><img src="https://static.vecteezy.com/system/resources/previews/004/798/846/original/shopping-cart-logo-or-icon-design-vector.jpg" width={100} height={100} className="login"></img></Link>
          </div>
        </div>
      </div>
      <div></div>
      <main>
        <div className="container my-">
          <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel" ref={carouselRef}>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://excelrr.s3.eu-north-1.amazonaws.com/shopping1.jpg" alt="Shopping" className="d-block w-100 carousel-img" />
              </div>
              <div className="carousel-item">
                <img src="https://excelrr.s3.eu-north-1.amazonaws.com/footwear.jpg" alt="Footwear" className="d-block w-100 carousel-img" />
              </div>
              <div className="carousel-item">
                <img src="https://batterylifehack.com/wp-content/uploads/2019/05/Electronic-4.jpg" alt="Electronics" className="d-block w-100 carousel-img" />
              </div>
              <div className="carousel-item">
                <img src="https://e0.pxfuel.com/wallpapers/598/149/desktop-wallpaper-there-is-no-denying-that-online-shopping-is-one-of-the-biggest-groceries.jpg" alt="Shopping Again" className="d-block w-100 carousel-img" />
              </div>
              <div className="carousel-item">
                <img src="https://th.bing.com/th/id/R.0fba4a18a87e15cde343d651e6098368?rik=0vds9MtcdsBfhQ&riu=http%3a%2f%2fwww.kumartoys.co.in%2fmedia%2fwysiwyg%2fzendcube%2fslider%2fbanner-1.jpg&ehk=IglqzwBfNieh%2fsZzBhDYTUXXagxh10N8AHClmjvWxkI%3d&risl=&pid=ImgRaw&r=0" className="d-block w-100 carousel-img" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </main>
      <div className="main">
        <div className="products-con"> <Link to="/groceries1"><img src="https://3.imimg.com/data3/VS/UT/MY-13965561/groceries-500x500.png" width={200} height={200} className="products"></img></Link><br></br><br></br>GROCERIES</div>
        <div className="products-con"> <Link to="/cosmetics1"><img src="https://www.marketing91.com/wp-content/uploads/2018/05/Cosmetic-Brands.jpg" width={200} height={200} className="products"></img></Link><br></br><br></br>COSMETICS</div>
        <div className="products-con"> <Link to="/electronics1"><img src="https://www.paldrop.com/wp-content/uploads/2018/09/must-have-kitchen-appliances.jpeg" width={200} height={200} className="products"></img></Link><br></br><br></br>ELECTRONICS</div>
        <div className="products-con"> <Link to="/footwear1"><img src="https://th.bing.com/th/id/OIP.NsLDX4QkBgYbKDTosjxyewHaFj?w=223&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" width={200} height={200} className="products"></img></Link><br></br><br></br>FOOT WEAR</div>
        <div className="products-con"> <Link to="/kids1"><img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQDVfjfpGGtXcmcRoq6O_5VXKuzS2gmhqCiB_7LwaGAzQeeNjTmwpprmVeGoHpvH6BbOOfYOln1N5lwrrRxy7HsEMnOtLJD1G5-LWyUCiz5eQGy_uY9ha8w_w&usqp=CAc" width={200} height={200} className="products"></img></Link><br></br> <br></br>KIDS WEAR </div>
        <div className="products-con"> <Link to="/women1"><img src="https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/939be75a-df75-4dfc-86e3-1b9919af21f5._CR0,0,1911,1000_SX860_QL70_.jpg" width={200} height={200} className="products"></img></Link><br></br> <br></br>WOMENS  </div>
        <div className="products-con"> <Link to="/men1"><img src="https://m.media-amazon.com/images/I/716KHpIWNPL._SX522_.jpg" width={200} height={200} className="products"></img></Link><br></br> <br></br>MEN</div>
        <div className="products-con"> <Link to="/laptops1"><img src="https://p2-ofp.static.pub/fes/cms/2022/09/26/i6zlcap44kafmcywlh54d9rd1wieh1215035.png" width={200} height={200} className="products"></img></Link><br></br><br></br> LAPTOPS</div>
        <div className="products-con"> <Link to="/toys1"><img src="https://th.bing.com/th?id=OPAC.YVFRJlLxQDxjwg474C474&w=406&h=406&o=5&dpr=1.3&pid=21.1" width={200} height={200} className="products"></img></Link><br></br><br></br> TOYS</div>

        <div className="products-con"> <Link to="/mobiles1"><img src="https://s3.amazonaws.com/images.ecwid.com/images/13261323/808798742.jpg" width={200} height={200} className="products"></img></Link><br></br><br></br> MOBILES </div>

      </div>
      <footer className="app-footer">
        <div className="footer-top">
          <div className="footer-section">
            <h4>About ShoppingApp</h4>
            <p>Shop the latest and greatest products online. Great deals, fast shipping, and quality service.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop Now</a></li>
              <li><a href="#deals">Deals & Offers</a></li>
              <li><a href="#cart">Your Cart</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Policies</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#cookie">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Stay Updated</h4>
            <p>Sign up for our newsletter to receive the latest offers and updates.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
          <p>&copy; 2024 ShoppingApp. All rights reserved.</p>
        </div>
      </footer>

    </>
  )
}
export default Homepage;