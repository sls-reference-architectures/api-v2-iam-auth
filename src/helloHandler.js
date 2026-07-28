import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'api-v2-iam-auth-SUT' });

export const handler = async (event) => {
  logger.debug('Hello! I am protected by IAM.', { event });
};
