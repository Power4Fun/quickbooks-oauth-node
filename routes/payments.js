import express from "express";
import qbPaymentController from "../controllers/qbPaymentController.js";

const router = express.Router();

router.get("/", qbPaymentController.list);

export default router;
