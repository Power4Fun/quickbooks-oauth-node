const qbApiService = {
  async getCustomers() { /* GET /customer */ },
  async createCustomer(customerPayload) { /* POST /customer */ },
  async getInvoices() { /* GET /invoice */ },
  async createInvoice(invoicePayload) { /* POST /invoice */ }
};

export default qbApiService;
