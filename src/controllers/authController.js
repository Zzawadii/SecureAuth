import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { users, refreshTokens, verificationTokens } from '../config/db.js';
import { logLoginAttempt, getLoginHistory } from '../utils/logger.js';
import { sendVerificationEmail, send2FAEmail } from '../utils/email.js';
import { generateAccessToken, generateRefreshToken, generateVerificationToken, generate2FACode } from '../utils/tokens.js';

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (users.has(email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = generateVerificationToken();

        const user = {
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            name,
            verified: false,
            twoFactorEnabled: false,
            twoFactorSecret: null,
            createdAt: new Date().toISOString(),
        };

        users.set(email, user);
        verificationTokens.set(verificationToken, { email, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            userId: user.id,
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const verification = verificationTokens.get(token);
        if (!verification) {
            return res.status(400).json({ error: 'Invalid verification token' });
        }

        if (Date.now() > verification.expiresAt) {
            verificationTokens.delete(token);
            return res.status(400).json({ error: 'Verification token expired' });
        }

        const user = users.get(verification.email);
        if (user) {
            user.verified = true;
            verificationTokens.delete(token);
            return res.json({ message: 'Email verified successfully. You can now log in.' });
        }

        res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, twoFactorCode } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        const user = users.get(email);
        if (!user) {
            logLoginAttempt(email, ip, false, 'User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.verified) {
            logLoginAttempt(email, ip, false, 'Email not verified');
            return res.status(401).json({ error: 'Please verify your email first' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logLoginAttempt(email, ip, false, 'Invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(200).json({ requiresTwoFactor: true, message: 'Please provide 2FA code' });
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorCode,
                window: 2,
            });

            if (!verified) {
                logLoginAttempt(email, ip, false, 'Invalid 2FA code');
                return res.status(401).json({ error: 'Invalid 2FA code' });
            }
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.set(refreshToken, { userId: user.id, email: user.email });

        logLoginAttempt(email, ip, true);

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        if (!refreshTokens.has(token)) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                refreshTokens.delete(token);
                return res.status(403).json({ error: 'Invalid or expired refresh token' });
            }

            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'Token refresh failed', details: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (token) {
            refreshTokens.delete(token);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed', details: error.message });
    }
};

export const enable2FA = async (req, res) => {
    try {
        const user = users.get(req.user.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const secret = speakeasy.generateSecret({
            name: `SecureAuth (${user.email})`,
            length: 32,
        });

        user.twoFactorSecret = secret.base32;

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            message: '2FA setup initiated. Scan the QR code with Google Authenticator.',
            qrCode: qrCodeUrl,
            secret: secret.base32,
        });
    } catch (error) {
        res.status(500).json({ error: '2FA setup failed', details: error.message });
    }
};

export const verify2FA = async (req, res) => {
    try {
        const { code } = req.body;
        const user = users.get(req.user.email);

        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ error: '2FA not initiated' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 2,
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }

        user.twoFactorEnabled = true;

        res.json({ message: '2FA enabled successfully' });
    } catch (error) {
        res.status(500).json({ error: '2FA verification failed', details: error.message });
    }
};

export const disable2FA = async (req, res) => {
    try {
        const { code } = req.body;
        const user = users.get(req.user.email);

        if (!user || !user.twoFactorEnabled) {
            return res.status(400).json({ error: '2FA not enabled' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 2,
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }

        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;

        res.json({ message: '2FA disabled successfully' });
    } catch (error) {
        res.status(500).json({ error: '2FA disable failed', details: error.message });
    }
};

export const getLoginHistory = async (req, res) => {
    try {
        const history = getLoginHistory(req.user.email);
        res.json({ loginHistory: history });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch login history', details: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = users.get(req.user.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
            twoFactorEnabled: user.twoFactorEnabled,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
};
