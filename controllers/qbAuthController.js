import qbTokenService from "../services/qbTokenService.js";

const qbAuthController = {
  async handleCallback(req, res) {
    try {
      const { code, realmId } = req.query;

      if (!code) {
        return res.status(400).send("Missing authorization code");
      }

      const tokenResponse = await qbTokenService.exchangeCodeForTokens(code, realmId);

      return res.json({
        message: "Tokens generated successfully",
        tokens: tokenResponse
      });

    } catch (error) {
      console.error("Callback Error:", error.response?.data || error.message);
      res.status(500).send("Error generating tokens");
    }
  }
};

export default qbAuthController;
