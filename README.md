# DevConnect - Developer Social Network & Chat API 🚀

DevConnect is a robust, production-ready backend API built for developers to connect, network, and chat in real-time. It features a scalable MVC architecture, secure JWT authentication, and interactive OpenAPI (Swagger) documentation.

## ✨ Features

- **🔐 Authentication**: Secure user signup, login, and logout using JWT cookies & Bearer tokens.
- **🧑‍💻 User Profiles**: View and edit detailed user profiles including skills, about me, and photos.
- **🤝 Connection System**: Send, accept, ignore, or reject connection requests (similar to LinkedIn).
- **📰 Smart Feed**: A paginated user feed that intelligently excludes people you've already connected with or sent requests to.
- **💬 Real-Time Chat**: Send and receive instant messages with your connections using **Socket.io**.
- **📚 Interactive API Docs**: Beautifully documented endpoints using Swagger UI.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Real-Time Engine**: Socket.io
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Documentation**: Swagger OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`)

## 📂 Project Structure (MVC)

The codebase is organized cleanly using the Model-View-Controller pattern:

```text
src/
├── config/           # Database and Swagger configurations
├── controllers/      # Core business logic for routes
├── docs/             # Swagger JSDoc endpoint documentation
├── middlewares/      # Express middlewares (JWT Auth)
├── models/           # Mongoose schemas (User, Chat, ConnectionRequest)
├── routes/           # Express router endpoints
├── utils/            # Helper functions (Socket setup, validation)
└── app.js            # Main application entry point
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v14+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of your project and configure the following variables:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
# Add your MongoDB connection string (used in src/config/database.js)
```

### 4. Running the Server
Start the development server using Nodemon:
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or your configured `PORT`).

## 📖 API Documentation

DevConnect features auto-generated, interactive API documentation. 
Once your server is running, navigate to:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

From there, you can easily view request schemas, expected responses, and test endpoints directly from the browser using the "Authorize" button!

## 🔒 WebSocket (Chat) Security
The real-time chat is fully protected. The socket server securely verifies that an **accepted connection request** exists between two users before allowing them to join a room or exchange messages.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.
