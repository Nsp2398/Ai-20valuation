import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database/init";
import { authenticateToken, optionalAuth } from "./utils/auth";

// Import route handlers
import { handleDemo } from "./routes/demo";
import { 
  signUpEmail, 
  signInEmail, 
  sendVerificationCode, 
  signUpPhone, 
  signInPhone, 
  getProfile 
} from "./routes/auth";
import { 
  createValuation, 
  getValuationMethods, 
  getUserValuations, 
  getValuationById, 
  getDashboard, 
  deleteValuation 
} from "./routes/valuation";
import { 
  generateReport, 
  downloadReport, 
  getUserReports, 
  deleteReport 
} from "./routes/reports";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize database on server start
  initializeDatabase().catch(console.error);

  // Health check endpoints
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signup/email", signUpEmail);
  app.post("/api/auth/signin/email", signInEmail);
  app.post("/api/auth/send-verification", sendVerificationCode);
  app.post("/api/auth/signup/phone", signUpPhone);
  app.post("/api/auth/signin/phone", signInPhone);
  app.get("/api/auth/profile", authenticateToken, getProfile);

  // Valuation routes
  app.post("/api/valuations", authenticateToken, createValuation);
  app.get("/api/valuations/methods", getValuationMethods);
  app.get("/api/valuations", authenticateToken, getUserValuations);
  app.get("/api/valuations/:id", authenticateToken, getValuationById);
  app.delete("/api/valuations/:id", authenticateToken, deleteValuation);

  // Dashboard route
  app.get("/api/dashboard", authenticateToken, getDashboard);

  // Report routes
  app.post("/api/reports/generate", authenticateToken, generateReport);
  app.get("/api/reports/download/:reportId", authenticateToken, downloadReport);
  app.get("/api/reports", authenticateToken, getUserReports);
  app.delete("/api/reports/:reportId", authenticateToken, deleteReport);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });

  return app;
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 3001;
  const server = createServer();
  
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 ValuAI API ready at http://localhost:${port}/api`);
  });
}
