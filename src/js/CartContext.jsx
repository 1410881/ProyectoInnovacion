import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      // Verificar si ya existe un item similar en el carrito
      const existingItemIndex = prevItems.findIndex(item => {
        // Comparación básica para productos no personalizados
        if (!newItem.personalizacion && item.id === newItem.id) {
          return true;
        }
        
        // Comparación para productos personalizados
        if (item.id === newItem.id && newItem.personalizacion) {
          // Convertir personalizaciones a string para comparar
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
        return [...prevItems, newItem];
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