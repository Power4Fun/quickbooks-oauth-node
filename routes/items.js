import express from "express";
import qbItemController from "../controllers/qbItemController.js";

const router = express.Router();

router.get("/", qbItemController.list);
router.post("/", qbItemController.create);

export default router;
