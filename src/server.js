const express = require('express');
const { Parser } = require('json2csv');
const app = express();

app.get('/api/download-csv', (req, res) => {
  const { ticketId } = req.query;

  // Fetch changelogs or perform any necessary data retrievaln
  const changelogs = fetchChangelogs(ticketId);

  // Define the fields for the CSV file
  const fields = ['timestamp', 'from', 'to'];

  try {
    // Create the CSV parser
    const json2csvParser = new Parser({ fields });

    // Convert the changelogs data to CSV format
    const csvData = json2csvParser.parse(changelogs);

    // Set the response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${ticketId}.csv`);

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Error generating CSV');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
