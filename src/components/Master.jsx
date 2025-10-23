import React from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import Cart from "../Cart.jsx";
import Homepage from "./user/Homepage";
import Login from "../components/global/Login.jsx";
import Groceries from './user/Groceries';
import Comsmetics from "./user/Cosmetics";
import Electronics from "./user/Electronics";
import Footwear from "./user/Footwear";
import Kids from "./user/Kids";
import Women from "./user/Women";
import Men from "./user/Men";
import Laptops from "./user/Laptops";
import Toys from "./user/Toys";
import Register from "./global/Register.jsx";
import Admindashboard from "./global/Admindashboard.jsx";
import Userdahboard from "./user/Userdahboard.jsx";
import Mobiles from "./user/Mobiles.jsx";
import UploadCosmetics from '../components/global/UploadCosmetics.jsx';
import UploadElectronics from '../components/global/UploadElectronics.jsx';
import UploadFootwear from '../components/global/UploadFootwear.jsx';
import UploadGroceries from '../components/global/UploadGroceries.jsx';
import Uploadkids from '../components/global/UploadKids.jsx';
import UploadLaptop from '../components/global/UploadLaptop.jsx';
import UploadMen from '../components/global/UploadMen.jsx';
import UploadMobiles from '../components/global/UploadMobiles.jsx';
import UploadToys from '../components/global/UploadToys.jsx';
import UploadWomen from '../components/global/UploadWomen.jsx';
import Displaysinglecosmetic from "./user/Displaysinglecosmetic.jsx";
import Displaygrocery from "./user/Displaygrocery.jsx";
import Displayelectronics from "./user/Displayelectronics.jsx";
import Displayfootwear from "./user/Displayfootwear.jsx";
import Displaywomen from "./user/Displaywomen.jsx";
import Displaymen from "./user/Displaymen.jsx";
import Displaylaptops from "./user/Displaylaptops.jsx";
import Displaytoys from "./user/Displaytoys.jsx";
import Displaymobiles from "./user/Displaymobiles.jsx";
import Electronics1 from "./user/Electronics1.jsx";
import Grocery1 from "./user/Grocery1.jsx";
import Toys1 from "./user/Toys1.jsx";
import Cosmetics1 from "./user/Costmetics1.jsx";
import Footwear1 from "./user/Footwear1.jsx";
import Kids1 from "./user/Kids1.jsx";
import Women1 from "./user/Women1.jsx";
import Mobiles1 from "./user/Mobiles1.jsx";
import Men1 from "./user/Men1.jsx";
import Laptops1 from "./user/Laptops1.jsx";
import Displaykidswear from "./user/Displaykidswear.jsx";
import Invoice from "./Invoice.jsx";
import UserList from "./global/UserList.jsx";

const Master = () => {
  return (
    <CartProvider>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Box for vertical spacing */}
        <Box sx={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/userdashboard" element={<Userdahboard />} />
            <Route path="/admindashboard" element={<Admindashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/groceries" element={<Groceries />} />
            <Route path="/cosmetics" element={<Comsmetics />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/footwear" element={<Footwear />} />
            <Route path="/admindashboard/admin/uploadlaptops" element={<UploadLaptop />} />
            <Route path="/admindashboard/admin/uploadelectronics" element={<UploadElectronics />} />
            <Route path="/admindashboard/admin/uploadmobiles" element={<UploadMobiles />} />
            <Route path="/admindashboard/admin/uploadcosmetics" element={<UploadCosmetics />} />
            <Route path="/admindashboard/admin/uploadkids" element={<Uploadkids />} />
            <Route path="/admindashboard/admin/uploadmen" element={<UploadMen />} />
            <Route path="/admindashboard/admin/uploadwomen" element={<UploadWomen />} />
            <Route path="/admindashboard/admin/uploadfootwear" element={<UploadFootwear />} />
            <Route path="/admindashboard/admin/uploadgroceries" element={<UploadGroceries />} />
            <Route path="/admindashboard/admin/uploadtoys" element={<UploadToys />} />
            <Route path="/admindashboard/admin/users" element={<UserList />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/women" element={<Women />} />
            <Route path="/men" element={<Men />} />
            <Route path="/mobiles" element={<Mobiles />} />
            <Route path="/laptops" element={<Laptops />} />
            <Route path="/toys" element={<Toys />} />
            <Route path="/cosmeticsdetails" element={<Displaysinglecosmetic />} />
            <Route path="/grocerydetails" element={<Displaygrocery />} />
            <Route path="/electronicsdetails" element={<Displayelectronics />} />
            <Route path="/footweardetails" element={<Displayfootwear />} />
            <Route path="/kidsdetails" element={<Displaykidswear />} />
            <Route path="/womendetails" element={<Displaywomen />} />
            <Route path="/mendetails" element={<Displaymen />} />
            <Route path="/laptopsdetails" element={<Displaylaptops />} />
            <Route path="/toysdetails" element={<Displaytoys />} />
            <Route path="/mobiledetails" element={<Displaymobiles />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/electronics1" element={<Electronics1 />} />
            <Route path="/groceries1" element={<Grocery1 />} />
            <Route path="/toys1" element={<Toys1 />} />
            <Route path="/Cosmetics1" element={<Cosmetics1 />} />
            <Route path="/footwear1" element={<Footwear1 />} />
            <Route path="/kids1" element={<Kids1 />} />
            <Route path="/women1" element={<Women1 />} />
            <Route path="/men1" element={<Men1 />} />
            <Route path="/laptops1" element={<Laptops1 />} />
            <Route path="/mobiles1" element={<Mobiles1 />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
        </Box>
      </Container>
    </CartProvider>
  );
};

export default Master;
