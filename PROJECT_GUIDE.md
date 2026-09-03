# QuickBooks OAuth Node.js Project Guide

This document explains the project, local development, Vercel deployment, QuickBooks OAuth, customer retrieval, the permanent token-storage solution, and prompts for creating the same type of integration for another company.

## 1. Project Purpose

This application connects a Node.js/Express API to QuickBooks Online using OAuth 2.0. It can:

- Start the QuickBooks authorization flow.
- Receive the OAuth callback.
- Exchange an authorization code for access and refresh tokens.
- Query QuickBooks customers.
- Create customers through the API route.
- Run locally or as a Vercel serverless application.

The current repository is an integration starter. Invoice, item, payment, and vendor services contain placeholder endpoints and should be implemented before using those resources in production.

## 2. Technology Stack

- Node.js with ES modules
- Express
- Axios for HTTP requests
- `qs` for OAuth form encoding
- `dotenv` for local environment variables
- `serverless-http` for Vercel
- Node's built-in test runner

## 3. Repository Structure

```text
server.js                       Local Express entrypoint
api/index.js                    Vercel serverless entrypoint
controllers/qbAuthController.js OAuth login and callback handlers
controllers/qbCustomerController.js Customer HTTP handlers
services/qbTokenService.js      OAuth token exchange and token storage
services/qbApiService.js        QuickBooks API calls
routes/customers.js             Customer routes
routes/invoices.js              Invoice routes
routes/items.js                 Item routes
routes/payments.js              Payment routes
routes/vendors.js               Vendor routes
data/qb_tokens.json             Local-only token file
vercel.json                     Vercel routing configuration
tests/                          Node test files
```

## 4. Install and Run Locally

Prerequisites:

- Node.js 20 or later
- A QuickBooks Developer account
- A QuickBooks app with OAuth credentials

Install dependencies:

```bash
npm install
```

Run the local server:

```bash
npm start
```

The local health endpoint is:

```text
http://localhost:3000/
```

Run tests:

```bash
npm test
```

## 5. Environment Variables

Create a local `.env` file. Never commit it.

```env
CLIENT_ID=your-intuit-client-id
CLIENT_SECRET=your-intuit-client-secret
REDIRECT_URI=http://localhost:3000/oauth/callback
ENVIRONMENT=sandbox
```

For production, use the stable Vercel domain and register the exact same URI in the Intuit Developer Portal:

```env
REDIRECT_URI=https://quickbooks-oauth-node.vercel.app/oauth/callback
ENVIRONMENT=production
```

The redirect URI must match exactly, including protocol, hostname, path, and trailing slash behavior.

## 6. OAuth Flow

1. Open `/oauth/login`.
2. The application redirects to Intuit.
3. The user grants access to the QuickBooks company.
4. Intuit redirects to `/oauth/callback?code=...&realmId=...`.
5. The server exchanges the one-time authorization code for tokens.
6. The server stores the access token, refresh token, and realm ID.
7. API calls use the access token.
8. When the access token expires, the refresh token is exchanged for a new token.

Start production authorization here:

```text
https://quickbooks-oauth-node.vercel.app/oauth/login
```

The callback must be:

```text
https://quickbooks-oauth-node.vercel.app/oauth/callback
```

Authorization codes are short-lived and single-use. Always start a new login flow when testing a failed callback.

## 7. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Health check |
| GET | `/oauth/login` | Start Intuit OAuth |
| GET | `/oauth/callback` | Receive and exchange the authorization code |
| GET | `/oauth/tokens` | Development diagnostic for stored token metadata |
| GET | `/api/customers` | Retrieve QuickBooks customers |
| POST | `/api/customers` | Create a QuickBooks customer |
| GET | `/api/invoices` | Invoice placeholder route |

Customer query example:

```text
https://quickbooks-oauth-node.vercel.app/api/customers
```

The underlying QuickBooks query is equivalent to:

```text
select * from Customer
```

## 8. Permanent Production Solution

### Why the current file approach is not permanent

Vercel serverless functions have a read-only deployment filesystem. Runtime writes to `data/qb_tokens.json` fail with `EROFS`. Even in-memory storage can disappear when Vercel creates a new function instance. Therefore, tokens must be stored in an external persistent database.

