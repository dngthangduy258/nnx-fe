import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBasket, ClipboardList, LogOut, Package, ArrowLeft, Menu, X, Layers, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { adminUser, isAdminAuthenticated, logout } = useApp();

    React.useEffect(() => {
        if (!isAdminAuthenticated || adminUser?.role !== 'admin') {
            navigate('/login');
        }
    }, [isAdminAuthenticated, adminUser, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { title: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
        { title: 'Danh mục', path: '/admin/categories', icon: Layers },
        { title: 'Sản phẩm', path: '/admin/products', icon: ShoppingBasket },
        { title: 'Đơn hàng', path: '/admin/orders', icon: ClipboardList },
        { title: 'Kỹ thuật', path: '/admin/tech', icon: Database },
    ];

    return (
        <div className="admin-layout flex min-h-screen bg-gray-100 relative">
            {/* Sidebar Overlay (Mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed md:sticky inset-y-0 left-0 z-[101] transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-primary-dark tracking-tight">AgroAdmin</h1>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Management</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden mt-4 w-full flex items-center justify-center gap-2 text-xs text-gray-400 py-2 border border-dashed border-gray-200 rounded-lg"
                    >
                        <X className="w-4 h-4" /> Đóng menu
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors hidden sm:block">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-base md:text-xl font-bold text-gray-800 line-clamp-1">Nông Nghiệp Xanh</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-[10px] md:text-xs">AD</div>
                        <span className="text-[10px] md:text-sm font-bold text-gray-700 hidden xs:block">{adminUser?.username || 'Admin'}</span>
                    </div>
                </header>

                <div className="p-4 md:p-10">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;
