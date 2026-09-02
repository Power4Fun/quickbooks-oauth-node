import express from "express";
import dotenv from "dotenv";
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

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
