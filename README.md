# 🛒 Real-Time Dynamic Price Optimization & Competitor Analysis

This is a backend project that enables users to:
- Register and login securely
- Add their own products
- Monitor competitor prices dynamically using web scraping
- Lay foundation for a React-based dashboard in future

---

## 🎯 Goal

To build a backend-powered service that helps businesses:
- Track product prices in real-time
- Analyze competitor pricing
- Optimize their own pricing strategy dynamically

---

## 🧠 Strategy

The core strategy includes:
1. User registers/logs in to system (auth-light, no heavy RBAC)
2. User adds their product (with name, description, base price, etc.)
3. User (or system) adds competitor product URLs to track
4. A scraping script pulls current price of competitor products
5. API returns price comparison
6. Later: show all data on a React dashboard (optional)

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT, Bcrypt
- **Web Scraping:** Axios, Cheerio
- **Environment Management:** dotenv
- **Testing Tool:** Postman

---

## ✅ Features Done So Far

### 🔐 Authentication
- `POST /api/auth/signup` – Signup a new user
- `POST /api/auth/login` – Login and receive a JWT token
- Passwords are hashed using bcrypt

### 🛍️ Product Management
- Structure in place to create products
- Competitor product links can be associated with each product

### 🕷️ Scraper Route
- `GET /api/product/:id/competitors` – Fetches latest prices from competitor URLs via Cheerio
- Automatically scrapes price data from provided links
- Handles multiple competitor products for a single product

---

## 📁 Folder Structure

backend/ │ ├── controllers/ │ ├── authController.js │ └── scraperController.js │ ├── models/ │ ├── User.js │ └── Product.js (TBD) │ ├── routes/ │ ├── authRoutes.js │ └── scrapeRoute.js │ ├── config/ │ └── db.js │ ├── .env ├── server.js └── package.json

