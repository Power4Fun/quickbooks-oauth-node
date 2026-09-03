import express from "express";
import serverless from "serverless-http";
import qbAuthController from "../controllers/qbAuthController.js";

import paymentsRoutes from "../routes/payments.js";
import invoiceRoutes from "../routes/invoices.js";
import itemRoutes from "../routes/items.js";
import vendorRoutes from "../routes/vendors.js";
import customerRoutes from "../routes/customers.js";

const app = express();
app.use(express.json());

app.use("/api/payments", paymentsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);

app.get("/oauth/callback", qbAuthController.handleCallback);
app.get("/oauth/tokens", qbAuthController.getStoredTokens);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "QuickBooks OAuth API running" });
});

export const handler = serverless(app);
export default app;
