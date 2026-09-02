import express from "express";
import qbInvoiceController from "../controllers/qbInvoiceController.js";

const router = express.Router();
router.get("/", qbInvoiceController.list);
router.post("/", qbInvoiceController.create);

export default router;
