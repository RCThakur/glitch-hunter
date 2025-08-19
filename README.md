# 🎮 Glitch Hunter

Glitch Hunter is a **MERN-stack powered cyberpunk-style game** where players enter a glitchy digital void to hunt down the "right glitch."  
The project combines a **backend server** (Node.js + Express + MongoDB) with a **modern frontend** (React + TailwindCSS + Framer Motion).

---

## 🚀 Features

- ⚡ **Landing Page** with glitchy animated cubes
- 🔑 **Authentication Flow** (Login / Signup) connected to backend APIs
- 🎯 **Game Dashboard** (entry point after login)
- 🔊 **Audio Manager** for background music & effects
- 🌐 MERN Architecture (MongoDB, Express, React, Node.js)

---

## 🛠️ Tech Stack

### Frontend

- React 19 (Vite)
- Tailwind CSS
- Framer Motion (animations)
- Axios (API requests)

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication

---

## 📂 Project Structure

glitch-hunter/
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── pages/
│ │ │ ├── LandingPage.jsx
│ │ │ ├── LoginPage.jsx
│ │ │ └── Dashboard.jsx
│ │ ├── components/
│ │ │ └── LoginModal.jsx
│ │ ├── utils/
│ │ │ └── AudioManager.js
│ │ └── App.jsx
│ ├── index.html
│ └── package.json
│
├── server/ # Express Backend
│ ├── routes/
│ │ └── authRoutes.js
│ ├── models/
│ │ └── User.js
│ ├── server.js
│ └── package.json
│
├── .gitignore
├── README.md

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
    git clone https://github.com/RCThakur/glitch-hunter.git
    cd glitch-hunter

##2. Install Dependencies
    For client:
    cd client
    npm install

    For server:
    cd server
    npm install

##4. Run the Project
Start backend server:
cd server
npm start

Start frontend (Vite):
cd client
npm run dev
```
