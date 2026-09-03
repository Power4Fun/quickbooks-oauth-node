async function getCustomers() {
  const { access_token, realmId } = await qbTokenService.getTokens();

  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select * from Customer`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json"
    }
  });

  return response.data;
}

async function createCustomer(payload) {
  const { access_token, realmId } = await qbTokenService.getTokens();

  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/customer`;

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  return response.data;
}

// ensure these are exported:
const qbApiService = {
  // ...other methods
  getCustomers,
  createCustomer
};

export default qbApiService;
