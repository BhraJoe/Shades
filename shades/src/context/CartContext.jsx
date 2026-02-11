import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('shades-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('shades-wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('shades-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('shades-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product, color, size, quantity = 1) => {
        // Normalize color and size to strings for comparison
        const normalizedColor = typeof color === 'object' ? (color.name || color.value) : color;
        const normalizedSize = typeof size === 'object' ? (size.name || size.value) : size;

        setCart(prevCart => {
            // Find existing item with normalized comparisons
            const existingItemIndex = prevCart.findIndex(
                item => {
                    const itemColor = typeof item.color === 'object' ? (item.color.name || item.color.value) : item.color;
                    const itemSize = typeof item.size === 'object' ? (item.size.name || item.size.value) : item.size;
                    return item.id === product.id && itemColor === normalizedColor && itemSize === normalizedSize;
                }
            );

            if (existingItemIndex > -1) {
                // Item exists - increment quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + quantity
                };
                return updatedCart;
            }

            // New item - add with quantity 1
            return [...prevCart, {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images[0],
                color: normalizedColor,
                size: normalizedSize,
                quantity: 1
            }];
        });
    };

    const removeFromCart = (id, color, size) => {
        setCart(prevCart => prevCart.filter(
            item => !(item.id === id && item.color === color && item.size === size)
        ));
    };

    const updateQuantity = (id, color, size, quantity) => {
        if (quantity < 1) {
            removeFromCart(id, color, size);
            return;
        }

        setCart(prevCart => prevCart.map(
            item => (item.id === id && item.color === color && item.size === size)
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const addToWishlist = (product) => {
        setWishlist(prevWishlist => {
            if (prevWishlist.some(item => item.id === product.id)) {
                return prevWishlist.filter(item => item.id !== product.id);
            }
            return [...prevWishlist, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
