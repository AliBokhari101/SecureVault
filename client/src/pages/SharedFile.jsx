import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SharedFile = () => {
    const { token } = useParams();
    const [fileInfo, setFileInfo] = useState(null);
    const [password, setPassword] = useState('');
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        checkAccess();
    }, [token]);

    const checkAccess = async () => {
        try {
            const response = await axios.post(`/api/share/${token}/access`, {});
            setFileInfo(response.data.file);
            setLoading(false);
        } catch (err) {
            if (err.response?.data?.requiresPassword) {
                setRequiresPassword(true);
                setLoading(false);
            } else {
                setError(err.response?.data?.error || 'Invalid or expired link');
                setLoading(false);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`/api/share/${token}/access`, { password });
            setFileInfo(response.data.file);
            setRequiresPassword(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid password');
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await axios.get(`/api/share/${token}/download`, {
                params: { password },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileInfo.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Download failed');
        } finally {
            setDownloading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cyber-white cyber-grid-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyber-red-500 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (error && !requiresPassword) {
        return (
            <div className="min-h-screen bg-cyber-white cyber-grid-bg flex items-center justify-center px-4 relative overflow-hidden">
                <div className="scanline-effect absolute inset-0 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="neon-card p-8 max-w-md w-full text-center relative"
                >
                    <div className="corner-accent"></div>
                    <div className="w-16 h-16 bg-cyber-red-500 border-2 border-cyber-black flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-cyber font-bold text-cyber-red-500 uppercase tracking-wide mb-2 neon-text">
                        ACCESS DENIED
                    </h1>
                    <p className="font-mono text-cyber-darkgray mb-6">[ERROR] {error}</p>
                    <Link to="/" className="btn-cyber-primary">
                        RETURN HOME
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyber-white cyber-grid-bg flex items-center justify-center px-4 relative overflow-hidden">
            <div className="scanline-effect absolute inset-0 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="neon-card p-8 max-w-md w-full relative"
            >
                <div className="corner-accent"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyber-red-500 border-2 border-cyber-black flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-cyber font-bold text-cyber-red-500 uppercase tracking-wide neon-text mb-2">
                        SHARED FILE
                    </h1>
                    <p className="font-mono text-cyber-darkgray text-sm">
                        <span className="text-cyber-red-500">[SECUREVAULT TRANSFER]</span>
                    </p>
                </div>

                {requiresPassword ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="bg-cyber-red-100 border-2 border-cyber-red-500 text-cyber-red-700 px-4 py-3 font-mono text-sm">
                            <p className="font-bold">[PASSWORD REQUIRED]</p>
                        </div>

                        {error && (
                            <div className="bg-cyber-red-100 border-2 border-cyber-red-500 text-cyber-red-700 px-4 py-3 font-mono text-sm">
                                <span className="font-bold">[ERROR]</span> {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-cyber font-bold text-cyber-black uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">PASSWORD</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-cyber"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full btn-cyber-primary">
                            ACCESS FILE
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="cyber-card p-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-cyber-red-500 border-2 border-cyber-black flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-cyber font-bold text-cyber-black uppercase">{fileInfo?.name}</p>
                                    <p className="text-sm font-mono text-cyber-darkgray">{formatBytes(fileInfo?.size)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="font-mono text-sm text-cyber-darkgray space-y-1">
                            <p>UPLOADED: {new Date(fileInfo?.uploadedAt).toLocaleDateString()}</p>
                            <p>DOWNLOADS: {fileInfo?.downloadCount}</p>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full btn-cyber-primary disabled:opacity-50"
                        >
                            {downloading ? '[DOWNLOADING...]' : '[DOWNLOAD FILE]'}
                        </button>

                        <p className="text-center font-mono text-cyber-darkgray text-sm">
                            POWERED BY <Link to="/" className="text-cyber-red-500 font-bold hover:underline">SECUREVAULT</Link>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SharedFile;
