import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  },
  judge0: {
    apiUrl: process.env.JUDGE0_API_URL || 'http://localhost:2358',
    apiKey: process.env.JUDGE0_API_KEY || '',
    authToken: process.env.JUDGE0_AUTH_TOKEN || ''
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'papercode_dev_secret_key_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
  }
};
