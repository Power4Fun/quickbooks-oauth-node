const qbInvoiceController = {
  async list(req, res) {
    return res.status(200).json({
      message: "Invoices endpoint ready",
      invoices: []
    });
  },

  async create(req, res) {
    return res.status(201).json({
      message: "Invoice created",
      payload: req.body || {}
    });
  }
};

export default qbInvoiceController;
