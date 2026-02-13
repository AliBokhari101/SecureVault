import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const FileManager = () => {
    const { user, logout, isAdmin } = useAuth();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [shareModal, setShareModal] = useState(null);
    const [shareData, setShareData] = useState({ expiresIn: 168, password: '' });
    const [shareLink, setShareLink] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await api.get('/files');
            setFiles(response.data.files);
        } catch (error) {
            console.error('Failed to fetch files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setUploadProgress(0);

        try {
            const response = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            setFiles([response.data.file, ...files]);
            e.target.value = '';
        } catch (error) {
            alert(error.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await api.get(`/files/${fileId}/download`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Download failed');
        }
    };

    const handleDelete = async (fileId) => {
        if (!confirm('[CONFIRM] Delete this file?')) return;

        try {
            await api.delete(`/files/${fileId}`);
            setFiles(files.filter(f => f.id !== fileId));
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleShare = async () => {
        try {
            const response = await api.post('/share/create', {
                fileId: shareModal,
                expiresIn: parseInt(shareData.expiresIn),
                password: shareData.password || undefined
            });

            setShareLink(response.data.shareLink);
        } catch (error) {
            alert('Failed to create share link');
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
        return new Date(dateString).toLocaleDateString();
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
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-white font-cyber font-bold hover:bg-cyber-gray border-2 border-transparent hover:border-cyber-red-500 uppercase tracking-wide transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>DASHBOARD</span>
                    </Link>

                    <Link to="/files" className="flex items-center space-x-3 px-4 py-3 bg-cyber-red-500 text-white font-cyber font-bold border-2 border-cyber-red-700 uppercase tracking-wide">
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
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-5xl font-display font-black text-white uppercase tracking-wider mb-2">
                                <span className="cyber-bracket">FILE MANAGER</span>
                            </h1>
                            <p className="font-mono text-gray-400">
                                <span className="text-cyber-red-500">[ENCRYPTED STORAGE]</span>
                            </p>
                        </div>

                        <label className="btn-cyber-primary cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            {uploading ? `[UPLOADING ${uploadProgress}%]` : '[UPLOAD FILE]'}
                        </label>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="neon-card p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-mono text-gray-400">[ENCRYPTING...]</span>
                                <span className="text-sm font-cyber font-bold text-cyber-red-500">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-cyber-gray border-2 border-cyber-red-700 h-4">
                                <div
                                    className="bg-cyber-red-500 h-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Files Table */}
                    <div className="neon-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-cyber-darkgray border-b-2 border-cyber-red-500">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-cyber font-bold text-white uppercase tracking-wide">FILE NAME</th>
                                    <th className="px-6 py-4 text-left text-sm font-cyber font-bold text-white uppercase tracking-wide">SIZE</th>
                                    <th className="px-6 py-4 text-left text-sm font-cyber font-bold text-white uppercase tracking-wide">UPLOADED</th>
                                    <th className="px-6 py-4 text-right text-sm font-cyber font-bold text-white uppercase tracking-wide">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-cyber-gray">
                                {files.length > 0 ? (
                                    files.map((file) => (
                                        <tr key={file.id} className="hover:bg-cyber-darkgray transition-all">
                                            <td className="px-6 py-4 font-mono text-white">{file.file_name}</td>
                                            <td className="px-6 py-4 font-mono text-gray-400">{formatBytes(file.file_size)}</td>
                                            <td className="px-6 py-4 font-mono text-gray-400">{formatDate(file.uploaded_at)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleDownload(file.id, file.file_name)}
                                                        className="p-2 hover:bg-cyber-red-100 text-cyber-red-500 border-2 border-transparent hover:border-cyber-red-500 transition-all"
                                                        title="Download"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShareModal(file.id);
                                                            setShareLink(null);
                                                            setShareData({ expiresIn: 168, password: '' });
                                                        }}
                                                        className="p-2 hover:bg-cyber-red-100 text-cyber-red-500 border-2 border-transparent hover:border-cyber-red-500 transition-all"
                                                        title="Share"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(file.id)}
                                                        className="p-2 hover:bg-cyber-red-100 text-cyber-red-500 border-2 border-transparent hover:border-cyber-red-500 transition-all"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center font-mono text-gray-400">
                                            [NO FILES UPLOADED]
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Share Modal */}
            {shareModal && (
                <div className="fixed inset-0 bg-cyber-black/50 flex items-center justify-center z-50" onClick={() => setShareModal(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="neon-card p-8 max-w-md w-full mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="corner-accent"></div>
                        <h2 className="text-3xl font-cyber font-bold text-white uppercase tracking-wide mb-6">
                            <span className="cyber-bracket">SHARE FILE</span>
                        </h2>

                        {!shareLink ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-cyber font-bold text-white uppercase tracking-wider mb-2">
                                        EXPIRES IN (HOURS)
                                    </label>
                                    <input
                                        type="number"
                                        value={shareData.expiresIn}
                                        onChange={(e) => setShareData({ ...shareData, expiresIn: e.target.value })}
                                        className="input-cyber"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-cyber font-bold text-white uppercase tracking-wider mb-2">
                                        PASSWORD (OPTIONAL)
                                    </label>
                                    <input
                                        type="password"
                                        value={shareData.password}
                                        onChange={(e) => setShareData({ ...shareData, password: e.target.value })}
                                        className="input-cyber"
                                        placeholder="Leave empty for no password"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button onClick={handleShare} className="btn-cyber-primary flex-1">
                                        GENERATE
                                    </button>
                                    <button onClick={() => setShareModal(null)} className="btn-cyber-secondary">
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-cyber-darkgray border-2 border-cyber-red-500 p-4 font-mono text-sm break-all">
                                    <p className="text-xs text-gray-400 mb-2 uppercase">SHARE LINK:</p>
                                    <p className="text-cyber-red-500">{shareLink.url}</p>
                                </div>

                                <div className="font-mono text-sm text-gray-400">
                                    <p>EXPIRES: {new Date(shareLink.expiresAt).toLocaleString()}</p>
                                    {shareLink.hasPassword && <p className="text-cyber-red-500">[PASSWORD PROTECTED]</p>}
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareLink.url);
                                        alert('[COPIED TO CLIPBOARD]');
                                    }}
                                    className="btn-cyber-primary w-full"
                                >
                                    COPY LINK
                                </button>

                                <button onClick={() => setShareModal(null)} className="btn-cyber-secondary w-full">
                                    CLOSE
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default FileManager;
