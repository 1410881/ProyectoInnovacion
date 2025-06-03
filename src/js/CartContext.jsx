import React, { useEffect, useState, createContext, useContext } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    // Solo usuarios normales (no admin, asumiendo admin es id 1)
    if (token && userId && userId !== "1") {
      fetch("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.items) {
            setCartItems(data.items);
            localStorage.setItem("cart", JSON.stringify(data.items));
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Asegura que cada item tenga producto_id real
  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      // Verificar si ya existe un item similar en el carrito
      const existingItemIndex = prevItems.findIndex(item => {
        // Comparación básica para productos no personalizados
        if (!newItem.personalizacion && (item.producto_id || item.id) === (newItem.producto_id || newItem.id)) {
          return true;
        }
        // Comparación para productos personalizados
        if ((item.producto_id || item.id) === (newItem.producto_id || newItem.id) && newItem.personalizacion) {
          const itemPersonalizacion = JSON.stringify(item.personalizacion);
          const newPersonalizacion = JSON.stringify(newItem.personalizacion);
          return itemPersonalizacion === newPersonalizacion;
        }
        return false;
      });

      if (existingItemIndex >= 0) {
        // Si existe, actualizar la cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += newItem.cantidad;
        updatedItems[existingItemIndex].precioTotal =
          updatedItems[existingItemIndex].precioUnitario * updatedItems[existingItemIndex].cantidad;
        return updatedItems;
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, {
          ...newItem,
          producto_id: newItem.producto_id || newItem.id // asegura producto_id real
        }];
      }
    });
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? {
          ...item,
          cantidad: newQuantity,
          precioTotal: item.precioUnitario * newQuantity
        } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount: cartItems.reduce((sum, item) => sum + item.cantidad, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}