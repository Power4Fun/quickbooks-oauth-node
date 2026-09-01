import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import qbTokenService from "../services/qbTokenService.js";

const tokenDir = path.resolve("data");
const tokenFile = path.join(tokenDir, "qb_tokens.json");

test("persists tokens to disk and loads them back", () => {
  fs.rmSync(tokenDir, { recursive: true, force: true });

  const saved = qbTokenService.saveTokens({
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    realmId: "1234567890"
  });

  assert.deepEqual(saved, {
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    realmId: "1234567890"
  });

  const raw = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
  assert.deepEqual(raw, {
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    realmId: "1234567890"
  });

  const loaded = qbTokenService.loadTokens();
  assert.deepEqual(loaded, {
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    realmId: "1234567890"
  });
});
