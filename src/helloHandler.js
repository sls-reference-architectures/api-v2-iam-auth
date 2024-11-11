import Logger from '@dazn/lambda-powertools-logger';

const handler = async (event) => {
  Logger.debug('Hello! I am protected by IAM.', { event });
};

export default handler;
