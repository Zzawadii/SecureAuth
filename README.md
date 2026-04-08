<<<<<<< HEAD
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

Update the following in `.env`:
- `JWT_SECRET` - Strong random string for JWT signing
- `JWT_REFRESH_SECRET` - Different strong random string
- Email configuration (Gmail, SendGrid, etc.)

### 3. Run the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📡 API Endpoints

### Public Routes

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Verify Email
```http
GET /api/auth/verify-email?token=<verification_token>
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "twoFactorCode": "123456"  // Optional, required if 2FA enabled
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<your_refresh_token>"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "<your_refresh_token>"
}
```

### Protected Routes (Require Authorization Header)

Add header: `Authorization: Bearer <access_token>`

#### Get Profile
```http
GET /api/auth/profile
```

#### Get Login History
```http
GET /api/auth/login-history
```

#### Enable 2FA
```http
POST /api/auth/2fa/enable
```

Returns QR code to scan with Google Authenticator.

#### Verify 2FA Setup
```http
POST /api/auth/2fa/verify
Content-Type: application/json

{
  "code": "123456"
}
```

#### Disable 2FA
```http
POST /api/auth/2fa/disable
Content-Type: application/json

{
  "code": "123456"
}
```

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

## 🧪 Testing the System

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","name":"Test User"}'
```

### 2. Verify Email
Check your email for the verification link and click it.

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### 4. Access Protected Route
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your_access_token>"
```

### 5. Enable 2FA
```bash
curl -X POST http://localhost:3000/api/auth/2fa/enable \
  -H "Authorization: Bearer <your_access_token>"
```

Scan the QR code with Google Authenticator and verify with the code.

## 📝 Production Considerations

### Database
Replace the in-memory storage (`src/config/db.js`) with:
- PostgreSQL with Prisma/TypeORM
- MongoDB with Mongoose
- MySQL with Sequelize

### Email Service
Configure a production email service:
- SendGrid
- AWS SES
- Mailgun
- Postmark

### Environment Variables
- Use strong, random secrets (32+ characters)
- Never commit `.env` to version control
- Use environment-specific configs

### Additional Security
- Add HTTPS in production
- Implement CORS properly
- Add helmet.js for security headers
- Set up monitoring and alerting
- Implement account lockout after X failed attempts
- Add password reset functionality
- Implement session management
- Add audit logging

### Scaling
- Use Redis for token storage
- Implement distributed rate limiting
- Add caching layer
- Use message queues for emails

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

## 🔧 Troubleshooting

### Email not sending?
- Check your email credentials in `.env`
- For Gmail, use an App Password (not your regular password)
- Enable "Less secure app access" or use OAuth2

### Rate limit too strict?
- Adjust limits in `src/middleware/rateLimiter.js`

### Token expired too quickly?
- Adjust `JWT_EXPIRES_IN` in `.env`

## 📄 License

MIT - Feel free to use in your projects!
=======
# SecureAuth
Enterprise-grade authentication backend with JWT, 2FA, email verification, login monitoring, and anti-brute-force security. Perfect for developers who want a production-ready, modular Node.js authentication system.
>>>>>>> ffe7303a675200df32a9fd15989971c319458918
