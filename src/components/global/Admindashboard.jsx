
import { Link } from "react-router-dom";

import "./Admin.css";

const Admindashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <h1 className="admin-header">ADMIN DASHBOARD</h1>
        <ul className="admin-links">
          <li><Link to="admin/uploadlaptops" className="admin-link">Laptops</Link></li>
          <li><Link to="admin/uploadelectronics" className="admin-link">Electronics</Link></li>
          <li><Link to="admin/uploadmobiles" className="admin-link">Mobiles</Link></li>
          <li><Link to="admin/uploadcosmetics" className="admin-link">Cosmetics</Link></li>
          <li><Link to="admin/uploadkids" className="admin-link">Kids</Link></li>
          <li><Link to="admin/uploadmen" className="admin-link">Men</Link></li>
          <li><Link to="admin/uploadwomen" className="admin-link">Women</Link></li>
          <li><Link to="admin/uploadfootwear" className="admin-link">Footwear</Link></li>
          <li><Link to="admin/uploadgroceries" className="admin-link">Groceries</Link></li>
          <li><Link to="admin/uploadtoys" className="admin-link">Toys</Link></li>
          <li><Link to="admin/users" className="admin-link">Manage Users</Link></li>
          <li><Link to="/" className="admin-link logout">Logout</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Admindashboard;
