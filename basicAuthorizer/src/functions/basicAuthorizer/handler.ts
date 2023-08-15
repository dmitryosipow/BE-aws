import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';

enum Effect {
  Allow = 'Allow',
  Deny = 'Deny'
}

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log('basicAuthorizer', event);
  const b64auth = event.authorizationToken.split(' ')[1] ?? '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString('utf-8').split(':');
  console.log(login, password);
  if (!login || !password) {
    throw new Error('Unauthorized');
  }
  const storedUserPassword = process.env[login];
  const authorized = (storedUserPassword === password && storedUserPassword) ? Effect.Allow : Effect.Deny;
  console.log(authorized)

  const authResponse = {
    principalId: event.authorizationToken,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: "execute-api:Invoke",
        Resource: [
          event.methodArn
        ],
        Effect: authorized
      }
      ]
    }
  }
  console.log(authResponse);
  return Promise.resolve(authResponse);
};

export const main = basicAuthorizer;
