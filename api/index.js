import express from "express";
import serverless from "serverless-http";

import paymentsRoutes from "../routes/payments.js";
import invoiceRoutes from "../routes/invoices.js";
import itemRoutes from "../routes/items.js";
import vendorRoutes from "../routes/vendors.js";
import customerRoutes from "../routes/customers.js";
import refreshRoutes from "../routes/refresh.js";

const app = express();
app.use(express.json());

// Mount routes
app.use("/api/payments", paymentsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/refresh", refreshRoutes);

// Root
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "QuickBooks OAuth API running" });
});

// Export as serverless function
export const handler = serverless(app);
