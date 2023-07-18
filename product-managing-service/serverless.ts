import type { AWS } from '@serverless/typescript';

import { getProducts, getProductById, createProduct } from './src/functions/';

const serverlessConfiguration: AWS = {
  service: 'product-managing-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
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
      database: 'SQL',
    },
    vpc: {
      securityGroupIds: ['sg-07c9cb356bf9b533a'],
      subnetIds: ['subnet-031cbd1654613ba94', 'subnet-0952574a7bd296303']
    },
    httpApi: {
      cors: {
        allowedOrigins: ['http://localhost:3000', 'https://d25hlwf9ze1p5g.cloudfront.net']
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
        }],
      },
    },
  },
  // import the function via paths
  functions: { createProduct, getProducts, getProductById },
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
