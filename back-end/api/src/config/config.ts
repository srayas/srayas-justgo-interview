import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT:process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET || 'c2VjcmV0a2V5c3RyaW5nMTIzNDU2',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    MAGIC_LINK_EXPIRATION: 10 * 60 * 1000, 
    RATE_LIMIT_POINTS: parseInt(process.env.RATE_LIMIT_POINTS ||'5'),
    RATE_LIMIT_DURATION: parseInt(process.env.RATE_LIMIT_DURATION || '30') , 
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'db_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'db_password',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'db',
    FRONT_END_URL: process.env.FRONT_END_URL || 'http://localhost:3000'
  };
  