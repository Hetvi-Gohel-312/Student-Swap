## ✅ Setup & Run Instructions (Beginner-Friendly)

### 1. Install Node.js
* Download & install **Node.js (LTS version)** from:  
  👉 [https://nodejs.org](https://nodejs.org)  

* Installation ke baad check karo:  
```bash
node -v
npm -v

### 2. Clone the Repository
bash
Copy code
git clone <your-repo-link>
cd studentswap-backend

### 3. Initialize Project
bash
Copy code
npm init -y

### 4. Install Project Dependencies
Project folder me studentswap-backend open karo aur terminal me run karo:

bash
Copy code
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

### 5. Start the Server
Server ko start karne ke liye do options hain:

🔹 Simple run:

bash
Copy code
node server.js
🔹 Auto-reload with nodemon (recommended):

bash
Copy code
npx nodemon server.js

### 6. Expected Output
Agar sab sahi setup hua, toh terminal me ye output aayega:

pgsql
Copy code
Server is running on port 3000
Connected to SQLite database

### 7. Access
Server chal raha hai at:
👉 http://localhost:3000/
