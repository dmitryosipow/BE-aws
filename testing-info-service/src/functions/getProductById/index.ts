import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/product/{id}',
        description: 'Get product by id (ex. 7567ec4b-b10c-48c5-9345-fc73c48a80a3)',
      },
    },
  ],
};
