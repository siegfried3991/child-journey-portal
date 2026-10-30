# Complete private portal on your own Cloudflare account

Status: deployment support prepared; no independent production account/resources or data migration yet. The existing Sites portal is unchanged. GitHub stores source only; this is not a GitHub Pages deployment.

## Owner setup

1. Create and verify your account at https://dash.cloudflare.com/sign-up. The account owner accepts the terms personally. Review any plan or billing prompt before accepting; no paid plan or domain purchase is assumed.
2. Enable Workers and create a D1 database and a **private** R2 bucket. R2 activation may require billing setup; do not proceed with an unapproved charge. Do not enable an R2 public URL.
3. In Cloudflare One, create a team and an Access self-hosted application protecting the complete Worker hostname, all paths. Enable email one-time PIN, include only your chosen parent email and use a session duration of at most 24 hours. No Bypass/Everyone policy. Record its team URL and Application Audience (AUD). Workers.dev can be used when supported by the account's Access integration; if the dashboard requires a custom hostname, resolve that requirement before deployment. Do not buy a domain automatically.
4. In GitHub Settings → Environments, create `cloudflare-production`. Add an approval requirement if the account/plan supports it. Use only the main branch for production. Keep `CLOUDFLARE_DEPLOY_ENABLED` unset until the login boundary is ready.
5. Create an account-scoped Cloudflare API token restricted to the selected account: Workers Scripts Edit, D1 Edit, Workers R2 Storage Edit (and Account Settings Read only if required for account discovery). Store it as a GitHub environment secret, never in chat, source files or a command argument.

## GitHub configuration

Repository variable `CLOUDFLARE_DEPLOY_ENABLED`: `true` only after the following settings are complete. Deployment is skipped while absent.

Environment variables:

| Name | Value |
| --- | --- |
| CF_WORKER_NAME | Your chosen Worker name, e.g. child-journey-private |
| CF_R2_BUCKET | Existing private bucket name |

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

Run **Actions → Deploy complete private portal → Run workflow**. The workflow runs domain/security checks, builds a dedicated standalone entry, applies versioned D1 migrations, then deploys the built Worker and assets. Subsequent main-branch pushes redeploy when the enable flag is true. Never run two independent build systems against this Worker.

## Runtime and authentication

- `vite.cloudflare.config.ts` uses the same ERP UI/API and database schema through a separate Worker entry. It does not use the Sites mock identity plugin.
- `worker/cloudflare.ts` validates a signed Access JWT before serving any route; the generated config sets `assets.run_worker_first=true` and disables preview URLs. Invalid/missing credentials return 403, even if the Access edge policy is accidentally absent.
- Verification checks the configured issuer, specific application audience, RS256 signature, expiry, age and owner allowlist. All client-provided `oai-authenticated-*` headers are removed before the verified identity is supplied to existing ERP handlers.
- Incomplete configuration denies access. The deployment token is a GitHub secret, not an app runtime variable. No import-service secret is configured by default.
- The generated `.cloudflare/wrangler.json` contains private settings and is ignored. Do not upload it or build archives to GitHub artifacts.

## Migration and completion criteria

New D1/R2 resources are empty. A successful deployment does not transfer the existing Sites data. Keep the old portal available and do not delete or modify its database during preparation.

After validating private login, use a private export/import operation to transfer records, revision history and binary attachments. The existing UI JSON export is **not a full backup**: it omits history and binaries. A full migration tool/reconciliation run is still required. Preserve record/file IDs, owner/workspace mapping, relationships, file metadata, SHA-256 checksums and revisions. Store transfer files outside Git; do not send them as build artifacts.

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
