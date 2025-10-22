import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
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
import UploadCosmetics from '../components/global/UploadCosmetics.jsx'
import UploadElectronics from '../components/global/UploadElectronics.jsx'
import UploadFootwear from '../components/global/UploadFootwear.jsx'
import UploadGroceries from '../components/global/UploadGroceries.jsx'
import Uploadkids from '../components/global/UploadKids.jsx'
import UploadLaptop from '../components/global/UploadLaptop.jsx'
import UploadMen from '../components/global/UploadMen.jsx'
import UploadMobiles from '../components/global/UploadMobiles.jsx'
import UploadToys from '../components/global/UploadToys.jsx'
import UploadWomen from '../components/global/UploadWomen.jsx'
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
const Master=()=>{
    return(
        <>
         <CartProvider>
        <Routes><Route path="/" element={<Homepage></Homepage>}></Route>
        <Route path="/userdashboard" element={<Userdahboard></Userdahboard>}></Route>
        <Route path="/admindashboard" element={<Admindashboard></Admindashboard>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/groceries" element={<Groceries></Groceries>}></Route>
        <Route path="/cosmetics" element={<Comsmetics></Comsmetics>}></Route>
        <Route path="/electronics" element={<Electronics></Electronics>}></Route>
        <Route path="/footwear" element={<Footwear></Footwear>}>
           
        </Route>
        <Route path="/admindashboard/admin/uploadlaptops" element={<UploadLaptop></UploadLaptop>}></Route>
        <Route path="/admindashboard/admin/uploadelectronics" element={<UploadElectronics></UploadElectronics>}></Route>
        <Route path="/admindashboard/admin/uploadmobiles" element={<UploadMobiles></UploadMobiles>}></Route>
        <Route path="/admindashboard/admin/uploadcosmetics" element={<UploadCosmetics></UploadCosmetics>}></Route>
        <Route path="/admindashboard/admin/uploadkids" element={<Uploadkids></Uploadkids>}></Route>
        <Route path="/admindashboard/admin/uploadmen" element={<UploadMen></UploadMen>}></Route>
        <Route path="/admindashboard/admin/uploadwomen" element={<UploadWomen></UploadWomen>}></Route>
        <Route path="/admindashboard/admin/uploadfootwear" element={<UploadFootwear></UploadFootwear>}></Route>
        <Route path="/admindashboard/admin/uploadgroceries" element={<UploadGroceries></UploadGroceries>}></Route>
        <Route path="/admindashboard/admin/uploadtoys" element={<UploadToys></UploadToys>}></Route>
        <Route path="admindashboard/admin/users" element={<UserList></UserList>}></Route>
        <Route path="/kids" element={<Kids></Kids>}></Route>
        <Route path="/women" element={<Women></Women>}></Route>
        <Route path="/men" element={<Men></Men>}></Route>
        <Route path="/mobiles" element={<Mobiles></Mobiles>}></Route>
        <Route path="/laptops" element={<Laptops></Laptops>}></Route>
        <Route path="/toys" element={<Toys></Toys>}></Route>
        <Route path="/cosmeticsdetails" element={<Displaysinglecosmetic></Displaysinglecosmetic>}></Route>
        <Route path="/grocerydetails" element={<Displaygrocery></Displaygrocery>}></Route>
        <Route path="/electronicsdetails" element={<Displayelectronics></Displayelectronics>}></Route>
        <Route path="/footweardetails" element={<Displayfootwear></Displayfootwear>}></Route>
        <Route path="/kidsdetails" element={<Displaykidswear></Displaykidswear>}></Route>
        <Route path="/womendetails" element={<Displaywomen></Displaywomen>}></Route>
        <Route path="/mendetails" element={<Displaymen></Displaymen>}></Route>
        <Route path="/laptopsdetails" element={<Displaylaptops></Displaylaptops>}></Route>
        <Route path="/toysdetails" element={<Displaytoys></Displaytoys>}></Route>
        <Route path="/mobiledetails" element={<Displaymobiles></Displaymobiles>}></Route>
        <Route path="/cart" element={<Cart></Cart>}></Route>
        <Route path="/electronics1" element={<Electronics1></Electronics1>}></Route>
        <Route path="/groceries1" element={<Grocery1></Grocery1>}></Route>
        <Route path="/toys1" element={<Toys1></Toys1>}></Route>
        <Route path="/Cosmetics1" element={<Cosmetics1></Cosmetics1>}></Route>
        <Route path="/footwear1" element={<Footwear1></Footwear1>}></Route>
        <Route path="/kids1" element={<Kids1></Kids1>}></Route>
        <Route path="/women1" element={<Women1></Women1>}></Route>
        <Route path="/men1" element={<Men1></Men1>}></Route>
        <Route path="/laptops1" element={<Laptops1></Laptops1>}></Route>
        <Route path="/mobiles1" element={<Mobiles1></Mobiles1>} ></Route>
        <Route path="/invoice" element={<Invoice></Invoice>}></Route>
        </Routes>
        </CartProvider>
        </>
    )
}
export default Master;