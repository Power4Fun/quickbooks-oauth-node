import qbApiService from "../services/qbApiService.js";

const qbVendorController = {
  async list(req, res) {
    try {
      const data = await qbApiService.getVendors();
      res.json(data);
    } catch (err) {
      console.error("Vendor list error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default qbVendorController;
