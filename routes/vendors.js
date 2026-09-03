import express from "express";
import qbVendorController from "../controllers/qbVendorController.js";

const router = express.Router();

router.get("/", qbVendorController.list);
router.post("/", qbVendorController.create);

export default router;
