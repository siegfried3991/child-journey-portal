# Complete private portal on your own Cloudflare account

Status: the independent deployment profile has been validated, including private login, database/file migration and readback. Each new installation still needs its own account configuration and reconciliation. Keep the previous portal available for rollback. GitHub stores source only; this is not a GitHub Pages deployment.

## Owner setup

1. Create and verify your account at https://dash.cloudflare.com/sign-up. The account owner accepts the terms personally. Review any plan or billing prompt before accepting; no paid plan or domain purchase is assumed.
2. Stay on Workers Free and create a D1 database. The standalone profile stores small evidence files privately in D1; do not activate R2 or a usage-billed subscription. The app caps individual files at 10 MB and evidence at 64 MB per database. On quota exhaustion uploads stop; no automatic upgrade.
3. In Cloudflare One, create a team and an Access self-hosted application protecting the complete Worker hostname, all paths. Enable email one-time PIN, include only your chosen parent email and use a session duration of at most 24 hours. No Bypass/Everyone policy. Record its team URL and Application Audience (AUD). Workers.dev can be used when supported by the account's Access integration; if the dashboard requires a custom hostname, resolve that requirement before deployment. Do not buy a domain automatically.
4. In GitHub Settings → Environments, create `cloudflare-production`. Add an approval requirement if the account/plan supports it. Use only the main branch for production. Keep `CLOUDFLARE_DEPLOY_ENABLED` unset until the login boundary is ready.
5. Create an account-scoped Cloudflare API token restricted to the selected account: Workers Scripts Edit and D1 Edit (and Account Settings Read only if required for account discovery). Store it as a GitHub environment secret, never in chat, source files or a command argument.

## GitHub configuration

Repository variable `CLOUDFLARE_DEPLOY_ENABLED`: `true` only after the following settings are complete. Deployment is skipped while absent.

Environment variables:

| Name | Value |
| --- | --- |
| CF_WORKER_NAME | Your chosen Worker name, e.g. child-journey-private |

Environment secrets:

| Name | Value |
| --- | --- |
| CLOUDFLARE_ACCOUNT_ID | Your Cloudflare account ID |
| CLOUDFLARE_API_TOKEN | Restricted deployment token |
| CF_D1_DATABASE_ID | ID of the new D1 database |
| CF_ACCESS_TEAM_DOMAIN | https://your-team.cloudflareaccess.com, no trailing slash |
| CF_ACCESS_AUD | Audience of this specific Access application |
| ERP_OWNER_EMAILS | Comma-separated verified parent emails; keep one owner for initial rollout |
| ERP_WORKSPACE_ID | New opaque stable workspace namespace; keep stable after import |

The first email is the primary owner mapped to the shared import namespace. Additional allowed emails have separate data spaces; this is not yet a family-sharing implementation.

Run **Actions → Deploy complete private portal → Run workflow**. The workflow runs domain/security checks, builds a dedicated standalone entry, applies versioned D1 migrations (including chunked evidence storage), then deploys the built Worker and assets. Subsequent main-branch pushes redeploy when the enable flag is true. Never run two independent build systems against this Worker.

## Free plan boundaries

Workers and D1 must remain on their Free plans; platform quotas stop requests/queries instead of authorizing paid overages. No R2, paid Worker plan, paid domain or other usage-billed add-on is required by this profile. Cloudflare Access has a Free plan, but the account onboarding inspected on 30 October 2026 requires payment details, agreement to terms and authorization to charge for excess usage. Activation is handled by the account owner; automation does not accept billing terms. No subscription activation or payment authorization is assumed. An alternative GitHub sign-in adapter is proposed if the owner declines Access onboarding; it is not yet implemented in this source revision. Check actual SSR/JWT CPU use on the free Worker before migration; local builds are not evidence that all free production runtime limits are met.

D1 chunks each evidence file into 256 KiB rows, verifies SHA-256 on download, refuses same-key content replacement, and reserves quota plus chunks in a single transaction. This is intended for a small family collection, not large media storage.

## Runtime and authentication

