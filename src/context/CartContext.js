import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, size) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item => item.id === product.id && item.size === size
            );

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevItems, {
                ...product,
                size,
                quantity: 1,
                // Ensure we handle price strings if they come as '₹12,999'
                priceNum: typeof product.price === 'string'
                    ? parseInt(product.price.replace(/[^0-9]/g, ''))
                    : product.price
            }];
        });
    };

    const removeFromCart = (id, size) => {
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === id && item.size === size))
        );
    };

    const updateQuantity = (id, size, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id && item.size === size) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
