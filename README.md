# Creator Dashboard Backend

This is the backend server for the **Creator Dashboard** web application. It is built using **Node.js** and **Express**, and integrates with **Firebase Authentication** for user management and **MongoDB** for data storage.

![Creator Dashboard API](https://api.placeholder.com/600/300)

## 🚀 Features

* 🔐 User Authentication with JWT tokens
* 🧭 REST API Endpoints for User and Dashboard Management
* 🗂️ MongoDB Integration for Storing Creator Data
* 🔒 Secure Password Handling with Bcrypt
* 🛡️ Request Validation and Error Handling
* 🔄 CORS Configuration for Frontend Integration
* 🧹 Well-Structured Routes and Controllers
* 🔧 Environment Configuration using `.env`
* 📊 Logging System for Debugging and Monitoring

## 📋 Prerequisites

- Node.js 16.x or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Firebase project (for authentication integration)

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/creator-dashboard-backend.git
cd creator-dashboard-backend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/creator-dashboard
# or
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/creator-dashboard

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Firebase Configuration (if applicable)
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

### Step 4: Set Up MongoDB

Ensure MongoDB is running locally or you have set up a MongoDB Atlas cluster and updated the connection string in your `.env` file.

## 🚀 Running the Server

### Development Mode

```bash
# Run with nodemon for auto-reloading
npm run dev
```

### Production Mode

```bash
# Build and start the server
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

Created with ❤️ by Hemant Rajput
