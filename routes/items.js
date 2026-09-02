import express from "express";
import qbItemController from "../controllers/qbItemController.js";

const router = express.Router();

router.get("/", qbItemController.list);

export default router;
