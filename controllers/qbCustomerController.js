import qbApiService from "../services/qbApiService.js";

const qbCustomerController = {
  async list(req, res) {
    try {
      const data = await qbApiService.getCustomers();
      res.json(data);
    } catch (err) {
      console.error("Customer list error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await qbApiService.createCustomer(req.body);
      res.json(data);
    } catch (err) {
      console.error("Customer create error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default qbCustomerController;
