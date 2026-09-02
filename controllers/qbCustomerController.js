const qbCustomerController = {
  async list(req, res) {
    return res.status(200).json({
      message: "Customers endpoint ready",
      customers: []
    });
  },

  async create(req, res) {
    return res.status(201).json({
      message: "Customer created",
      payload: req.body || {}
    });
  }
};

export default qbCustomerController;
