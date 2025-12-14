import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
    sweetId: {
        _id: string;
        name: string;
        price: number;
        image?: string;
    };
    quantity: number;
    _id: string; // Item ID in cart array
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (sweetId: string, quantity: number) => Promise<void>;
    removeFromCart: (sweetId: string) => Promise<void>;
    refreshCart: () => void;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    const refreshCart = async () => {
        try {
            const res = await api.get('/cart');
            if (res.data && res.data.items) {
                setCartItems(res.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    };

    const addToCart = async (sweetId: string, quantity: number) => {
        try {
            await api.post('/cart', { sweetId, quantity });
            await refreshCart();
        } catch (error) {
            console.error('Failed to update cart', error);
            throw error;
        }
    };

    const removeFromCart = async (sweetId: string) => {
        try {
            await api.delete(`/cart/${sweetId}`);
            await refreshCart();
        } catch (error) {
            console.error('Failed to remove from cart', error);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + (item.sweetId.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, refreshCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
