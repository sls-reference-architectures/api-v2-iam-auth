import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import axios from 'axios';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.NODE_ENV || 'dev';

const setup = async () => {
  const testStackName = `api-v2-iam-auth-TEST-${stage}`;
  const sutStackName = `api-v2-iam-auth-SUT-${stage}`;

  const testStack = await getStack(testStackName);
  const sutStack = await getStack(sutStackName);
  const testApiUrl = getApiUrl(testStack);
  const sutApiUrl = getApiUrl(sutStack);
  await Promise.all([
    waitForApiReady({ apiUrl: testApiUrl, path: '/allowed' }),
    waitForApiReady({ apiUrl: sutApiUrl, path: '/hello' }),
  ]);

  process.env.TEST_API_URL = testApiUrl;
  process.env.SUT_API_URL = sutApiUrl;
  process.env.AWS_REGION = region;
  process.env.NODE_ENV = stage;
};

const getStack = async (stackName) => {
  const cf = new CloudFormationClient({ region });
  const stackResult = await cf.send(
    new DescribeStacksCommand({
      StackName: stackName,
    }),
  );
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find CF stack with name ${stackName}`);
  }

  return stack;
};

const getApiUrl = (stack) => stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;

/**
 * A freshly created HTTP API answers 404 for a few seconds while its routes and
 * stage propagate (this happens on the first deploy after the weekly teardown).
 * Poll until the API stops returning 404 so the E2E suites don't race the deploy.
 * Any other status (e.g. 403 from the IAM authorizer) means the route is live.
 */
const waitForApiReady = async ({ apiUrl, path, timeoutMs = 60000, intervalMs = 2000 }) => {
  const deadline = Date.now() + timeoutMs;
  let status;
  do {
    ({ status } = await axios.get(path, { baseURL: apiUrl, validateStatus: () => true }));
    if (status !== 404) {
      return status;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  } while (Date.now() < deadline);

  throw new Error(`API at ${apiUrl}${path} still returned 404 after ${timeoutMs}ms`);
};

export default setup;
