import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const { cartItems, orderId, paymentId, total, paymentStatus, isDemo } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate("/cart");
      return;
    }

    if (isDemo) {
      setOrderDetails({
        orderId,
        status: "COMPLETED",
        paymentStatus: "DEMO_SUCCESS",
        total: total,
        items: cartItems || [],
        createdAt: new Date().toISOString(),
      });
      return;
    }

    setOrderDetails({
      orderId,
      paymentId,
      status: "COMPLETED",
      paymentStatus: paymentStatus || "SUCCESS",
      total: total,
      items: cartItems || [],
      createdAt: new Date().toISOString(),
    });
  }, [location.state, navigate, orderId, paymentId, total, paymentStatus, isDemo, cartItems]);

  const handleDownload = () => {
    const invoiceContent = `
      INVOICE
      Order ID: ${orderDetails?.orderId}
      Date: ${new Date(orderDetails?.createdAt).toLocaleDateString()}
      Status: ${orderDetails?.paymentStatus}
      
      ITEMS:
      ${orderDetails?.items.map(item => {
        const product = item.menClothing || item.womenClothing || item.kidsClothing || 
                        item.grocery || item.cosmetics || item.footwear || 
                        item.electronics || item.laptops || item.mobiles || item.toys || item;
        return `${product?.name || 'Product'} - ₹${product?.price || item.price} x ${item.qty || item.quantity || 1}`;
      }).join('\n      ')}
      
      TOTAL: ₹${orderDetails?.total}
      
      Thank you for your purchase!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${orderDetails?.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!orderDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography>Loading invoice...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            INVOICE
          </Typography>
          <Chip 
            label={isDemo ? "DEMO ORDER" : "PAID"} 
            color={isDemo ? "secondary" : "success"} 
            variant="outlined"
          />
        </Box>

        {/* Order Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography><strong>Order ID:</strong> {orderDetails.orderId}</Typography>
            {orderDetails.paymentId && (
              <Typography><strong>Payment ID:</strong> {orderDetails.paymentId}</Typography>
            )}
            <Typography><strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</Typography>
            <Typography><strong>Status:</strong> {orderDetails.paymentStatus}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items Table */}
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((item, index) => {
                const product = item.menClothing || item.womenClothing || item.kidsClothing || 
                              item.grocery || item.cosmetics || item.footwear || 
                              item.electronics || item.laptops || item.mobiles || item.toys || item;
                const price = product?.price || item.price || 0;
                const quantity = item.qty || item.quantity || 1;
                const itemTotal = price * quantity;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product?.name || "Product"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">₹{price}</TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                    <TableCell align="right">₹{itemTotal}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography variant="h5" fontWeight="bold">
            Total: ₹{orderDetails.total}
          </Typography>
          {isDemo && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              * This is a demo order for testing purposes
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            size="large"
          >
            Download Invoice
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/userdashboard")}
            size="large"
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Invoice;