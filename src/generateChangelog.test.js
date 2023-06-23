const readline = require('readline');
console.log = jest.fn();

jest.mock('axios');
jest.mock('csv-writer');
jest.mock('moment');
jest.mock('./jira-export');

const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const generateChangelog = require('./jira-export');

describe('generateChangelog function', () => {
  let originalReadline;
  let readlineMock;

  beforeAll(() => {
    originalReadline = readline.createInterface;
    readline.createInterface = jest.fn().mockReturnValue({
      question: jest.fn(),
      close: jest.fn()
    });
  });

  beforeEach(() => {
    readlineMock = readline.createInterface();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    readline.createInterface = originalReadline;
  });

  test('generateChangelog function is called with the correct parameters', () => {
    // Define the test parameters
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();

    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
  });
  
  test('handles empty ticketIds array', () => {
    const ticketIds = [];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';

    generateChangelog(ticketIds, startDate, endDate, readlineMock);

    expect(axios.get).not.toHaveBeenCalled();
    expect(createCsvWriter).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  test('generateChangelog function handles single ticket', () => {
    const ticketIds = ['TICKET-1'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-02';
    const readlineMock = jest.fn();

    generateChangelog(ticketIds, startDate, endDate, readlineMock);

    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles single-day duration', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-01';
    const readlineMock = jest.fn();

    generateChangelog(ticketIds, startDate, endDate, readlineMock);

    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles single-day range with multiple tickets', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-01';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles multi-day range with multiple tickets', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-03';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles missing end date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = undefined;
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles missing start date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = undefined;
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles missing end date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = undefined;
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles missing ticketIds array', () => {
    const ticketIds = undefined;
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });  

  test('generateChangelog function handles invalid date format', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023/06/23'; // Invalid date format
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles missing readlineMock', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles invalid ticketIds', () => {
    const ticketIds = 'TICKET-1'; // Invalid ticketIds format
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles invalid date range', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-23'; // Start date after end date
    const endDate = '2023-06-01';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles large number of ticketIds', () => {
    const ticketIds = Array.from({ length: 1000 }, (_, index) => `TICKET-${index}`);
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles empty start date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles empty end date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles invalid start date format', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '06/01/2023'; // Invalid date format
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles invalid end date format', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '06/23/2023'; // Invalid date format
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles invalid ticketIds type', () => {
    const ticketIds = 123; // Invalid ticketIds type
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  test('generateChangelog function handles missing readlineMock and empty ticketIds', () => {
    const ticketIds = [];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  

  test('generateChangelog function handles missing readlineMock and single ticketId', () => {
    const ticketIds = ['TICKET-1'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  

  test('generateChangelog function handles missing readlineMock and multi-day range', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-03';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles missing readlineMock and invalid date range', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-23'; // Start date after end date
    const endDate = '2023-06-01';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles missing ticketIds, start date, and end date', () => {
    const ticketIds = undefined;
    const startDate = undefined;
    const endDate = undefined;
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  
  test('generateChangelog function handles start date after end date', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-23'; // Start date after end date
    const endDate = '2023-06-01';
    const readlineMock = jest.fn();
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });

  test('generateChangelog function handles missing readlineMock and multiple ticketIds', () => {
    const ticketIds = ['TICKET-1', 'TICKET-2'];
    const startDate = '2023-06-01';
    const endDate = '2023-06-23';
    const readlineMock = undefined; // Missing readlineMock
  
    generateChangelog(ticketIds, startDate, endDate, readlineMock);
  
    expect(generateChangelog).toHaveBeenCalledWith(ticketIds, startDate, endDate, readlineMock);
    // Add additional assertions specific to this test case
  });
  
  // test('axios.get is called with the correct URL', () => {
  //   const ticketIds = ['TICKET-1', 'TICKET-2'];
  //   const startDate = '2023-06-01';
  //   const endDate = '2023-06-23';

  //   generateChangelog(ticketIds, startDate, endDate, readlineMock);

  //   expect(axios.get).toHaveBeenCalledWith(
  //     'https://api.example.com/changelog?startDate=2023-06-01&endDate=2023-06-23&ticketIds=TICKET-1,TICKET-2'
  //   );
  // });
  
});