### Recommended database

Use Supabase Postgres, Neon, Vercel Postgres, or another managed PostgreSQL provider. A free tier is normally enough for one small integration. Charges depend on the provider's limits, storage, bandwidth, and uptime requirements; QuickBooks API access itself does not require a paid QuickBooks plan for ordinary developer testing.

### Token table

Create a table similar to:

```sql
create table quickbooks_tokens (
  company_key text primary key,
  access_token text not null,
  refresh_token text not null,
  realm_id text not null,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  updated_at timestamptz not null default now()
);
```

For multiple companies, use a separate `company_key` for each tenant or authenticated application user. Do not use one global token row for unrelated companies.

### Required application changes

Replace file-based `loadTokens()` and `saveTokens()` with database operations:

- `getTokens(companyKey)` reads the row.
- `saveTokens(companyKey, tokens)` inserts or updates the row.
- `refreshAccessToken(companyKey)` reads the current refresh token, calls Intuit, and atomically saves the rotated refresh token.
- The callback determines the company/user that initiated OAuth and stores the returned `realmId` with that owner.
- Customer requests load tokens for the authenticated company.

Use a database client that supports connection reuse in serverless functions. Keep the database URL in Vercel environment variables.

### Production environment variables

```text
CLIENT_ID
CLIENT_SECRET
REDIRECT_URI
DATABASE_URL
ENVIRONMENT
SESSION_SECRET
```

Use Vercel's Production environment for these values. Do not place access tokens, refresh tokens, or client secrets in source control, logs, screenshots, or public API responses.

### Security requirements

- Rotate any client secret exposed in logs or screenshots.
- Revoke and reauthorize any refresh token that may have been exposed.
- Remove token response logging from production.
- Protect `/oauth/tokens` or remove it after debugging.
- Add OAuth `state` validation to prevent login CSRF.
- Associate `state` with a short-lived server-side session or signed value.
- Encrypt tokens at rest when the database provider or application architecture requires it.
- Return generic error messages to clients and keep detailed provider errors in protected logs.
- Add authentication and authorization before exposing customer data to users.

## 9. Vercel Deployment

From the repository root:

```bash
vercel login
vercel link
vercel env add CLIENT_ID production
vercel env add CLIENT_SECRET production
vercel env add REDIRECT_URI production
vercel env add DATABASE_URL production
vercel --prod
```

Verify the deployment:

```text
https://quickbooks-oauth-node.vercel.app/
https://quickbooks-oauth-node.vercel.app/oauth/login
https://quickbooks-oauth-node.vercel.app/api/customers
```

Use one stable production domain consistently. Do not switch between localhost, preview deployment URLs, old deployment URLs, and a custom domain during the same OAuth test.

## 10. Troubleshooting

### Intuit says `redirect_uri` is invalid

The URI sent by the application is not listed exactly in the Intuit app credentials. Compare the encoded `redirect_uri` in `/oauth/login` with the Redirect URI in Intuit.

### Callback returns `Error generating tokens`

Check Vercel logs. Common causes:

- Wrong client ID or client secret.
- Wrong sandbox/production environment.
- Redirect URI mismatch.
- Authorization code already used or expired.
- Database credentials missing.
- Attempting to write to Vercel's filesystem.

### Customer endpoint returns QuickBooks error `3200` or `401`

The access token is invalid, expired, belongs to another environment, belongs to another company, or was replaced by a token rotation. Start a new OAuth flow and verify that the returned `realmId` is stored with the new token.

### Customer endpoint returns Vercel `404`

The request is not reaching Express. Check `vercel.json`, the Vercel project root directory, and the deployed route mapping.

### Customer endpoint returns `200` with an empty list

Check whether the QuickBooks company actually contains customers and whether the selected company is the intended company. Also inspect the provider response without exposing tokens.

## 11. Suggested Production Test Checklist

