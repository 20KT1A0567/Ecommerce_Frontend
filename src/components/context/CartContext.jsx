import React, { createContext, useState, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from "@mui/material";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const CartProvider = ({ children }) => {
  const [data, setData] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartContext.Provider value={{ data, setData }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
          {/* Box provides padding and responsive spacing */}
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {children}
          </Box>
        </Container>
      </CartContext.Provider>
    </ThemeProvider>
  );
};
