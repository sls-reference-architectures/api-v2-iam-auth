# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                    # lint + unit tests
npm run lint                # ESLint check
npm run lint:fix            # ESLint auto-fix
npm run deploy:sut          # deploy the System Under Test stack
npm run deploy:test.stack   # deploy the test-client stack (reads SUT's CF outputs)
npm run test:e2e            # e2e tests against both deployed stacks
npm run remove:sut          # tear down the SUT stack
npm run remove:test.stack   # tear down the test-client stack
```

To run a single test file:

```bash
npx jest test/identity.unit.test.js
```

Deploy order matters: `deploy:sut` must run before `deploy:test.stack`, since the test stack's
IAM role statement references the SUT's API Gateway ID via a CloudFormation cross-stack lookup
(`${cf:api-v2-iam-auth-SUT-${stage}.HttpApiId}`). Teardown runs in reverse: `test.stack` first,
then `sut`.

## Architecture

This project demonstrates protecting an AWS HTTP API with `aws_iam` authorization for
machine-to-machine (M2M) calls, where the caller and the API are owned by the same team or have a
similarly high-trust relationship.

**Two independent Serverless Framework stacks, not one:**

- **`serverless.sut.yml`** (`api-v2-iam-auth-SUT`) — the System Under Test. One route,
  `GET /hello` (`src/helloHandler.js`), authorized with `aws_iam`.
- **`serverless.test.yml`** (`api-v2-iam-auth-TEST`) — the test client. Two routes backed by the
  same `src/testHandler.js`: `/allowed`, which has an `iamRoleStatements` grant
  (`execute-api:Invoke`) scoped to the SUT's `GET /hello` route, and `/disallowed`, which has no
  such grant. Uses `serverless-iam-roles-per-function` to scope the grant to a single function
  rather than the whole stack's execution role.

**e2e test** (`test/verifyIamAuth.e2e.test.js`) calls both TEST-stack routes over HTTP and asserts
`/allowed` returns 200 (the downstream SigV4-signed call to the SUT succeeds) while `/disallowed`
returns 403 (IAM denies the call). `test/jest.setup.js` (`jest.config.e2e.js`'s `globalSetup`)
resolves both stacks' API URLs from live CloudFormation `DescribeStacks` output before the tests
run — nothing is hardcoded.

**No int tier** — only unit (`test/identity.unit.test.js`) and e2e; there's no service layer to
test in isolation between the two.

## Known constraints

- `osls` (community fork) is the deploy tool, not the official `serverless` package — see the
  fleet-wide note on `licenseKey` requirements in `javascript-template-sls`'s CLAUDE.md.
- CI (`.github/workflows/ci.yml`) runs unit tests, deploys SUT, deploys TEST, runs e2e, then tears
  down TEST and SUT in that order, on every push to `master` and on a weekday cron.
