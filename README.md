# frogbot-demo-scan-pr

Demo repo for **`frogbot scan-pull-request`**.

`main` starts clean. A prepared branch called **`introduce-vulnerabilities`**
adds vulnerable dependencies, insecure code, hardcoded secrets, and misconfigured
Terraform. Open a PR from that branch into `main` and Frogbot will post review
comments on the diff.

## Branches

- `main` — clean baseline (`flask 3.0.3`, `express 4.19.2`, no SAST issues, no secrets, no IaC).
- `introduce-vulnerabilities` — the PR payload. Same categories as `frogbot-demo-scan-repo`:
  - SCA: `flask 0.12.3`, `pyyaml 5.1`, `lodash 4.17.11`, `handlebars 4.0.13`, etc.
  - SAST: SQL injection, SSTI, `eval`, `subprocess(shell=True)`, prototype pollution, MD5 for auth, insecure RNG.
  - Secrets: AWS keys, DB password, Slack webhook, GitHub PAT, Stripe-style key.
  - IaC: public S3, SG open to `0.0.0.0/0`, unencrypted RDS.

## How to run the demo

1. Push both branches to your GitHub org.
2. Open a PR: `introduce-vulnerabilities` → `main`. Note the PR number.
3. From a CI job (or locally):

```bash
export JF_URL=https://<your>.jfrog.io
export JF_ACCESS_TOKEN=...
export JF_GIT_PROVIDER=github
export JF_GIT_OWNER=<you>
export JF_GIT_REPO=frogbot-demo-scan-pr
export JF_GIT_TOKEN=<gh_pat>
export JF_GIT_BASE_BRANCH=main
export JF_GIT_PULL_REQUEST_ID=<the PR number>

frogbot scan-pull-request
```

Frogbot will download both branch archives to temp dirs, diff-scan them, and
comment only on issues **introduced by the PR** — the clean baseline suppresses
noise.
