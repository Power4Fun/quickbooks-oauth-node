import test from "node:test";
import assert from "node:assert/strict";
import qbAuthController from "../controllers/qbAuthController.js";

const makeResponse = () => ({
  statusCode: 200,
  jsonBody: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.jsonBody = body;
    return this;
  },
  send(body) {
    this.body = body;
    return this;
  }
});

test("returns stored QuickBooks tokens", async () => {
  const res = makeResponse();

  await qbAuthController.getStoredTokens({}, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.jsonBody && res.jsonBody.tokens);
  assert.ok("access_token" in res.jsonBody.tokens);
});
