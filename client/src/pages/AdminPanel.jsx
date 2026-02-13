import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, filesRes, logsRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/files'),
                api.get('/admin/logs?limit=50'),
                api.get('/admin/stats')
            ]);

            setUsers(usersRes.data.users);
            setFiles(filesRes.data.files);
            setLogs(logsRes.data.logs);
            setStats(statsRes.data.stats);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cyber-black">
                <div className="w-12 h-12 border-4 border-cyber-red-500 border-t-transparent animate-spin"></div>
            </div>
        );
    }

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
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-white font-cyber font-bold hover:bg-cyber-gray border-2 border-transparent hover:border-cyber-red-500 uppercase tracking-wide transition-all">
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

                    <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 bg-cyber-red-500 text-white font-cyber font-bold border-2 border-cyber-red-700 uppercase tracking-wide">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>ADMIN</span>
                    </Link>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="neon-card p-4 mb-4">
                        <p className="text-xs font-mono text-gray-400 uppercase">ADMIN:</p>
                        <p className="font-cyber font-bold text-white truncate">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-cyber-red-500 text-white text-xs font-cyber font-bold uppercase">
                            ADMIN
                        </span>
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
                    <h1 className="text-5xl font-display font-black text-white uppercase tracking-wider mb-2">
                        <span className="cyber-bracket">ADMIN PANEL</span>
                    </h1>
                    <p className="font-mono text-gray-400 mb-8">
                        <span className="text-cyber-red-500">[SYSTEM CONTROL]</span>
                    </p>

                    {/* System Stats */}
                    {stats && (
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <div className="cyber-card p-6">
                                <p className="font-mono text-gray-400 text-sm uppercase mb-1">TOTAL USERS</p>
                                <p className="text-4xl font-display font-black text-cyber-red-500">{stats.totalUsers}</p>
                            </div>
                            <div className="cyber-card p-6">
                                <p className="font-mono text-gray-400 text-sm uppercase mb-1">TOTAL FILES</p>
                                <p className="text-4xl font-display font-black text-cyber-red-500">{stats.totalFiles}</p>
                            </div>
                            <div className="cyber-card p-6">
                                <p className="font-mono text-gray-400 text-sm uppercase mb-1">STORAGE</p>
                                <p className="text-2xl font-display font-black text-cyber-red-500">{formatBytes(stats.totalStorage)}</p>
                            </div>
                            <div className="cyber-card p-6">
                                <p className="font-mono text-gray-400 text-sm uppercase mb-1">ACTIVITY (24H)</p>
                                <p className="text-4xl font-display font-black text-cyber-red-500">{stats.recentActivity}</p>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="neon-card">
                        <div className="border-b-2 border-cyber-red-700 px-6">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`py-4 border-b-4 transition-all font-cyber font-bold uppercase tracking-wide ${activeTab === 'users'
                                        ? 'border-cyber-red-500 text-cyber-red-500'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    USERS ({users.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('files')}
                                    className={`py-4 border-b-4 transition-all font-cyber font-bold uppercase tracking-wide ${activeTab === 'files'
                                        ? 'border-cyber-red-500 text-cyber-red-500'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    FILES ({files.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`py-4 border-b-4 transition-all font-cyber font-bold uppercase tracking-wide ${activeTab === 'logs'
                                        ? 'border-cyber-red-500 text-cyber-red-500'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    LOGS ({logs.length})
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm font-cyber font-bold text-white uppercase">
                                                <th className="pb-4">NAME</th>
                                                <th className="pb-4">EMAIL</th>
                                                <th className="pb-4">ROLE</th>
                                                <th className="pb-4">JOINED</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-cyber-gray">
                                            {users.map((user) => (
                                                <tr key={user.id} className="font-mono text-white">
                                                    <td className="py-4">{user.name}</td>
                                                    <td className="py-4">{user.email}</td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 text-xs font-cyber font-bold uppercase ${user.role === 'admin'
                                                            ? 'bg-cyber-red-500 text-white'
                                                            : 'bg-cyber-gray text-white'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-gray-400">{formatDate(user.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Files Tab */}
                            {activeTab === 'files' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm font-cyber font-bold text-white uppercase">
                                                <th className="pb-4">FILE NAME</th>
                                                <th className="pb-4">OWNER</th>
                                                <th className="pb-4">SIZE</th>
                                                <th className="pb-4">UPLOADED</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-cyber-gray">
                                            {files.map((file) => (
                                                <tr key={file.id} className="font-mono text-white">
                                                    <td className="py-4">{file.file_name}</td>
                                                    <td className="py-4 text-gray-400">{file.owner_email}</td>
                                                    <td className="py-4 text-gray-400">{formatBytes(file.file_size)}</td>
                                                    <td className="py-4 text-gray-400">{formatDate(file.uploaded_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Logs Tab */}
                            {activeTab === 'logs' && (
                                <div className="space-y-3">
                                    {logs.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between py-3 border-b-2 border-cyber-gray">
                                            <div>
                                                <p className="font-cyber font-bold text-white uppercase text-sm">{log.action}</p>
                                                <p className="text-sm font-mono text-gray-400">
                                                    {log.user_email || 'ANONYMOUS'} • {log.ip_address}
                                                </p>
                                            </div>
                                            <p className="text-sm font-mono text-gray-400">{formatDate(log.timestamp)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPanel;
