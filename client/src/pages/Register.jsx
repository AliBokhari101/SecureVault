import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black cyber-grid-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
            <div className="scanline-effect absolute inset-0 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-6 sm:mb-8">
                    <Link to="/" className="inline-block">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyber-red-500 border-2 border-cyber-red-600 flex items-center justify-center relative">
                                <div className="corner-accent"></div>
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <span className="text-2xl sm:text-3xl font-display font-black text-cyber-white uppercase tracking-widest">
                                SECUREVAULT
                            </span>
                        </div>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-cyber font-bold text-cyber-red-500 uppercase tracking-wide neon-text mb-2">
                        SYSTEM REGISTRATION
                    </h1>
                    <p className="font-mono text-cyber-offwhite text-xs sm:text-sm">
                        <span className="text-cyber-red-500">[CREATE NEW ACCOUNT]</span>
                    </p>
                </div>

                {/* Form */}
                <div className="neon-card p-6 sm:p-8 relative">
                    <div className="corner-accent"></div>

                    {error && (
                        <div className="bg-cyber-red-900 border-2 border-cyber-red-500 text-cyber-red-100 px-4 py-3 mb-6 font-mono text-xs sm:text-sm">
                            <span className="font-bold">[ERROR]</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-cyber font-bold text-cyber-white uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">NAME</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-cyber text-sm sm:text-base"
                                placeholder="JOHN DOE"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-cyber font-bold text-cyber-white uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">EMAIL</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-cyber text-sm sm:text-base"
                                placeholder="user@securevault.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-cyber font-bold text-cyber-white uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">PASSWORD</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-cyber text-sm sm:text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-cyber font-bold text-cyber-white uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">CONFIRM PASSWORD</span>
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="input-cyber text-sm sm:text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {loading ? '[INITIALIZING...]' : '[INITIALIZE ACCOUNT]'}
                        </button>
                    </form>

                    <div className="mt-4 sm:mt-6 text-center">
                        <p className="font-mono text-cyber-offwhite text-xs sm:text-sm">
                            ALREADY REGISTERED? {' '}
                            <Link to="/login" className="text-cyber-red-500 font-bold hover:underline">
                                [LOGIN]
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-4 sm:mt-6 text-center">
                    <Link to="/" className="font-mono text-cyber-offwhite text-xs sm:text-sm hover:text-cyber-red-500 transition-colors">
                        ← BACK TO HOME
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
