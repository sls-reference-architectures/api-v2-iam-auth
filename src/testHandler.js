import { Logger } from '@aws-lambda-powertools/logger';
import aws4Interceptor from 'aws4-axios';
import axios from 'axios';

const logger = new Logger({ serviceName: 'api-v2-iam-auth-TEST' });

export const handler = async (event) => {
  logger.debug('Calling IAM protected endpoint', { event });
  const options = {
    baseURL: process.env.SUT_API_URL,
    validateStatus: () => true,
  };
  const interceptor = aws4Interceptor({
    options: {
      region: 'us-east-1',
      service: 'execute-api',
    },
  });
  axios.interceptors.request.use(interceptor);
  const { status } = await axios.get('/hello', options);
  logger.debug('Finished with axios call', { status });

  return {
    statusCode: status,
    body: 'Done',
  };
};
