# CloudX AWS Practitioner for JS

## Task 2

- Link to S3 under CloudFront (403 Restricted) https://app-bucket-course2.s3.eu-west-1.amazonaws.com/
- Link to CloudFront distribution of the S3 https://d1k0a3yefk9g4c.cloudfront.net/
- Link to commit with Serverless-finch and serverless-single-page-app plugins integration. The app can be built and deployed by running npm script command https://github.com/dmitryosipow/shop-react-redux-cloudfront/commit/53144a313e04c1c31f4db7b92b9bb97bbf56152d

## Task 3

- Link to initial commit with 2 Lambda functions (testing-info-service)  https://github.com/dmitryosipow/BE-aws/commit/9c6a281026cbde7b69e7694ec5178bb103e9add6#diff-dd3cf99a307f66b189b3281b0fdbe0fac3996afd03b4db1c98666202d4d76393
- Single product can be returned by such link https://d1k0a3yefk9g4c.cloudfront.net/ -> Manage products -> Select product and click manage , all products are visible on first page
- All additional points should be done (Async/await is used in lambda functions, ES6 modules are used for Product Service implementation, Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
  Main error scenarios are handled by API ("Product not found" error))
- Swagger documentation for 2 endpoints - https://yw459sxtei.execute-api.eu-west-1.amazonaws.com/swagger
- Units tests are added (extra commit with unit test https://github.com/dmitryosipow/BE-aws/commit/70abfeee2c4783dbe1fc248d4e40c28ca13ed34d)

## Task 4

- Link to DynamoDB and MySQL integrations https://github.com/dmitryosipow/BE-aws/commit/4531fa2bcc2c19b624d1a675ae6ed1682ed632ee
- Database switch is configured via env variable -> database: 'DB' or 'SQL'
- Link to products POST is inside Postman collection 'productApi.postman_collection.json'
- All additional points are completed:  (All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
  All lambdas do console.log for each incoming requests and their arguments
  Use RDS instance instead fo DynamoDB tables. Do not commit your environment variables in serverless.yml to github!
  Transaction based creation of product)


## Task 5
- Link to new import-service realization commit  https://github.com/dmitryosipow/BE-aws/commit/488c75f9cf27a29a86d410f6b0f411b3edc11482
- Auth token may be needed from task 7 (localStorage authorization_token :  ZG1pdHJ5b3NpcG93OlRFU1RfUEFTU1dPUkQ=)
- Go to https://d1k0a3yefk9g4c.cloudfront.net/ -> Manage products -> Choose and Upload table.csv file from root folder, return to main page and refresh -> items from csv are created
- All additional points are created (async/await is used in lambda functions, unit tests for importProductsFile lambda, At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder)

## Task 6
- Link to SNS and SQS realization commit https://github.com/dmitryosipow/BE-aws/commit/52bd7fcb87c4032e1c11a51c1f32b52b3008e39a
- All addional points are implemented - (catalogBatchProcess lambda is covered by unit tests, set a Filter Policy for SNS createProductTopic in serverless.yml and create an additional email subscription to distribute messages to different emails depending on the filter for any product attribute - totalPrice)

## Task 7
- Link to commit with basicAuthorizer for importProductsFile lambda https://github.com/dmitryosipow/BE-aws/commit/b0f46236724d07371afefdb1486ffec99a3d770f
- Token to store in localStorage authorization_token :  ZG1pdHJ5b3NpcG93OlRFU1RfUEFTU1dPUkQ=  (dmitryosipow:TEST_PASSWORD)
- Addional tasks are completed -  Client application should display alerts for the responses in 401 and 403 HTTP statuses. https://github.com/dmitryosipow/shop-react-redux-cloudfront/commit/8d849c33a49217bc5366811c16715e96944693a1
- Without evaluation, but practice for Cognito Authorizer was done   https://github.com/dmitryosipow/shop-react-redux-cloudfront/commit/2073da13cc1056a806a900f9f6f8646627ae9138

## Task 8
- Link to PR with implemented Carts, Users, Orders tables and there integration with NestJS app https://github.com/dmitryosipow/rs-cart-api/compare/main...dmitryosipow:rs-cart-api:task8
- All points except FE integration are done (transaction based checkout and 2 additional tables Users and Orders have been created)
- Post collection for cartApi and sql scripts are in root folder