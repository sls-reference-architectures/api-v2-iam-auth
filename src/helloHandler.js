import Logger from '@dazn/lambda-powertools-logger';

export const handler = async (event) => {
  Logger.debug('Hello! I am protected by IAM.', { event });
};
