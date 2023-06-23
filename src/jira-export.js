const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');

function generateChangelog(ticketIds, startDate, endDate) {
  
  const csvWriter = createCsvWriter({
    path: 'changelog.csv',
    header: [
      { id: 'ticketId', title: 'Ticket ID' },
      { id: 'author', title: 'Author' },
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'from', title: 'From' },
      { id: 'to', title: 'To' }
    ],
    append: false
  });

  const promises = ticketIds.map(ticketId =>
    axios.get(`https://kandctransitions.atlassian.net/rest/api/3/issue/${ticketId}/changelog`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          'farya.hussain@kinandcarta.com:ATATT3xFfGF0Ri2TgrlVXYZTpZQ7cPzZ-_YQUfx1ho8RklOHqjxvgzbGfte4tl6Toqmn-slUbS6mmrRb6Qror_qN23B_przdwi5X39Eo0UmhETF6nLJ56chGjlhhD_GbTpYct5i6ZXFI7KUd8GToyD0Xop1-bSo37GvcJd5p__sxi8m-a_NrYQE=04B91116'
        ).toString('base64')}`,
        'Accept': 'application/json'
      }
    })
      .then(response => {
        const data = response.data.values.reduce((changelog, change) => {
          const { author, created, items } = change;

          // Iterate through each item in the change and track the history of status changes
          items.forEach(item => {
            const fromStatus = item.fromString;
            const toStatus = item.toString;

            changelog.push({
              ticketId: ticketId,
              author: author.displayName,
              timestamp: created,
              from: fromStatus,
              to: toStatus
            });
          });

          return changelog;
        }, []);

        return data;
      })
      .catch(err => {
        console.error(`Error fetching changelog for ticket ${ticketId}:`, err);
        return [];
      })
  );

  Promise.all(promises)
    .then(results => {
      const data = results.flat();

      // Filter the data based on the start and end dates
      const filteredData = data.filter(change => {
        const changeTimestamp = moment(change.timestamp, moment.ISO_8601); // Parse the timestamp
        return (
          (!startDate || changeTimestamp.isSameOrAfter(startDate)) && // Compare with the start date if provided
          (!endDate || changeTimestamp.isSameOrBefore(endDate)) // Compare with the end date if provided
        );
      });

      csvWriter
        .writeRecords(filteredData)
        .then(() => console.log('Changelogs have been written to the CSV file successfully!'))
        .catch(err => console.error('Error writing to CSV file:', err));
    })
    .catch(err => console.error('Error fetching changelogs:', err));
}

// Prompt for JQL query
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter the JQL query: ', jqlQuery => {
  readline.question('Enter the start date (DD-MM-YYYY): ', startDateInput => {
    const startDate = startDateInput ? moment(startDateInput, 'DD-MM-YYYY').startOf('day') : null;
    readline.question('Enter the end date (DD-MM-YYYY): ', endDateInput => {
      const endDate = endDateInput ? moment(endDateInput, 'DD-MM-YYYY').endOf('day') : null;

      // Fetch ticket IDs that match the JQL query and fall within the date range
      axios.get(`https://kandctransitions.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jqlQuery)}&expand=changelog`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            'farya.hussain@kinandcarta.com:ATATT3xFfGF0Ri2TgrlVXYZTpZQ7cPzZ-_YQUfx1ho8RklOHqjxvgzbGfte4tl6Toqmn-slUbS6mmrRb6Qror_qN23B_przdwi5X39Eo0UmhETF6nLJ56chGjlhhD_GbTpYct5i6ZXFI7KUd8GToyD0Xop1-bSo37GvcJd5p__sxi8m-a_NrYQE=04B91116'
          ).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          const ticketIds = response.data.issues.map(issue => issue.key);
          generateChangelog(ticketIds, startDate, endDate);
          readline.close();
        })
        .catch(err => {
          console.error('Error fetching ticket IDs:', err);
          readline.close();
        });
    });
  });
});


module.exports = generateChangelog;