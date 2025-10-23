import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CssBaseline,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const adminLinks = [
  { text: "Laptops", to: "admin/uploadlaptops" },
  { text: "Electronics", to: "admin/uploadelectronics" },
  { text: "Mobiles", to: "admin/uploadmobiles" },
  { text: "Cosmetics", to: "admin/uploadcosmetics" },
  { text: "Kids", to: "admin/uploadkids" },
  { text: "Men", to: "admin/uploadmen" },
  { text: "Women", to: "admin/uploadwomen" },
  { text: "Footwear", to: "admin/uploadfootwear" },
  { text: "Groceries", to: "admin/uploadgroceries" },
  { text: "Toys", to: "admin/uploadtoys" },
  { text: "Manage Users", to: "admin/users" },
  { text: "Logout", to: "/" },
];

const Admindashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
          ADMIN DASHBOARD
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {adminLinks.map(({ text, to }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={to}
              sx={{
                "&.MuiListItemButton-root:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                color: text === "Logout" ? theme.palette.error.main : "inherit",
                fontWeight: text === "Logout" ? "bold" : "normal",
              }}
              onClick={() => isSmUp || setMobileOpen(false)} // Close drawer on mobile after clicking
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar only shows on mobile to toggle drawer */}
      {!isSmUp && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* The actual sidebar drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile Drawer */}
        {!isSmUp && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Better performance on mobile
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Permanent drawer on desktop */}
        {isSmUp && (
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main content placeholder */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: !isSmUp ? "64px" : 0, // account for appbar height on mobile
        }}
      >
        <Typography paragraph>
          {/* Your admin main content goes here */}
          Welcome to the Admin Dashboard!
        </Typography>
      </Box>
    </Box>
  );
};

export default Admindashboard;
