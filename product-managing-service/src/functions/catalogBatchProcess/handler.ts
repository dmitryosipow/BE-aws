import { SQSEvent } from 'aws-lambda';
import { SNS } from "aws-sdk";
import { createProductObject } from '../../utils/createProduct';
import database from '../../models/database/Database';

export const catalogBatchProcess = async (event: SQSEvent) => {
    console.log('catalogBatchProcess event3:');
    console.log(event);
    const products = [];
    let totalPrice = 0;
    for (const { body } of event.Records) {
        const validatedProdObject = createProductObject(JSON.parse(body));
        if (validatedProdObject.error) {
            console.log(validatedProdObject.error);
            return
        }
        try {
            await database.create(validatedProdObject.product);
            products.push(validatedProdObject.product);
            totalPrice+= validatedProdObject.product.price;
        } catch (e) {
            console.log('error creating product from SQS message');
            console.log(e);
        }
    }

    try {
        const sns = new SNS({ apiVersion: '2010-03-31' });
        const message = JSON.stringify(products);
        console.log('sending sns');
        console.log(message);
        await sns.publish({
            Subject: 'All products have been added',
            Message: message,
            MessageAttributes: {
                totalPrice: {
                    DataType: "Number",
                    StringValue: `${totalPrice}`
                }
            },
            TopicArn: process.env.SNS_ARN
        }).promise();
    } catch (e) {
        console.log('error in SNS');
        console.log(e);
    }
};

export const main = catalogBatchProcess;
