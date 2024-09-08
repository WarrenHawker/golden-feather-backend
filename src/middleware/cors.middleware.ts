import { CorsOptions } from 'cors';

// Define the allowed origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
