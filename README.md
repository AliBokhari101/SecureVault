# SecureVault - Encrypted File Sharing & Access Control Platform

A production-ready full-stack application for secure file sharing with AES-256 encryption, role-based access control, and comprehensive audit logging.

## 🔒 Features

### Security
- **AES-256 Encryption**: All files are encrypted before storage using military-grade encryption
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Password Hashing**: bcrypt with 12 rounds for secure password storage
- **Account Lockout**: Automatic 15-minute lockout after 5 failed login attempts
- **Rate Limiting**: Protection against brute force attacks (5 requests per 15 minutes on login)
- **Audit Logging**: Complete activity tracking for security compliance

### File Management
- **Encrypted Upload**: Files are encrypted with unique IVs before storage
- **Secure Download**: On-the-fly decryption for authorized users only
- **File Sharing**: Generate secure share links with:
  - Password protection (optional)
  - Expiration dates
  - Download tracking
- **File Size Limit**: 50MB per file (configurable)

### User Features
- **Dashboard**: View statistics and recent activity
- **File Manager**: Upload, download, delete, and share files
- **Admin Panel**: System-wide overview (admin users only)
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Multer (file uploads)
- Node crypto (AES-256 encryption)
- express-rate-limit
- Helmet (security headers)

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd d:/project/p1/securevault
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE securevault;
```

Run the schema:

```bash
psql -U postgres -d securevault -f server/config/schema.sql
```

Or manually execute the SQL in `server/config/schema.sql`

### 3. Backend Setup

```bash
cd server
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=securevault
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=24h

# MUST be exactly 32 characters
ENCRYPTION_KEY=12345678901234567890123456789012

MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=900000

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=5

CLIENT_URL=http://localhost:5173
```

**⚠️ IMPORTANT**: Change the `ENCRYPTION_KEY` and `JWT_SECRET` to secure random values in production!

Start the backend server:

```bash
npm start
```

Server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👤 Default Admin Account

- **Email**: admin@securevault.com
- **Password**: admin123

**⚠️ Change this password immediately in production!**

## 📁 Project Structure

```
securevault/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── schema.sql
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── shareController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── shareRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── encryption.js
│   │   └── logger.js
│   ├── app.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FileManager.jsx
│   │   │   ├── SharedFile.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🔐 Security Architecture

### File Encryption
1. User uploads file
2. File is read into memory buffer
3. Random 16-byte IV (Initialization Vector) is generated
4. File is encrypted using AES-256-CBC with the IV
5. Encrypted file is saved to disk
6. IV is stored in database (required for decryption)

### Authentication Flow
1. User registers/logs in
2. Password is hashed with bcrypt (12 rounds)
3. JWT token is generated with user info
4. Token is sent to client and stored in localStorage
5. Token is included in Authorization header for protected requests
6. Server verifies token on each request

### Share Link Security
1. Cryptographically secure random token is generated
2. Optional password is hashed with bcrypt
3. Expiration date is set
4. Public access requires token validation
5. Password verification (if protected)
6. Download count is tracked

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Files
- `POST /api/files/upload` - Upload file (protected)
- `GET /api/files` - Get user's files (protected)
- `GET /api/files/:id/download` - Download file (protected)
- `DELETE /api/files/:id` - Delete file (protected)

### Sharing
- `POST /api/share/create` - Create share link (protected)
- `POST /api/share/:token/access` - Access shared file (public)
- `GET /api/share/:token/download` - Download shared file (public)
- `GET /api/share/my-links` - Get user's share links (protected)
- `DELETE /api/share/:id` - Delete share link (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/files` - Get all files (admin only)
- `GET /api/admin/logs` - Get activity logs (admin only)
- `GET /api/admin/stats` - Get system statistics (admin only)

## 🎨 UI Features

- **Dark Theme**: Professional security-focused dark design
- **Glassmorphism**: Modern glass-effect cards
- **Responsive**: Mobile-first design
- **Animations**: Smooth Framer Motion animations
- **Progress Tracking**: Real-time upload progress
- **Toast Notifications**: User feedback for actions

## 🚀 Deployment Considerations

### Environment Variables
- Generate strong random values for `JWT_SECRET` and `ENCRYPTION_KEY`
- Use environment-specific database credentials
- Set `NODE_ENV=production`

### Database
- Enable SSL connections
- Set up regular backups
- Use connection pooling

### File Storage
- Consider using cloud storage (AWS S3, Azure Blob) instead of local filesystem
- Implement file cleanup for expired share links
- Set up CDN for faster file delivery

### Security
- Enable HTTPS/TLS
- Configure CORS properly
- Set up firewall rules
- Regular security audits
- Monitor activity logs

## 📝 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] File versioning
- [ ] Folder organization
- [ ] Bulk file operations
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] File preview (images, PDFs)
- [ ] Drag & drop upload
- [ ] Dark/light mode toggle
- [ ] File integrity verification (SHA-256 hashing)
- [ ] Cloud storage integration
- [ ] Docker containerization

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ for secure file sharing

---

**⚠️ Security Notice**: This is a demonstration project. For production use, conduct a thorough security audit, implement additional security measures, and follow best practices for your specific use case.
