import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-bg-main">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            {/* Footer could go here in the future */}
            <footer className="bg-primary-dark text-white/60 py-12 border-t border-white/5 mt-auto">
                <div className="container text-center">
                    <p className="text-sm font-bold tracking-widest uppercase">© 2026 NNX AGRO ECO-SOLUTIONS</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
