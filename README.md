#############################################
# ✅ Setup & Run Instructions (Beginner-Friendly)
#############################################

## 1. Install Node.js (LTS version)
# Download from: https://nodejs.org
# After installation, verify:
node -v
npm -v

## 2. Clone the Repository
git clone <your-repo-link>
cd studentswap-backend

# 3. Initialize Project
npm init -y

# 4. Install Dependencies

# Core backend
npm install express cors body-parser dotenv

# Database
npm install sqlite3 better-sqlite3 mongoose

# Authentication & Security
npm install bcryptjs jsonwebtoken uuid

# File Uploads
npm install multer

# Real-time & Communication
npm install socket.io

# QR Code Support
npm install qrcode

# Dev tools (for auto-reload)
npm install --save-dev nodemon

# 5. Start the Server

# Option A: Simple run
node server.js

# Option B: Auto-reload with nodemon (recommended)
npx nodemon server.js

# 6. Expected Output (Terminal will show)
# Server is running on port 3000
# Connected to SQLite database

# 7. Access the server in browser:
# 👉 http://localhost:3000/
