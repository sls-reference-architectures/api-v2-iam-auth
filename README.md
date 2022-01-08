# api-v2-iam-auth

Project to demonstrate how to protect an API using IAM. This is a pattern for M2M where the client is either owned by the same team as the server, or has a similarly high-trust relationship (This is my current assessment; it may change as I work on this)

## The Layout
This project includes two APIs: one to act as our System Under Test (SUT) and the other to act as our test client. The SUT API has a route that uses `iam_auth`. The Test API has two routes: one that has permissions to invoke the SUT and one that does not. The e2e tests ensure that the routes succeed/fail as expected.

## To Deploy and Run
First, do whatever is necessary to have CLI access to your AWS account (you can quickly verify this with `aws s3 ls` or similar).

`$ npm ci`

`$ npx sls deploy --config serverless.sut.yml`

`$ npx sls deploy --config serverless.test.yml`

`$ npm run test:e2e`