import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Use environment variable for production, fallback to local for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787/api';

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('agro_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState([]);

    const fetchData = async (options = {}) => {
        try {
            setLoading(true);
            const { category = 'all', search = '' } = options;

            let productsUrl = `${API_BASE_URL}/products`;
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (search) params.append('search', search);

            const queryString = params.toString();
            if (queryString) productsUrl += `?${queryString}`;

            const [productsRes, categoriesRes] = await Promise.all([
                fetch(productsUrl),
                fetch(`${API_BASE_URL}/categories`)
            ]);

            if (!productsRes.ok || !categoriesRes.ok) {
                throw new Error('Failed to fetch data from API');
            }

            const [productsData, categoriesData] = await Promise.all([
                productsRes.json(),
                categoriesRes.json()
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/orders`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('agro_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    const checkout = async (customerInfo) => {
        // Validation
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            throw new Error('Vui lòng điền đầy đủ thông tin nhận hàng');
        }

        if (!/^[0-9]{10,11}$/.test(customerInfo.phone)) {
            throw new Error('Số điện thoại không hợp lệ');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerInfo.name,
                    phone: customerInfo.phone,
                    address: customerInfo.address,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                })
            });

            if (!response.ok) throw new Error('Failed to create order');

            const data = await response.json();

            setCart([]);
            // Note: Guest orders are not stored in local state anymore, 
            // but returned for immediate success page display.
            return {
                id: data.orderId,
                trackingId: data.trackingId
            };
        } catch (err) {
            console.error('Checkout error:', err);
            throw err;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) throw new Error('Invalid credentials');

            const data = await response.json();
            localStorage.setItem('nnx_user', JSON.stringify(data.user));
            return data.user;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    // Admin Product CRUD
    const addProduct = async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (response.ok) fetchData();
        } catch (e) {
            console.error('Error adding product:', e);
        }
    };

    const updateProduct = async (updatedProduct) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            if (response.ok) fetchData();
        } catch (e) {
            console.error('Error updating product:', e);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchData();
        } catch (e) {
            console.error('Error deleting product:', e);
        }
    };

    const updateOrderStatus = async (orderId, status, note) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, note })
            });
            if (response.ok) fetchOrders();
        } catch (e) {
            console.error('Error updating order status:', e);
        }
    };

    return (
        <AppContext.Provider value={{
            products,
            categories,
            loading,
            error,
            cart,
            orders,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            checkout,
            addProduct,
            updateProduct,
            deleteProduct,
            login,
            fetchOrders,
            updateOrderStatus,
            fetchData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
};
