import axios from "axios";
import qbTokenService from "./qbTokenService.js";

const getCompanyUrl = (realmId, resource) =>
  `https://quickbooks.api.intuit.com/v3/company/${realmId}/${resource}`;

async function queryResource(resource, label) {
  const { access_token, realmId } = qbTokenService.getTokens();

  if (!access_token || !realmId) {
    return {
      QueryResponse: { [resource]: [] },
      message: "No QuickBooks token or realm is stored yet. Complete OAuth first."
    };
  }

  const query = encodeURIComponent(`select * from ${resource}`);

  try {
    const response = await axios.get(
      getCompanyUrl(realmId, `query?query=${query}`),
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    return {
      QueryResponse: { [resource]: [] },
      status: "unauthorized",
      message: `QuickBooks rejected the stored token while loading ${label}. Re-run OAuth.`,
      details: error.response?.data || error.message
    };
  }
}

async function createResource(resource, payload, label) {
  const { access_token, realmId } = qbTokenService.getTokens();

  if (!access_token || !realmId) {
    throw new Error("No QuickBooks token or realm is stored yet. Complete OAuth first.");
  }

  try {
    const response = await axios.post(getCompanyUrl(realmId, resource), payload, {
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
      message: `QuickBooks rejected the stored token while creating ${label}. Re-run OAuth.`,
      details: error.response?.data || error.message
    };
  }
}

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
  getInvoices: () => queryResource("Invoice", "invoices"),
  createInvoice: (payload) => createResource("invoice", payload, "invoices"),
  getItems: () => queryResource("Item", "items"),
  createItem: (payload) => createResource("item", payload, "items"),
  getPayments: () => queryResource("Payment", "payments"),
  createPayment: (payload) => createResource("payment", payload, "payments"),
  getVendors: () => queryResource("Vendor", "vendors"),
  createVendor: (payload) => createResource("vendor", payload, "vendors")
};

export default qbApiService;
