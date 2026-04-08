import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
];

router.post('/register', registerLimiter, registerValidation, validate, authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', loginLimiter, loginValidation, validate, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.get('/login-history', authenticateToken, authController.getLoginHistory);

// 2FA routes
router.post('/2fa/enable', authenticateToken, authController.enable2FA);
router.post('/2fa/verify', authenticateToken, body('code').isLength({ min: 6, max: 6 }), validate, authController.verify2FA);
router.post('/2fa/disable', authenticateToken, body('code').isLength({ min: 6, max: 6 }), validate, authController.disable2FA);

export default router;
