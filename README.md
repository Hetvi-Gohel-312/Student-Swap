###############################################################
# 🚀 FULL SETUP & RUN GUIDE (BEGINNER-FRIENDLY)
###############################################################

###############################################################
# 1️⃣ INSTALL NODE.JS (LTS VERSION)
###############################################################
# 👉 Download & Install: https://nodejs.org
# 👉 After installation, verify:
node -v
npm -v

###############################################################
# 2️⃣ CLONE THE PROJECT REPOSITORY
###############################################################
git clone <your-repo-link>
cd studentswap-backend

###############################################################
# 3️⃣ INITIALIZE PROJECT
###############################################################
npm init -y

###############################################################
# 4️⃣ INSTALL REQUIRED DEPENDENCIES
###############################################################

# 🔹 Core backend
npm install express cors body-parser dotenv

# 🔹 Database
npm install sqlite3 better-sqlite3 mongoose

# 🔹 Authentication & Security
npm install bcryptjs jsonwebtoken uuid

# 🔹 File Uploads
npm install multer

# 🔹 Real-time & Communication
npm install socket.io

# 🔹 QR Code Support
npm install qrcode

# 🔹 Developer tools (auto reload)
npm install --save-dev nodemon

###############################################################
# 5️⃣ START THE SERVER
###############################################################

# 👉 Option A: Simple run
node server.js

# 👉 Option B: Auto-reload (recommended)
npx nodemon server.js

###############################################################
# 6️⃣ EXPECTED TERMINAL OUTPUT
###############################################################
# Server is running on port 3000
# Connected to SQLite database

###############################################################
# 7️⃣ ACCESS SERVER IN BROWSER
###############################################################
# 👉 http://localhost:3000/
