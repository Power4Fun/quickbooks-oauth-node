import express from "express";
import serverless from "serverless-http";
import customerRoutes from "../routes/customers.js";

const app = express();
app.use(express.json());
app.use("/", customerRoutes);

export const handler = serverless(app);
export default app;
