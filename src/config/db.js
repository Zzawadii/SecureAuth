// Simple in-memory database (replace with PostgreSQL/MongoDB in production)
export const users = new Map();
export const refreshTokens = new Map();
export const loginAttempts = new Map();
export const verificationTokens = new Map();
