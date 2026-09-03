import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import qbAuthController from "./controllers/qbAuthController.js";
import customerRoutes from "./routes/customers.js";
import invoiceRoutes from "./routes/invoices.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.get("/oauth/callback", qbAuthController.handleCallback);
app.get("/oauth/tokens", qbAuthController.getStoredTokens);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "QuickBooks OAuth API running"
  });
});

const port = process.env.PORT || 3000;
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (!process.env.VERCEL && isDirectRun) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
