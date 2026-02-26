import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/shop/Home';
import ProductList from './pages/shop/ProductList';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminTech from './pages/admin/AdminTech';
import AdminOrders from './pages/admin/AdminOrders';
import OrderTracking from './pages/shop/OrderTracking';
import AdminLogin from './pages/admin/AdminLogin';
import LookupOrder from './pages/shop/LookupOrder';

function App() {
    return (
        <AppProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollToTop />
                <div className="app-container">
                    <Routes>
                        {/* Shop Routes with MainLayout */}
                        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                        <Route path="/products" element={<MainLayout><ProductList /></MainLayout>} />
                        <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
                        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
                        <Route path="/tracking/:trackingId" element={<MainLayout><OrderTracking /></MainLayout>} />
                        <Route path="/lookup-order" element={<MainLayout><LookupOrder /></MainLayout>} />

                        {/* Login - No Layout */}
                        <Route path="/login" element={<AdminLogin />} />

                        {/* Admin Routes with AdminLayout */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="tech" element={<AdminTech />} />
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