- `vite.cloudflare.config.ts` uses the same ERP UI/API and database schema through a separate Worker entry. Existing Sites deployments can continue using R2; the independent profile sets `ERP_EVIDENCE_STORAGE=d1` and has no R2 binding. It does not use the Sites mock identity plugin.
- `worker/cloudflare.ts` guards all ERP routes, APIs and assets with a server-side session. Anonymous API calls return 401; page requests redirect to `/login`. Signed Cloudflare Access JWTs are accepted only at `/owner-login` as an owner bootstrap/recovery route. The generated config sets `assets.run_worker_first=true` and disables preview URLs.
- Verification checks the configured issuer, specific application audience, RS256 signature, expiry, age and owner allowlist. All client-provided `oai-authenticated-*` headers are removed before the verified identity is supplied to existing ERP handlers.
- Incomplete configuration denies access. The deployment token is a GitHub secret, not an app runtime variable. No import-service secret is configured by default.
- The generated `.cloudflare/wrangler.json` contains private settings and is ignored. Do not upload it or build archives to GitHub artifacts.

## Migration and completion criteria

New D1 resources are empty. A successful deployment does not transfer the existing Sites data. Keep the old portal available and do not delete or modify its database during preparation.

After validating private login, use a private export/import operation to transfer records, revision history and binary attachments. The existing UI JSON export is **not a full backup**: it omits history and binaries. Perform a complete migration and reconciliation; do not substitute a partial UI export. Preserve record/file IDs, owner/workspace mapping, relationships, file metadata, SHA-256 checksums and revisions. Transfer existing binary evidence into D1 using the private evidence adapter; verify it fits the 64 MB evidence budget first. Store transfer files outside Git; do not send them as build artifacts.

Before switching the family to the new URL:

- Anonymous access, spoofed headers, wrong audience and wrong-owner accounts fail on pages, APIs and attachment URLs.
- Authorized owner can sign in, read school records, hover trend points, save and reload a synthetic record and retrieve an authorized attachment.
- Verify the entire migrated record/revision/file inventory and every attachment checksum against the original; spot-check G7/G8/G9/Q1/YTD displays.
- Verify logout, backup/restore on a non-production copy, and phone/WeChat login and file handling.
- State the new verified URL only after these checks. Do not call the deployment or migration complete until the account, resources, runtime checks and reconciliation pass.

## Local validation

Use Node 24 and `npm ci`. Configure the listed environment settings locally without committing them, then run:

```sh
npm run cloudflare:configure
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.ts
npm run cloudflare:build
npx wrangler deploy --dry-run --config dist/server/wrangler.json
```

Do not use the existing `npm run dev` mock profile as proof of standalone production authentication. Unit tests cover signed JWT acceptance/rejection, not a live Cloudflare Access account.

## Primary references

- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/workers/static-assets/routing/worker-script/


## Username/password access

Apply `drizzle/0002_portal_accounts.sql` before deploying this version. First deploy the Worker while the existing Cloudflare Access gate still covers production. Verify `/owner-login` creates an owner session and `/account` opens. Then scope the existing Access application to the **exact production hostname plus `/owner-login`**, with the existing owner-only policy; keep preview Worker URLs protected. Production routes outside `/owner-login` use application sessions. Do not simply remove the owner recovery destination. Verify anonymous `/login` returns 200, `/api/erp` and attachment APIs return 401, and `/owner-login` redirects to Cloudflare Access.

The owner opens `/owner-login` → `/account`, chooses their own username and password, and creates invited viewer accounts. There is no registration endpoint. Viewers can read all records and attachments in this family workspace, but cannot change records, import, upload or administer users. Do not use this version for per-child or per-course sharing. Password reset is performed by the owner; owner recovery uses Cloudflare Access. No outgoing email service or paid product is required.

Passwords use native `node:crypto` scrypt (N=32768, r=8, p=3, 32 MiB; per-user random salt), not plaintext or reversible encryption. Password length is 14–128 characters. Sessions use random 256-bit bearer tokens, only SHA-256 digests in D1, Secure/HttpOnly/SameSite=Lax host-only cookies, 12-hour absolute and one-hour idle expiry. Disabling or resetting an invited account revokes its sessions immediately. New/reset viewer passwords must be changed before access. Self-service password changes require the current password, except a freshly authenticated Cloudflare owner during a 15-minute recovery window. Mutation endpoints require exact same Origin; authentication pages have a restrictive CSP. Login limits are enforced in D1 per username, IP and globally over fixed 15-minute windows. These limits can cause a temporary lockout; the owner recovery path stays available.

Check `tests/password-auth.test.ts` alongside the existing auth/domain suites. Live smoke tests should cover native scrypt on the Free Worker, first-login change, viewer denial, owner recovery, logout and anonymous API denial. Keep test accounts temporary and revoke/remove them after verification. Never put real account credentials or session values in the repository.

References: [Cloudflare native crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/), [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
