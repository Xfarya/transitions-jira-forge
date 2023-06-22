import ForgeUI, { render, ProjectPage, Fragment, Text, useState, Form, TextField, Button } from '@forge/ui';
import api, { route } from '@forge/api';
import { CSVLink } from 'react-csv';
import React from 'react';

const fetchChangelogs = async (ticketId) => {
  const response = await api.asUser().requestJira(route`/rest/api/3/issue/${ticketId}/changelog`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  const data = await response.json();
  const changelogs = data.values.map((entry) => {
    const statusChange = entry.items.find((item) => item.field === 'status');
    return {
      timestamp: entry.created,
      from: statusChange?.fromString,
      to: statusChange?.toString,
    };
  });
  return changelogs;
};

const generateCsvContent = (changelogs) => {
  const csvData = [
    ['Timestamp', 'From', 'To'], // Header row
    ...changelogs.map((log) => [log.timestamp, log.from, log.to]), // Data rows
  ];
  return csvData;
};

const App = () => {
  const [changelogs, setChangelogs] = useState([]);
  const [ticketId, setTicketId] = useState('');
  const [changelogsCsv, setChangelogsCsv] = useState(null);

  const handleSubmit = async (formData) => {
    const { ticketId } = formData;

    if (ticketId) {
      try {
        const fetchedChangelogs = await fetchChangelogs(ticketId);
        setChangelogs(fetchedChangelogs);
        setTicketId(ticketId); // Store ticketId in the state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleDownload = () => {
    const csvData = generateCsvContent(changelogs);
    setChangelogsCsv(csvData);
  };

  return (
    <Fragment>
      {changelogs.length > 0 && (
        <Text>
          Ticket changelog history:
          {changelogs.map((log, index) => (
            <Fragment key={index}>
              <br />
              Timestamp: {log.timestamp}
              <br />
              <Text>&nbsp;</Text>
              From: {log.from}
              <br />
              <Text>&nbsp;</Text>
              To: {log.to}
              <br />
            </Fragment>
          ))}
        </Text>
      )}

      <Form onSubmit={handleSubmit}>
        <TextField name="ticketId" label="Ticket ID" />
        {changelogs.length > 0 && (
          <>
            {changelogsCsv && (
              <CSVLink data={changelogsCsv} filename="changelogs.csv">
                Download CSV
              </CSVLink>
            )}
            <Button text="Generate CSV" onClick={handleDownload} />
          </>
        )}
      </Form>
    </Fragment>
  );
};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
