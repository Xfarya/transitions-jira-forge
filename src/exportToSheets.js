async function exportToSheets(data, oauth2Client) {
    const { google } = require('googleapis');
  
    // Create a client to access the Google Sheets API
    const sheetsClient = google.sheets({
      version: 'v4',
      auth: oauth2Client, // Pass the OAuth2 client as the 'auth' parameter
    });
  
    const spreadsheetId = '1Mi9f0Ebri8n5yaTABxn1UMtGR7pzisqUt4tkIARnw44';
    const range = 'Sheet1!A1:C';
  
    try {
      // Prepare the data for export
      const rows = data.map((log) => [log.timestamp, log.from, log.to]);
  
      // Define the request parameters for writing the data to the spreadsheet
      const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: rows,
        },
      };
  
      // Make the API request to write the data to the spreadsheet
      const response = await sheetsClient.spreadsheets.values.update(request);
      console.log('Data exported to Google Sheets:', response.data);
    } catch (error) {
      console.error('Error exporting data to Google Sheets:', error);
    }
  }
  
  // Create an OAuth2 client with your own credentials
  const oauth2Client = new google.auth.OAuth2(
    '1062791528691-b2hm0alil2rd2q4up1mn82ndthpmqjul.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/auth/google/callback'
  );
  
  module.exports = {
    exportToSheets,
    oauth2Client,
  };
  