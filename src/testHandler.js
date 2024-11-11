import Logger from '@dazn/lambda-powertools-logger';
import aws4Interceptor from 'aws4-axios';
import axios from 'axios';

const handler = async (event) => {
  Logger.debug('Calling IAM protected endpoint', { event });
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
  Logger.debug('Finished with axios call', { status });

  return {
    statusCode: status,
    body: 'Done',
  };
};

export default handler;
