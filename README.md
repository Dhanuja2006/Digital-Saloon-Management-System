# Digital Hair Salon Management System

A production-grade, monolithic layered MVC backend for managing digital salons. This system supports a scalable **Multi-Shop Ownership** model, allowing a single salon owner to register and manage multiple branches with centralized admin approval and robust booking workflows.

---

## 🌟 Key Features

### 🏢 Multi-Shop Management
- **Enterprise Ready**: Owners can manage multiple salon locations under one account.
- **Branch-Specific Data**: Each salon maintains its own services, slots, and bookings.

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
- **Slot Locking**: (Planned) Industry-standard slot locking during the checkout process.

### 👤 Profile & Admin Workflows
- **Admin Approval**: Salon owners must be verified by an admin before they can start managing shops.
- **Profile Management**: Users can update details and upload profile images via Multer.

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

The API can be tested using Postman. A detailed testing guide with all endpoints and request flows is maintained internally.

> [!NOTE]
> For security, the `.env` and `POSTMAN_TESTING_GUIDE.md` files are ignored in this repository.

---

## 👨‍💻 Project Structure

```text
backend/
├── src/
│   ├── config/         # Environment & Database config
│   ├── modules/
│   │   ├── auth/       # OTP, JWT, and Profile logic
│   │   ├── admin/      # Multi-shop approval workflows
│   │   ├── salon/      # Shop management
│   │   ├── service/    # Service catalogs
│   │   └── slot/       # Booking & Slot generation
│   ├── utils/          # Global helpers (AppError, catchAsync)
│   └── server.js       # Entry point
```

---

## 📄 License

This project is licensed under the ISC License.
