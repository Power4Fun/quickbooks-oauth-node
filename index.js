import express from "express";
import paymentsRoutes from "./routes/payments.js";
import invoiceRoutes from "./routes/invoices.js";
import itemRoutes from "./routes/items.js";
import vendorRoutes from "./routes/vendors.js";
import customerRoutes from "./routes/customers.js";

const app = express();

app.use(express.json());

// mount your routes
app.use("/api/payments", paymentsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);

// simple root check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "QuickBooks OAuth API running" });
});

// IMPORTANT: export the app, do NOT call app.listen()
export default app;
