import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              fileName: true
            }
          }
        },
        cors: true,
        authorizer: {
          arn: '${ssm:basicAuthorizer}',
          //name: "basicAuthorizer",
          resultTtlInSeconds: 0,
          //identitySource: "method.request.header.Authorization",
          type: 'token',
        },
      },
    },
  ],
};
