import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import App from './App.jsx'
import Master from './components/Master'
import ReactDOM from 'react-dom/client'; 
import UploadCosmetics from './components/global/UploadCosmetics.jsx'
import { BrowserRouter } from 'react-router-dom'; 
import { CartProvider } from './components/context/CartContext.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <CartProvider>
      <Master />
    </CartProvider>
  </BrowserRouter>
);
