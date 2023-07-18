const database = () => ({
    getAllItems: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
 });

export default database();
