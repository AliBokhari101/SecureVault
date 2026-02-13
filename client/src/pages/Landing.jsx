import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cyber-black cyber-grid-bg relative overflow-hidden">
            {/* Scanline effect overlay */}
            <div className="scanline-effect absolute inset-0 pointer-events-none"></div>

            {/* Header */}
            <nav className="border-b-2 border-cyber-red-500 bg-cyber-darkgray relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyber-red-500 border-2 border-cyber-red-600 flex items-center justify-center relative">
                            <div className="corner-accent"></div>
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-lg sm:text-2xl font-display font-black text-cyber-white uppercase tracking-widest">
                            SECUREVAULT
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex space-x-4">
                        <Link to="/login" className="btn-cyber-secondary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                            LOGIN
                        </Link>
                        <Link to="/register" className="btn-cyber-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                            REGISTER
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden p-2 text-cyber-red-500 border-2 border-cyber-red-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t-2 border-cyber-red-500 bg-cyber-gray p-4 space-y-2">
                        <Link to="/login" className="block btn-cyber-secondary text-center w-full">
                            LOGIN
                        </Link>
                        <Link to="/register" className="block btn-cyber-primary text-center w-full">
                            REGISTER
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block mb-4 sm:mb-6">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-cyber-white uppercase tracking-wider mb-2">
                            ENCRYPTED
                        </h1>
                        <div className="h-1 bg-cyber-red-500"></div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-cyber font-bold text-cyber-red-500 uppercase tracking-wide mb-4 sm:mb-6 neon-text">
                        FILE SHARING
                    </h2>

                    <p className="text-sm sm:text-lg md:text-xl font-mono text-cyber-offwhite max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
                        <span className="text-cyber-red-500 font-bold">[SYSTEM ACTIVE]</span> Military-grade AES-256 encryption.
                        Zero-knowledge architecture. Maximum security protocol enabled.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
                        <Link to="/register" className="btn-cyber-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto">
                            INITIALIZE SYSTEM
                        </Link>
                        <Link to="/login" className="btn-cyber-secondary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto">
                            ACCESS TERMINAL
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="cyber-card p-4 sm:p-6"
                        >
                            <div className="text-3xl sm:text-4xl font-display font-black text-cyber-red-500 mb-2">256-BIT</div>
                            <div className="text-xs sm:text-sm font-mono text-cyber-offwhite uppercase tracking-wider">ENCRYPTION</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="cyber-card p-4 sm:p-6"
                        >
                            <div className="text-3xl sm:text-4xl font-display font-black text-cyber-red-500 mb-2">ZERO</div>
                            <div className="text-xs sm:text-sm font-mono text-cyber-offwhite uppercase tracking-wider">KNOWLEDGE</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="cyber-card p-4 sm:p-6"
                        >
                            <div className="text-3xl sm:text-4xl font-display font-black text-cyber-red-500 mb-2">100%</div>
                            <div className="text-xs sm:text-sm font-mono text-cyber-offwhite uppercase tracking-wider">SECURE</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-cyber-white uppercase text-center mb-8 sm:mb-12 tracking-wider">
                    <span className="cyber-bracket">SYSTEM FEATURES</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            ),
                            title: 'AES-256',
                            desc: 'Military-grade encryption protocol'
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            ),
                            title: 'SECURE SHARE',
                            desc: 'Password-protected links'
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            ),
                            title: 'AUDIT LOG',
                            desc: 'Complete activity tracking'
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            ),
                            title: 'INSTANT',
                            desc: 'Real-time file processing'
                        },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="neon-card p-4 sm:p-6 hover:shadow-neon-red transition-all duration-300"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyber-red-500 border-2 border-cyber-red-600 flex items-center justify-center text-cyber-white mb-3 sm:mb-4">
                                {feature.icon}
                            </div>
                            <h4 className="text-lg sm:text-xl font-cyber font-bold text-cyber-white uppercase mb-2 tracking-wide">
                                {feature.title}
                            </h4>
                            <p className="text-xs sm:text-sm font-mono text-cyber-offwhite">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
                <div className="neon-card p-8 sm:p-12 relative">
                    <div className="corner-accent"></div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-cyber-white uppercase mb-4 tracking-wider">
                        READY TO SECURE YOUR DATA?
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-mono text-cyber-offwhite mb-6 sm:mb-8">
                        Join the next generation of encrypted file sharing
                    </p>
                    <Link to="/register" className="btn-cyber-primary text-base sm:text-lg px-10 sm:px-12 py-3 sm:py-4 inline-block">
                        START NOW
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t-2 border-cyber-red-500 bg-cyber-darkgray py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <p className="font-mono text-cyber-offwhite text-xs sm:text-sm">
                        <span className="text-cyber-red-500 font-bold">[SECUREVAULT v1.0]</span> © 2026 - MAXIMUM SECURITY PROTOCOL
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
