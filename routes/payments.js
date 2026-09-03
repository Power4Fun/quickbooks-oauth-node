import express from "express";
import qbPaymentController from "../controllers/qbPaymentController.js";

const router = express.Router();

router.get("/", qbPaymentController.list);
router.post("/", qbPaymentController.create);

export default router;