- [ ] Intuit app environment is selected correctly.
- [ ] Production redirect URI is registered exactly.
- [ ] Vercel environment variables are set for Production.
- [ ] A fresh OAuth login succeeds.
- [ ] Callback stores tokens in the database.
- [ ] Refresh flow updates rotated refresh tokens.
- [ ] `/api/customers` returns real QuickBooks data.
- [ ] A cold start still retrieves tokens from the database.
- [ ] OAuth state validation is enabled.
- [ ] Secrets and tokens are absent from logs and Git history.
- [ ] API authentication protects company data.

## 12. Reusable Prompts for Another Company

Replace the bracketed values before using these prompts.

### Prompt A: Generate the project

```text
Create a Node.js 20+ ES module project using Express and Axios for a [COMPANY_NAME] integration with [PROVIDER_NAME]. The application must use OAuth 2.0, support local development and Vercel serverless deployment, and expose a health endpoint, OAuth login endpoint, OAuth callback endpoint, and [RESOURCE_NAME] GET/POST API endpoints.

Use this configuration:
- Provider: [PROVIDER_NAME]
- OAuth authorization URL: [AUTHORIZATION_URL]
- OAuth token URL: [TOKEN_URL]
- API base URL: [API_BASE_URL]
- OAuth scopes: [SCOPES]
- Production callback: https://[VERCEL_DOMAIN]/oauth/callback
- Local callback: http://localhost:3000/oauth/callback

Create a clean folder structure with server.js, api/index.js, routes, controllers, services, tests, and README documentation. Use environment variables for all credentials. Do not hardcode secrets or log token responses.
```

### Prompt B: Add permanent token storage

```text
Update this OAuth integration for production on Vercel. Replace all JSON-file and in-memory token storage with PostgreSQL using DATABASE_URL. Create a migration for a [TOKEN_TABLE_NAME] table containing company_key, access_token, refresh_token, realm_id, access_token_expires_at, refresh_token_expires_at, and updated_at.

Implement getTokens(companyKey), saveTokens(companyKey, tokens), and refreshAccessToken(companyKey). Preserve rotated refresh tokens returned by the provider. Make database connections serverless-safe. Update the OAuth callback to associate tokens with the company or user that initiated OAuth. Add focused tests for insert, update, refresh-token rotation, and cold-start retrieval. Do not print secrets in logs.
```

### Prompt C: Add a resource endpoint

```text
Add a [RESOURCE_NAME] service and Express route to the existing OAuth project. Use the stored token for [COMPANY_KEY], call [PROVIDER_RESOURCE_ENDPOINT], and implement GET [ROUTE]. Add POST [ROUTE] if creation is supported. Handle expired access tokens by refreshing once and retrying the request. Return provider errors in a sanitized format. Add tests for success, missing authorization, token refresh, provider 401, and empty results.
```

### Prompt D: Configure deployment

```text
Prepare this [COMPANY_NAME] OAuth API for Vercel. Ensure the serverless entrypoint is present, route mapping works for all API paths, and no code writes to the deployment filesystem. Provide the exact Vercel environment variables and commands for Production and Preview. Use the stable domain https://[VERCEL_DOMAIN]. Update the provider OAuth redirect URI to https://[VERCEL_DOMAIN]/oauth/callback. Run the test suite, deploy with Vercel CLI, and verify the health, OAuth login, callback, and [RESOURCE_ROUTE] endpoints.
```

### Prompt E: Debug an OAuth failure

```text
Debug this OAuth error without exposing credentials: [PASTE_ERROR]. Inspect the generated redirect_uri, provider environment, client credential names, callback route, token exchange payload, database storage, and API base URL. Identify one root cause, make the smallest code/configuration change, run focused tests, and report the exact next user action. Never print access tokens, refresh tokens, client secrets, authorization codes, or full authorization URLs containing sensitive values.
```

## 13. Company-Specific Values to Collect

Before generating a new integration, collect:

- Company name and internal tenant identifier.
- Provider and API version.
- Sandbox and production environments.
- OAuth authorization and token URLs.
- Required scopes.
- API resource endpoints.
- Stable production domain.
- Database provider and connection string.
- User authentication model.
- Data retention and token encryption requirements.

The implementation pattern stays the same, but provider URLs, scopes, resource schemas, token rotation behavior, and compliance requirements must be verified from that provider's current documentation.
