import {
  CloudFormationClient,
  DescribeStacksCommand,
  Stack,
} from '@aws-sdk/client-cloudformation';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.NODE_ENV || 'dev';

const setup = async () => {
  const testStackName = `ra-api-v2-iam-auth-TEST-${stage}`;
  const sutStackName = `ra-api-v2-iam-auth-SUT-${stage}`;

  const testStack = await getStack(testStackName);
  const sutStack = await getStack(sutStackName);

  process.env.TEST_API_URL = getApiUrl(testStack);
  process.env.SUT_API_URL = getApiUrl(sutStack);
  process.env.AWS_REGION = region;
  process.env.NODE_ENV = stage;
};

const getStack = async (stackName: string): Promise<Stack> => {
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

const getApiUrl = (stack: Stack) => (
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue
);

export default setup;
