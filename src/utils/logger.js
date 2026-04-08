import { loginAttempts } from '../config/db.js';

export const logLoginAttempt = (email, ip, success, reason = null) => {
    const attempt = {
        email,
        ip,
        success,
        reason,
        timestamp: new Date().toISOString(),
    };

    if (!loginAttempts.has(email)) {
        loginAttempts.set(email, []);
    }

    const attempts = loginAttempts.get(email);
    attempts.push(attempt);

    // Keep only last 50 attempts per user
    if (attempts.length > 50) {
        attempts.shift();
    }

    console.log(`[LOGIN ATTEMPT] ${success ? '✓' : '✗'} ${email} from ${ip}${reason ? ` - ${reason}` : ''}`);
};

export const getLoginHistory = (email) => {
    return loginAttempts.get(email) || [];
};
