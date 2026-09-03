import serverless from "serverless-http";
import app from "../server.js";

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "QuickBooks OAuth API running" });
});

export const handler = serverless(app);
export default app;
