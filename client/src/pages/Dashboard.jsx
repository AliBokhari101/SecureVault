import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const [stats, setStats] = useState({ totalFiles: 0, storageUsed: 0, recentUploads: 0 });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [filesRes] = await Promise.all([
                api.get('/files')
            ]);

            const files = filesRes.data.files || [];
            const totalSize = files.reduce((sum, file) => sum + file.file_size, 0);
            const recent = files.filter(f => {
                const uploadDate = new Date(f.uploaded_at);
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return uploadDate > dayAgo;
            }).length;

            setStats({
                totalFiles: files.length,
                storageUsed: totalSize,
                recentUploads: recent
            });

            setActivities(files.slice(0, 5).map(f => ({
                action: 'FILE_UPLOAD',
                file: f.file_name,
                time: f.uploaded_at
            })));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-cyber-black cyber-grid-bg">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-cyber-darkgray border-r-2 border-cyber-red-500 p-6 z-10">
                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-cyber-red-500 border-2 border-cyber-red-700 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <span className="text-xl font-display font-black text-white uppercase tracking-wider">
                        VAULT
                    </span>
                </div>

                <nav className="space-y-2">
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-cyber-red-500 text-white font-cyber font-bold border-2 border-cyber-red-700 uppercase tracking-wide">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>DASHBOARD</span>
                    </Link>

                    <Link to="/files" className="flex items-center space-x-3 px-4 py-3 text-white font-cyber font-bold hover:bg-cyber-gray border-2 border-transparent hover:border-cyber-red-500 uppercase tracking-wide transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>FILES</span>
                    </Link>

                    {isAdmin && (
                        <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 text-white font-cyber font-bold hover:bg-cyber-gray border-2 border-transparent hover:border-cyber-red-500 uppercase tracking-wide transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>ADMIN</span>
                        </Link>
                    )}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="neon-card p-4 mb-4">
                        <p className="text-xs font-mono text-gray-400 uppercase">USER:</p>
                        <p className="font-cyber font-bold text-white truncate">{user?.email}</p>
                    </div>
                    <button onClick={logout} className="w-full btn-cyber-secondary text-sm py-2">
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-8">
                        <h1 className="text-5xl font-display font-black text-white uppercase tracking-wider mb-2">
                            <span className="cyber-bracket">DASHBOARD</span>
                        </h1>
                        <p className="font-mono text-gray-400">
                            <span className="text-cyber-red-500">[SYSTEM STATUS: ACTIVE]</span>
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="stat-card-cyber"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-cyber-red-500 border-2 border-cyber-red-700 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-4xl font-display font-black text-cyber-red-500">{stats.totalFiles}</span>
                            </div>
                            <p className="font-cyber font-bold text-white uppercase tracking-wide">TOTAL FILES</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="stat-card-cyber"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-cyber-red-500 border-2 border-cyber-red-700 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-display font-black text-cyber-red-500">{formatBytes(stats.storageUsed)}</span>
                            </div>
                            <p className="font-cyber font-bold text-white uppercase tracking-wide">STORAGE USED</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="stat-card-cyber"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-cyber-red-500 border-2 border-cyber-red-700 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <span className="text-4xl font-display font-black text-cyber-red-500">{stats.recentUploads}</span>
                            </div>
                            <p className="font-cyber font-bold text-white uppercase tracking-wide">RECENT (24H)</p>
                        </motion.div>
                    </div>

                    {/* Activity Log */}
                    <div className="neon-card p-6">
                        <h2 className="text-2xl font-cyber font-bold text-white uppercase tracking-wide mb-6">
                            <span className="cyber-bracket">ACTIVITY LOG</span>
                        </h2>
                        <div className="space-y-3">
                            {activities.length > 0 ? (
                                activities.map((activity, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b-2 border-cyber-gray last:border-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-cyber-red-500 animate-neon-pulse"></div>
                                            <div>
                                                <p className="font-cyber font-bold text-white uppercase text-sm">{activity.action}</p>
                                                <p className="font-mono text-gray-400 text-xs">{activity.file}</p>
                                            </div>
                                        </div>
                                        <p className="font-mono text-gray-400 text-xs">
                                            {new Date(activity.time).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="font-mono text-gray-400 text-center py-8">
                                    [NO RECENT ACTIVITY]
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
