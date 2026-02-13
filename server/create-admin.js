const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'data', 'securevault.db');
const db = new Database(dbPath);

// Admin credentials
const adminEmail = 'admin@securevault.com';
const adminPassword = 'Admin1234'; // Change this!
const adminName = 'Admin User';

async function createAdmin() {
    try {
        // Check if admin already exists
        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

        if (existing) {
            console.log('❌ Admin user already exists with email:', adminEmail);
            console.log('Updating role to admin...');
            db.prepare('UPDATE users SET role = ? WHERE email = ?').run('admin', adminEmail);
            console.log('✅ User role updated to admin!');
        } else {
            // Hash password
            const passwordHash = await bcrypt.hash(adminPassword, 12);

            // Insert admin user
            const result = db.prepare(`
                INSERT INTO users (name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `).run(adminName, adminEmail, passwordHash, 'admin');

            console.log('✅ Admin user created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email:', adminEmail);
            console.log('🔑 Password:', adminPassword);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('⚠️  IMPORTANT: Change the password after first login!');
        }

        db.close();
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        db.close();
    }
}

createAdmin();
