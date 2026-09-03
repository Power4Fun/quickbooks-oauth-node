const qbApiService = {
  async getCustomers() {
    return {
      customers: [],
      message: "Customer list is ready for QuickBooks integration"
    };
  },

  async createCustomer(customerPayload) {
    return {
      customer: {
        id: `cust_${Date.now()}`,
        ...customerPayload
      },
      message: "Customer created successfully"
    };
  },

  async getInvoices() {
    return {
      invoices: [],
      message: "Invoice list is ready for QuickBooks integration"
    };
  },

  async createInvoice(invoicePayload) {
    return {
      invoice: {
        id: `inv_${Date.now()}`,
        ...invoicePayload
      },
      message: "Invoice created successfully"
    };
  },

  async getItems() {
    return {
      items: [],
      message: "Item list is ready for QuickBooks integration"
    };
  },

  async createItem(itemPayload) {
    return {
      item: {
        id: `item_${Date.now()}`,
        ...itemPayload
      },
      message: "Item created successfully"
    };
  },

  async getPayments() {
    return {
      payments: [],
      message: "Payment list is ready for QuickBooks integration"
    };
  },

  async createPayment(paymentPayload) {
    return {
      payment: {
        id: `pay_${Date.now()}`,
        ...paymentPayload
      },
      message: "Payment created successfully"
    };
  },

  async getVendors() {
    return {
      vendors: [],
      message: "Vendor list is ready for QuickBooks integration"
    };
  },

  async createVendor(vendorPayload) {
    return {
      vendor: {
        id: `ven_${Date.now()}`,
        ...vendorPayload
      },
      message: "Vendor created successfully"
    };
  }
};

export default qbApiService;
