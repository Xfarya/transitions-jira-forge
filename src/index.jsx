import ForgeUI, { render, ProjectPage, Fragment, Text, useState, Form, TextField, Button } from '@forge/ui';
import api, { route } from '@forge/api';

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

// can see logs if you have docker/run 'forge tunnel'
const printChangelogsInCsvFormat = (changelogs) => {
  let csvContent = 'Timestamp,From,To\n';
  changelogs.forEach((log) => {
    csvContent += `${log.timestamp},${log.from},${log.to}\n`;
  });
  console.log('Changelogs in CSV format:');
  console.log(csvContent);
};

const App = () => {
  const [changelogs, setChangelogs] = useState([]);

  const handleSubmit = async (formData) => {
    const { ticketId } = formData;

    if (ticketId) {
      try {
        const fetchedChangelogs = await fetchChangelogs(ticketId);
        setChangelogs(fetchedChangelogs);

        printChangelogsInCsvFormat(fetchedChangelogs);
      } catch (error) {
        console.error('Error fetching or exporting data:', error);
      }
    }
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
        {changelogs.length > 0 && <Button text="Export to Google Sheets" type="submit" />}
      </Form>
    </Fragment>
  );
};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
