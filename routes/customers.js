// routes/customers.js
import express from "express";
import qbCustomerController from "../controllers/qbCustomerController.js";

const router = express.Router();
router.get("/", qbCustomerController.list);
router.post("/", qbCustomerController.create);

export default router;
