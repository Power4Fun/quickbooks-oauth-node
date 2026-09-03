import axios from "axios";
import qbTokenService from "./qbTokenService.js";

async function getCustomers() {
  const { access_token, realmId } = qbTokenService.getTokens();

  if (!access_token || !realmId) {
    return {
      QueryResponse: {
        Customer: []
      },
      message: "No QuickBooks token or realm is stored yet. Complete OAuth first."
    };
  }

  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select * from Customer`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json"
      }
    });

    return response.data;
  } catch (error) {
    return {
      QueryResponse: {
        Customer: []
      },
      status: "unauthorized",
      message: "QuickBooks rejected the stored token. Re-run OAuth to refresh the access token and realm.",
      details: error.response?.data || error.message
    };
  }
}

async function createCustomer(payload) {
  const { access_token, realmId } = qbTokenService.getTokens();

  if (!access_token || !realmId) {
    throw new Error("No QuickBooks token or realm is stored yet. Complete OAuth first.");
  }

  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/customer`;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    return {
      status: "unauthorized",
      message: "QuickBooks rejected the stored token. Re-run OAuth to refresh the access token and realm.",
      details: error.response?.data || error.message
    };
  }
}

const qbApiService = {
  getCustomers,
  createCustomer,
  async getInvoices() {
    return { invoices: [], message: "Invoice service ready" };
  },
  async createInvoice(invoicePayload) {
    return { invoice: invoicePayload, message: "Invoice created stub" };
  },
  async getItems() {
    return { items: [], message: "Item service ready" };
  },
  async createItem(itemPayload) {
    return { item: itemPayload, message: "Item created stub" };
  },
  async getPayments() {
    return { payments: [], message: "Payment service ready" };
  },
  async createPayment(paymentPayload) {
    return { payment: paymentPayload, message: "Payment created stub" };
  },
  async getVendors() {
    return { vendors: [], message: "Vendor service ready" };
  },
  async createVendor(vendorPayload) {
    return { vendor: vendorPayload, message: "Vendor created stub" };
  }
};

export default qbApiService;
