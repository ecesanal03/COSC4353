import React from 'react';

const VolunteerHistory = ({ history }) => {
  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.heading}>Volunteer Participation History</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Event Name</th>
              <th style={styles.th}>Event Location</th>
              <th style={styles.th}>Event Time</th>
              <th style={styles.th}>Participation Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{row.eventName}</td>
                <td style={styles.td}>{row.eventLocation}</td>
                <td style={styles.td}>{row.eventTime}</td>
                <td style={styles.td}>{row.ifRSVP ? 'RSVP\'ed' : 'Not RSVP\'ed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styling for the table
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    paddingLeft: 'calc(25vh + 20px)', // Adjust for sidebar width
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  tableWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  table: {
    width: '90%',
    borderCollapse: 'collapse',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  th: {
    padding: '15px',
    backgroundColor: '#3A7CA5',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #ddd',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    color: '#333',
    textAlign: 'left',
  },
};

export default VolunteerHistory;
