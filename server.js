import express from "express";
import dotenv from "dotenv";
import qbAuthController from "./controllers/qbAuthController.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/oauth/callback", qbAuthController.handleCallback);
app.get("/oauth/tokens", qbAuthController.getStoredTokens);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
