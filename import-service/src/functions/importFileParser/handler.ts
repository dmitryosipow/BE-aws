import { S3 } from "aws-sdk";
import { S3Event } from 'aws-lambda';
import csvParser from 'csv-parser';
// import stream from 'stream';

const importFileParser = async (event: S3Event) => {
    const key = event.Records[0].s3.object.key;

    const s3 = new S3();

    const params = {
        Bucket: `${process.env.BUCKET}`,
        Key: key,
    };

    const s3Stream = s3.getObject(params).createReadStream();
    // const writeStream = new stream.PassThrough();
    // const uploadToS3 = s3.upload({
    //     Bucket: `${process.env.BUCKET}`, // whatever your bucket is in S3
    //     Key: key.replace('uploads', 'parsed'), // file name
    //     Body: writeStream, // Body is stream which enables streaming
    // }).promise();
    let results = [];

    await new Promise<void>((resolve, reject) => {
        s3Stream.pipe(csvParser({ headers: false }))
            .on('data', (data) => {
                results.push(data);
                console.log('Parser');
                console.log(data);
                // const writeData = JSON.stringify({ ...data, test: 'meow' })
                // writeStream.write(writeData);
            })
            .on('error', (err) => {
                console.log('Error ');
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log('final');
                console.log(results);
                //writeStream.end();
                resolve();
            });
    });
    //await uploadToS3;

    // just move file without changing
    await s3.copyObject({
        Bucket: `${process.env.BUCKET}`,
        CopySource: `${process.env.BUCKET}/${key}`,
        Key: key.replace('uploads', 'parsed')
    }).promise();

    await s3.deleteObject({
        Bucket: `${process.env.BUCKET}`,
        Key: key
    }).promise();

    console.log(`File ${key} has been copied to parsed and deleted from uploads`);

    return results
};

export const main = importFileParser;
