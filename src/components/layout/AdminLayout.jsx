import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBasket, ClipboardList, LogOut, Package, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('nnx_user'));

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('nnx_user');
        navigate('/login');
    };

    const menuItems = [
        { title: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
        { title: 'Sản phẩm', path: '/admin/products', icon: ShoppingBasket },
        { title: 'Đơn hàng', path: '/admin/orders', icon: ClipboardList },
    ];

    return (
        <div className="admin-layout flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0">
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
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 px-10 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-bold text-gray-800">Cửa hàng Nông Nghiệp Xanh</h2>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">AD</div>
                        <span className="text-sm font-bold text-gray-700">Quản trị viên</span>
                    </div>
                </header>

                <div className="p-10">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;
