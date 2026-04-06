import http from 'http';
import express from 'express';
import path from 'path';
import { APP_CONFIG } from './app/config/app.conf';
import taskRoutes from './app/routes/Task.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/task', taskRoutes);

// Start server
const server = http.createServer(app);

server.listen(APP_CONFIG.port, () => {
  console.log(`Server running at http://${APP_CONFIG.host}:${APP_CONFIG.port}`);
});
