# Digital Hair Salon Management System

A production-grade, modular layered MVC backend for managing digital salons. This system supports a scalable **Multi-Shop Ownership** model, allowing a single salon owner to register and manage multiple branches with centralized admin approval and robust booking workflows.

---

## 🌟 Key Features

### 👤 Customer Experience Layer
- **Advanced Discovery**: Search and filter salons by city, service category, and rating.
- **Personalized Profiles**: Manage preferences, loyalty points, and profile images.
- **Social Features**: Add salons to favorites (Wishlist) and track "Recently Viewed" history.

### 🏢 Multi-Shop Management
- **Enterprise Ready**: Owners can manage multiple salon locations under one account.
- **Branch-Specific Data**: Each salon maintains its own services, slots, and ratings.

### 🛡️ Secure Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Distinct flows for **Customers**, **Salon Owners**, and **Admins**.
- **Security First**: 
  - JWT for stateless authentication.
  - OTP-based email verification via Nodemailer.
  - Password hashing with BcryptJS.
  - Rate limiting and security headers (Helmet).

### 🗓️ Smart Slot & Booking System
- **Automated Slot Generation**: Owners can generate daily time slots with custom durations and capacities.
- **Concurrency Control**: Prevents duplicate slot generation and double bookings.

### 💬 Review & Trust System
- **Verified Reviews**: Customers can only review salons after a completed booking.
- **Dynamic Ratings**: Auto-recalculation of salon average ratings and review counts.
- **Moderation**: 24-hour edit window for reviews and soft-delete support.

### 🔔 Notification System
- **Multi-Channel**: Supports In-app notifications and Email alerts.
- **Real-time Tracking**: Monitor unread/read status for booking, payment, and admin updates.

---

## 🛠️ Tech Stack

- **Backend**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & OTP-Generator
- **Validation**: Validator.js
- **File Uploads**: Multer
- **Emails**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas or local MongoDB instance
- SMTP Server (e.g., Gmail APP Password or Mailtrap) for OTP emails

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dhanuja2006/Digital-Saloon-Management-System.git
   cd Digital-Saloon-Management-System
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `backend/` directory and add the following:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=DigitalSalon <noreply@digitalsalon.com>

   # Admin Configuration
   ADMIN_CODE=1234
   ```

4. **Run the Server**:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## 🧪 Testing

The API can be tested using Postman. The system uses a modular route structure for easy testing.

### Key API Prefixes:
- `Identity`: `/api/auth`
- `Customer`: `/api/users`
- `Salons`: `/api/salons`
- `Services`: `/api/services`
- `Slots`: `/api/slots`
- `Reviews`: `/api/reviews`
- `Notifications`: `/api/notifications`

---

## 👨‍💻 Project Structure

```text
backend/
├── src/
│   ├── config/         # Environment & Database config
│   ├── middleware/     # Auth, Upload, and Rate Limiting
│   ├── modules/
│   │   ├── identity/   # Auth logic (Signup/Login/OTP)
│   │   ├── customer/   # Profile, Discovery, and Favorites
│   │   ├── review/     # Feedback & Rating logic
│   │   ├── notification/# In-app & Email alerts
│   │   ├── salon/      # Shop management
│   │   ├── service/    # Service catalogs
│   │   └── slot/       # Booking & Slot generation
│   ├── utils/          # Global helpers (AppError, Email)
│   └── server.js       # Entry point
```


