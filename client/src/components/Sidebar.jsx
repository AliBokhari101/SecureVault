import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        {
            path: '/dashboard',
            label: 'DASHBOARD',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            path: '/files',
            label: 'FILES',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            )
        },
        ...(isAdmin ? [{
            path: '/admin',
            label: 'ADMIN',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }] : [])
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-cyber-red-500 border-2 border-cyber-red-600 text-cyber-white"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-cyber-darkgray border-r-2 border-cyber-red-500 p-6 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Close button for mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden absolute top-4 right-4 text-cyber-red-500"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-cyber-red-500 border-2 border-cyber-red-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <span className="text-xl font-display font-black text-cyber-white uppercase tracking-wider">
                        VAULT
                    </span>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 font-cyber font-bold border-2 uppercase tracking-wide transition-all ${location.pathname === item.path
                                    ? 'bg-cyber-red-500 text-cyber-white border-cyber-red-600'
                                    : 'text-cyber-white hover:bg-cyber-gray border-transparent hover:border-cyber-red-500'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="neon-card p-4 mb-4">
                        <p className="text-xs font-mono text-cyber-offwhite uppercase">USER:</p>
                        <p className="font-cyber font-bold text-cyber-white truncate text-sm">{user?.email}</p>
                        {isAdmin && (
                            <span className="inline-block mt-2 px-2 py-1 bg-cyber-red-500 text-cyber-white text-xs font-cyber font-bold uppercase">
                                ADMIN
                            </span>
                        )}
                    </div>
                    <button onClick={logout} className="w-full btn-cyber-secondary text-sm py-2">
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-cyber-black/80 z-30"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
