import qbApiService from "../services/qbApiService.js";

const qbItemController = {
  async list(req, res) {
    try {
      const data = await qbApiService.getItems();
      res.json(data);
    } catch (err) {
      console.error("Item list error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default qbItemController;
