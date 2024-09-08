import RedisStore from 'connect-redis';
import session from 'express-session';

// Create the session middleware configuration
export const createSessionConfig = (redisStore: RedisStore) => {
  return session({
    store: redisStore,
    secret: process.env.SECRET || '', // Ensure you have a secret set in the environment
    saveUninitialized: false, // Don't save uninitialized sessions
    resave: false, // Don't resave the session if it's not modified
    name: 'sessionId', // Custom session name
    cookie: {
      secure: process.env.NODE_ENV === 'production' ? true : 'auto', // Set secure cookies only in production
      maxAge: 1000 * 60 * 60 * 24 * 3, // Set cookie expiration to 3 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Set SameSite based on environment
    },
  });
};
