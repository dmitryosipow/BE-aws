import AWS from "aws-sdk";
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';


const HEADERS = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
};

export const importProductFile = async (event: APIGatewayProxyEvent) => {
    const fileName = event.queryStringParameters?.fileName;

    if (!fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing name parameter' }),
        };
    }
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET,
        Key: `uploads/${fileName}`,
        Expires: 60,
        ContentType: 'text/csv',
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: HEADERS,
            body: signedUrl,
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error getting signed URL' }),
        };
    }

};

export const main = middyfy(importProductFile);
