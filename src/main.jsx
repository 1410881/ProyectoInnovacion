import './index.css';
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { StrictMode } from 'react';
import { CartProvider } from './js/CartContext';
import ReactDOM from 'react-dom/client';

import AppRoutes from './router/AppRoutes';

/*const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />
  },
  {
    path: "/paginainicial",
    element: <PaginaPrincipal />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/carrito",
    element: <CarritoCompras />,
  },
  
  {
    path: "/cajas",
    element: <ProductoPage />,
 
  }
]);



*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);