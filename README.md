




# 🔐 SecureAuth - Production-Ready Authentication System

A complete, secure authentication system with enterprise-level security features.

## ✨ Features

- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **Password Hashing** using bcrypt (12 rounds)
- ✅ **Rate Limiting** to prevent brute force attacks
- ✅ **Email Verification** for new accounts
- ✅ **2FA Support** (Google Authenticator/TOTP)
- ✅ **Login Attempt Logging** with IP tracking
- ✅ **Input Validation** using express-validator
- ✅ **Secure Token Management**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```
### 3. Run the Server
npm run dev

## 🛡️ Security Features

### Rate Limiting
- **Login**: 5 attempts per 15 minutes
- **Registration**: 3 accounts per hour per IP
- **General API**: 100 requests per 15 minutes

### Password Security
- Minimum 8 characters required
- Hashed with bcrypt (12 rounds)
- Never stored in plain text

### Token Security
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Separate secrets for each token type

### Login Tracking
- IP address logging
- Success/failure tracking
- Reason for failure recorded
- Last 50 attempts per user stored

### Email Verification
- Required before login
- 24-hour expiration
- Secure random token generation

### 2FA (Two-Factor Authentication)
- TOTP-based (Google Authenticator compatible)
- 30-second time window
- QR code generation for easy setup

## 📦 Project Structure

```
secure-auth/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   └── authController.js  # Auth logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── rateLimiter.js     # Rate limiting
│   │   └── validator.js       # Input validation
│   ├── routes/
│   │   └── authRoutes.js      # API routes
│   ├── utils/
│   │   ├── email.js           # Email sending
│   │   ├── logger.js          # Login tracking
│   │   └── tokens.js          # Token generation
│   └── server.js              # Express app
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 📄 License

MIT License
