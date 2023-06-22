import express from 'express';
import axios from 'axios';

const app = express();

const fetchChangelogs = async (ticketId) => {
  const url = `https://kandctransitions.atlassian.net/rest/api/2/issue/${ticketId}/changelog`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'ATATT3xFfGF0Ri2TgrlVXYZTpZQ7cPzZ-_YQUfx1ho8RklOHqjxvgzbGfte4tl6Toqmn-slUbS6mmrRb6Qror_qN23B_przdwi5X39Eo0UmhETF6nLJ56chGjlhhD_GbTpYct5i6ZXFI7KUd8GToyD0Xop1-bSo37GvcJd5p__sxi8m-a_NrYQE=04B91116',
        'Accept': 'application/json',
      },
    },
    )

    if (response.status !== 200) {
      console.error('Error fetching data: Request failed with status', response.status);
      throw new Error('Error fetching data: Request failed with status ' + response.status);
    }

    const data = response.data;
    const changelogs = data.values.map((entry) => {
      const statusChange = entry.items.find((item) => item.field === 'status');
      return {
        timestamp: entry.created,
        from: statusChange?.fromString,
        to: statusChange?.toString,
      };
    });

    return changelogs;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data: ' + error.message);
  }
};

const generateCsvContent = (changelogs) => {
  const csvData = [
    ['Timestamp', 'From', 'To'], // Header row
    ...changelogs.map((log) => [log.timestamp, log.from, log.to]), // Data rows
  ];

  return csvData;
};

app.get('/', async (req, res) => {
  const ticketId = 'TTB-1';

  try {
    const changelogs = await fetchChangelogs(ticketId);
    const csvData = generateCsvContent(changelogs);

    res.send(csvData); // Send the CSV content as the response
  } catch (error) {
    console.error('Error in request:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
