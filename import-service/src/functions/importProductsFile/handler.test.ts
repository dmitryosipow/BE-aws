import AWS from "aws-sdk";
import { importProductFile } from './handler';

jest.mock("aws-sdk");
const mockUrl = 'sampleUrl';
const sampleName = 'sampleName';
const event = {
    queryStringParameters: {
        fileName: sampleName
    }
} as any;

const mockAws = AWS as jest.Mocked<typeof AWS>;

const S3Mock = {
    getSignedUrlPromise: jest.fn()
};


describe('importProductsFile', () => {
    beforeAll(() => {
        mockAws.S3.mockImplementation(jest.fn().mockImplementation(() => S3Mock));
    });

    it('verifies successful response', async () => {
        S3Mock.getSignedUrlPromise.mockImplementation(() => Promise.resolve(mockUrl));

        const response = await importProductFile(event)
        expect(response.body).toEqual(mockUrl);
    });

    it('verifies that 400 status will be returned in case fileName is missing in request', async () => {
        S3Mock.getSignedUrlPromise.mockImplementation(() => Promise.resolve(mockUrl));

        const response = await importProductFile({} as any)
        expect(response.statusCode).toEqual(400);
    });

    it('verifies that 500 status will be returned in case any error during getting signed url', async () => {
        S3Mock.getSignedUrlPromise.mockImplementation(() => Promise.reject("test error"));

        const response = await importProductFile(event)
        expect(response.statusCode).toEqual(500);
    });
});