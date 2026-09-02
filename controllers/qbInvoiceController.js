import qbApiService from "../services/qbApiService.js";

const qbInvoiceController = {
  async list(req, res) {
    try {
      const data = await qbApiService.getInvoices();
      res.json(data);
    } catch (err) {
      console.error("Invoice list error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await qbApiService.createInvoice(req.body);
      res.json(data);
    } catch (err) {
      console.error("Invoice create error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default qbInvoiceController;
