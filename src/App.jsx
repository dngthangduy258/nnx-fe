import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import AdminNews from './pages/admin/AdminNews';
import AdminSlideshow from './pages/admin/AdminSlideshow';
import OrderTracking from './pages/shop/OrderTracking';
import Payment from './pages/shop/Payment';
import AdminLogin from './pages/admin/AdminLogin';
import CustomerLogin from './pages/shop/CustomerLogin';
import CustomerRegister from './pages/shop/CustomerRegister';
import Account from './pages/shop/Account';
import LookupOrder from './pages/shop/LookupOrder';
import NewsList from './pages/shop/NewsList';
import NewsDetail from './pages/shop/NewsDetail';
import SlideshowDetail from './pages/shop/SlideshowDetail';
import Contact from './pages/shop/Contact';

function App() {
    return (
        <HelmetProvider>
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
                        <Route path="/payment/:trackingId" element={<MainLayout><Payment /></MainLayout>} />
                        <Route path="/lookup-order" element={<MainLayout><LookupOrder /></MainLayout>} />
                        <Route path="/news" element={<MainLayout><NewsList /></MainLayout>} />
                        <Route path="/news/:id" element={<MainLayout><NewsDetail /></MainLayout>} />
                        <Route path="/slide/:id" element={<MainLayout><SlideshowDetail /></MainLayout>} />
                        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                        <Route path="/dang-nhap" element={<MainLayout><CustomerLogin /></MainLayout>} />
                        <Route path="/dang-ky" element={<MainLayout><CustomerRegister /></MainLayout>} />
                        <Route path="/account" element={<MainLayout><Account /></MainLayout>} />

                        {/* Admin Login - No Layout */}
                        <Route path="/login" element={<AdminLogin />} />

                        {/* Admin Routes with AdminLayout */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="tech" element={<AdminTech />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="news" element={<AdminNews />} />
                            <Route path="slideshows" element={<AdminSlideshow />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AppProvider>
        </HelmetProvider>
    );
}

export default App;
