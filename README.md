# 🚚 Cargo Scanner

**Cargo Scanner** is a full-stack web application built to streamline **product management** and **inventory analysis** in logistics. It features secure user authentication, QR code generation, and an intuitive interface to manage various product types and materials. The system is scalable and cloud-based, ideal for supply chain and cargo operations.

---

## ✨ Features

* 🔐 **User Authentication** – Secure login & registration using JWT and bcrypt.
* 👥 **Role Management** – Support for roles: Administrator, Employee, Manager, Customer.
* 📦 **Product Management** – Add, edit, view, and delete products with details like type, material, contact, and validity.
* 📄 **QR Code Generation** – Generate QR codes for individual products for scanning and tracking.
* 💻 **Responsive UI** – Clean and modern frontend using React + Material UI.
* 🌐 **REST API** – Organized Express routes for authentication and product CRUD.
* ☁️ **Cloud Database** – MongoDB Atlas used for reliable and scalable storage.

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Material UI
* React Router DOM
* Axios
* Formik + Yup (for form validation)
* QRCode.react
* SweetAlert2

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT for authentication
* bcrypt for password hashing
* dotenv, CORS, connect-mongo, express-session

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js and npm
* MongoDB Atlas (or local MongoDB)

---

### 📥 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Subhapreet21/Cargo-Scanner.git
cd Cargo_Scanner
```

---

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGO_DB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run server
```

---

#### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Visit the frontend at: [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/api/auth/register`  | Register a new user    |
| POST   | `/api/auth/login`     | Login and receive JWT  |
| POST   | `/api/auth/logout`    | Logout                 |
| GET    | `/api/auth/protected` | Access protected route |

### 📦 Products

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/products/`    | Add a new product    |
| GET    | `/api/products/`    | Get all products     |
| PUT    | `/api/products/:id` | Update product by ID |
| DELETE | `/api/products/:id` | Delete product by ID |

---

## 🧬 Data Models

### 👤 User

| Field          | Type   | Description                   |
| -------------- | ------ | ----------------------------- |
| `username`     | String | Required, unique              |
| `password`     | String | Hashed password               |
| `email`        | String | Required, unique              |
| `role`         | String | One of: admin, employee, etc. |
| `mobileNumber` | String | 10-digit phone number         |
| `address`      | String | Optional                      |
| `dob`          | Date   | Optional                      |
| `gender`       | String | Optional                      |

### 📦 Product

| Field             | Type   | Description |
| ----------------- | ------ | ----------- |
| `name`            | String | Required    |
| `productType`     | String | Required    |
| `validity`        | String | Optional    |
| `phoneNumber`     | String | Optional    |
| `productMaterial` | String | Optional    |

---

## 📁 Folder Structure

```
Cargo_Scanner/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Pages & UI components
│       └── services/     # Axios services
│
├── server/               # Express backend
│   ├── models/           # Mongoose models (User, Product)
│   ├── routes/           # Route handlers
│   └── server.js         # Entry point
```

---

## 📜 Scripts

### Client

* `npm run dev` – Start development server
* `npm run build` – Production build
* `npm run preview` – Preview build
* `npm run lint` – Lint the code

### Server

* `npm start` – Start server
* `npm run server` – Start with Nodemon

---

## 🪪 License

This project is intended for **educational and demonstration purposes** only.

---
