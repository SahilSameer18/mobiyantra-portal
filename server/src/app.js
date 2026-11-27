import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import feature routers here once they are implemented.
// Example: import { authRouter } from './modules/auth/auth.routes.js';

const app = express();

// Apply shared middleware before routes so every endpoint gets the same behavior.
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Mount feature routers here
// Example: app.use('/api/auth', authRouter);
// Define individual endpoints inside each module's routes file.

// A simple endpoint to check that the server is responding.
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
