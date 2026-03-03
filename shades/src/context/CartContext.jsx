import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(() => {
        // Use user-specific key if logged in, otherwise use default
        const userId = user?.uid || localStorage.getItem('user_uid');
        const key = userId ? `cart_${userId}` : 'shades-cart';
        const savedCart = localStorage.getItem(key);
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        const key = userId ? `wishlist_${userId}` : 'shades-wishlist';
        const savedWishlist = localStorage.getItem(key);
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [isSyncing, setIsSyncing] = useState(false);

    // Save user_uid to localStorage when user logs in
    useEffect(() => {
        if (user?.uid) {
            localStorage.setItem('user_uid', user.uid);
        }
    }, [user]);

    // Save to localStorage always
    useEffect(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        const key = userId ? `cart_${userId}` : 'shades-cart';
        localStorage.setItem(key, JSON.stringify(cart));
    }, [cart, user]);

    useEffect(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        const key = userId ? `wishlist_${userId}` : 'shades-wishlist';
        localStorage.setItem(key, JSON.stringify(wishlist));
    }, [wishlist, user]);

    // Fetch cart from Supabase when user logs in
    useEffect(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        if (userId) {
            fetchCloudCart(userId);
            fetchCloudWishlist(userId);
        }
    }, [user?.uid]);

    const fetchCloudCart = async (userId) => {
        if (!userId) return;
        setIsSyncing(true);
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching cloud cart:', error);
                return;
            }

            if (data && data.length > 0) {
                // Merge cloud cart with local cart (local takes priority for duplicates)
                const cloudCart = data.map(item => ({
                    id: item.product_id,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    image: item.image,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity
                }));

                setCart(prevCart => {
                    const mergedCart = [...cloudCart];
                    // Add local-only items
                    prevCart.forEach(localItem => {
                        const exists = mergedCart.find(
                            cloudItem => cloudItem.id === localItem.id &&
                                cloudItem.color === localItem.color &&
                                cloudItem.size === localItem.size
                        );
                        if (!exists) {
                            mergedCart.push(localItem);
                        }
                    });
                    return mergedCart;
                });
            }
        } catch (err) {
            console.error('Error fetching cloud cart:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchCloudWishlist = async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching cloud wishlist:', error);
                return;
            }

            if (data && data.length > 0) {
                const cloudWishlist = data.map(item => ({
                    id: item.product_id,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    images: [item.image]
                }));

                setWishlist(prevWishlist => {
                    const merged = [...cloudWishlist];
                    prevWishlist.forEach(localItem => {
                        if (!merged.find(w => w.id === localItem.id)) {
                            merged.push(localItem);
                        }
                    });
                    return merged;
                });
            }
        } catch (err) {
            console.error('Error fetching cloud wishlist:', err);
        }
    };

    // Sync cart to Supabase when it changes (for logged in users)
    useEffect(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        if (userId && !isSyncing) {
            syncCartToCloud(userId);
        }
    }, [cart, user, isSyncing]);

    // Sync wishlist to Supabase when it changes (for logged in users)
    useEffect(() => {
        const userId = user?.uid || localStorage.getItem('user_uid');
        if (userId && !isSyncing) {
            syncWishlistToCloud(userId);
        }
    }, [wishlist, user, isSyncing]);

    const syncCartToCloud = async (userId) => {
        if (!userId) return;
        try {
            // Clear existing cart items for this user and re-insert
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId);

            if (cart.length > 0) {
                const cartItems = cart.map(item => ({
                    user_id: userId,
                    product_id: item.id,
                    name: item.name,
                    brand: item.brand || '',
                    price: item.price,
                    image: item.image || '',
                    color: item.color || '',
                    size: item.size || '',
                    quantity: item.quantity
                }));

                const { error } = await supabase
                    .from('cart_items')
                    .insert(cartItems);

                if (error) {
                    console.error('Error syncing cart to cloud:', error);
                }
            }
        } catch (err) {
            console.error('Error syncing cart to cloud:', err);
        }
    };

    const syncWishlistToCloud = async (userId) => {
        if (!userId) return;
        try {
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', userId);

            if (wishlist.length > 0) {
                const wishlistItems = wishlist.map(item => ({
                    user_id: userId,
                    product_id: item.id,
                    name: item.name,
                    brand: item.brand || '',
                    price: item.price,
                    image: item.images?.[0] || ''
                }));

                const { error } = await supabase
                    .from('wishlist_items')
                    .insert(wishlistItems);

                if (error) {
                    console.error('Error syncing wishlist to cloud:', error);
                }
            }
        } catch (err) {
            console.error('Error syncing wishlist to cloud:', err);
        }
    };

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
                image: product.images?.[0] || product.image,
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
