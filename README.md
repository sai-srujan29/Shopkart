# 🛒 ShopKart — Full-Stack E-Commerce Application

A modern, full-stack e-commerce web application built with **React**, **Node.js**, **Express**, and **MongoDB**. ShopKart supports product browsing, cart management, wishlist, secure checkout with Razorpay payment integration, and user authentication.

---

## 🚀 Features

- 🔐 **User Authentication** — Register, Login with JWT-based auth & bcrypt password hashing.
- 🛍️ **Product Browsing** — Browse and search through products with detailed views.
- 🛒 **Shopping Cart** — Add/remove products, manage quantities.
- ❤️ **Wishlist** — Save favorite products for later
- 📦 **Order Management** — Place orders and track order history
- 💳 **Payment Integration** — Secure payments via **Razorpay**
- ✅ **Order Success Flow** — Confirmation page after successful purchase
- 🔒 **Protected Routes** — Middleware-based route protection

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| React Router DOM v7 | Client-side Routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP Client |
| Vite | Build Tool & Dev Server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express v5 | Web Framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Razorpay | Payment Gateway |
| dotenv | Environment Variables |
| nodemon | Dev Server |

---

## 📁 Project Structure

```
ShopKart/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/            # React Context (Global State)
│   │   ├── services/           # API service calls
│   │   └── main.jsx
│   └── package.json
│
├── Lab - 01/
│   └── server/                 # Node.js Backend (Express)
│       ├── controllers/        # Route controllers
│       ├── models/             # Mongoose models
│       │   ├── customer.model.js
│       │   ├── product.model.js
│       │   └── order.model.js
│       ├── routes/             # Express routes
│       ├── middlewares/        # Auth & other middlewares
│       ├── utils/              # Utility functions
│       ├── index.js            # Server entry point
│       └── package.json
│
├── package.json                # Root scripts
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/sai-srujan29/ShopKart.git
cd ShopKart
```

---

### 2. Setup the Backend (Server)

```bash
cd "Lab - 01/server"
npm install
```

Create a `.env` file inside `Lab - 01/server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the server:
```bash
npm run dev
```

---

### 3. Setup the Frontend (Client)

```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

### 4. Run Both (from Root)

```bash
# Run frontend
npm run dev

# Run backend (in a separate terminal)
npm run server
```

---

## 🔑 Environment Variables

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page |
| Products | `/products` | Browse all products |
| Product Details | `/products/:id` | Single product view |
| Cart | `/cart` | Shopping cart |
| Wishlist | `/wishlist` | Saved products |
| Checkout | `/checkout` | Payment & order placement |
| Order Success | `/order-success` | Post-payment confirmation |
| My Orders | `/my-orders` | Order history |
| Login | `/login` | User login |
| Register | `/register` | New user registration |

---

