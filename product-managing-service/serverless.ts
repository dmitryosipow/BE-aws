import type { AWS } from '@serverless/typescript';

import { getProducts, getProductById, createProduct, catalogBatchProcess } from './src/functions/';

const serverlessConfiguration: AWS = {
  service: 'product-managing-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCT_TABLE: 'Product',
      STOCKS_TABLE: 'Stocks',
      SQS_URL: {
        Ref: "catalogueItemsQueue"
      },
      SNS_ARN: {
        Ref: "SNSTopic"
      },
      database: 'SQL',
      db_host     : '${env:db_host}',
      db_user     : '${env:db_user}',
      db_password : '${env:db_password}',
      db_port     : '${env:db_port}',
      db_database : '${env:db_database}',
      catalogueItemsQueueUrl: { Ref: 'catalogueItemsQueue' }
    }/*,
    vpc: {
      securityGroupIds: ['sg-07c9cb356bf9b533a'],
      subnetIds: ['subnet-031cbd1654613ba94', 'subnet-0952574a7bd296303']
    }*/,
    httpApi: {
      cors: {
        allowedOrigins: ['http://localhost:3000', 'https://d1k0a3yefk9g4c.cloudfront.net']
      },
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: ["arn:aws:dynamodb:eu-west-1:*:table/Product", "arn:aws:dynamodb:eu-west-1:*:table/Stocks"],
        },
        {
          Effect: "Allow",
          Action: [
            "sns:Publish"
          ],
          Resource: [{
            Ref: 'SNSTopic'
          }],
        }],
      },
    },
  },
  resources: {
    Resources: {
      catalogueItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      myAppSSMParameterQueueName: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Name: 'catalogItemsQueueUrl',
          Type: 'String',
          Value: { Ref: 'catalogueItemsQueue' }
        }
      },
      myAppSSMParameterQueueArn: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Name: 'catalogItemsQueueArn',
          Type: 'String',
          Value: { "Fn::GetAtt": ['catalogueItemsQueue', 'Arn'] }
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubsriptionLowPrice: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'cot45@tut.by',
          Protocol: 'email',
          FilterPolicyScope: 'MessageAttributes',
          FilterPolicy: {
            totalPrice: [{ numeric: ['<', 60] }]
          },
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      },
      SNSSubsriptionHighPrice: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'dimaosipow@yahoo.com',
          Protocol: 'email',
          FilterPolicyScope: 'MessageAttributes',
          FilterPolicy: {
            totalPrice: [{ numeric: ['>=', 60] }]
          },
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    }
  },
  // import the function via paths
  functions: { createProduct, getProducts, getProductById, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
