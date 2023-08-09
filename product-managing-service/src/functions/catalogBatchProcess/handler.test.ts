import AWS from "aws-sdk";
import { catalogBatchProcess } from './handler';
import { SQSEvent } from 'aws-lambda';
import database from '../../models/database/Database';

jest.mock("aws-sdk");

const mockAws = AWS as jest.Mocked<typeof AWS>;

const SNSMock = {
    publish: jest.fn().mockImplementation(() => ({
        promise: jest.fn(),
    }))
};

jest.mock('../../models/database/Database');
const mockedDatabase = database as jest.Mocked<typeof database>;

const event: SQSEvent = {
    Records: [{
        body: JSON.stringify({
            price: 35,
            description: 'descr',
            title: 'title'
        })
    }, {
        body: JSON.stringify({
            price: 25,
            description: 'descr2',
            title: 'title2'
        })
    }]
} as any;

describe('catalogBatchProcess', () => {
    beforeAll(() => {
        mockAws.SNS.mockImplementation(jest.fn().mockImplementation(() => SNSMock));
    });

    beforeEach(() => {
        mockedDatabase.create.mockImplementation(() => Promise.resolve())
    });

    it('verifies objects are created in db and SNS published needed message', async () => {
        await catalogBatchProcess(event)

        expect(mockedDatabase.create).toHaveBeenCalledTimes(event.Records.length);
        expect(SNSMock.publish).toHaveBeenCalledWith(expect.objectContaining({
            "Subject": "All products have been added",
            "MessageAttributes": {"totalPrice": {"DataType": "Number", "StringValue": "60"}}
        }));
    });

    it('verifies that if wrong product are sent no DB and SNS execution happens', async () => {
        /* clearMocks: true in the jest.config so no need to clear here */
        await catalogBatchProcess({
            Records: [{
                body: JSON.stringify({
                    price: 35,
                })
            }, {
                body: JSON.stringify({
                    title: 'title2'
                })
            }]
        } as any);

        expect(mockedDatabase.create).toHaveBeenCalledTimes(0);
        expect(SNSMock.publish).not.toHaveBeenCalled();
    });
});