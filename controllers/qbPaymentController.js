import qbApiService from "../services/qbApiService.js";

const qbPaymentController = {
  async list(req, res) {
    try {
      const data = await qbApiService.getPayments();
      res.json(data);
    } catch (err) {
      console.error("Payment list error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default qbPaymentController;
