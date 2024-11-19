import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../WebSocketContext.js';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const VolunteerHistory = () => {
  const [userRole, setUserRole] = useState('');
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false);
  const userEmail = localStorage.getItem('userEmail');

  const handleDownloadPDF = () => {
    console.log('PDF download requested');
    sendMessage({ action: 'request_pdf_data', email: userEmail });
  };

  const handleDownloadCSV = () => {
    console.log('CSV download requested');
    sendMessage({ action: 'request_csv_data', email: userEmail });
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Volunteer Participation History', 10, 10);
  
    let y = 20;
    data.forEach((event, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. Event Name: ${event.eventName}`, 10, y);
      y += 8;
      doc.text(`Location: ${event.location}`, 10, y);
      y += 8;
      doc.text(`Date: ${new Date(event.eventDate).toLocaleString()}`, 10, y);
      y += 8;
      doc.text(`Urgency: ${event.urgency}`, 10, y);
      y += 8;
      doc.text(`Skills: ${event.requiredSkills.join(', ')}`, 10, y);
      y += 8;
      doc.text(`RSVP Status: ${event.ifRSVP ? 'RSVP\'ed' : 'Not RSVP\'ed'}`, 10, y);
      y += 8;
      doc.text(`Match Status: ${event.ifMatched ? 'Matched' : 'Not Matched'}`, 10, y);
      y += 12;
    });
  
    doc.save('volunteer_history.pdf');
  };

  const generateCSV = (data) => {
    const formattedData = data.map(event => ({
      EventID: event.eventID,
      EventName: event.eventName,
      Location: event.location,
      EventDate: new Date(event.eventDate).toLocaleString(),
      Urgency: event.urgency,
      RequiredSkills: event.requiredSkills.join(', '),
      RSVPStatus: event.ifRSVP ? 'RSVP\'ed' : 'Not RSVP\'ed',
      MatchStatus: event.ifMatched ? 'Matched' : 'Not Matched',
    }));
  
    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteer_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    console.log('Component mounted, WebSocket initialized');
    const temp = localStorage.getItem('userRole');
    if (temp) {
      setUserRole(temp.toLowerCase());
    }
    if (socket) {
      const handleMessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const message = JSON.parse(event.data);
        console.log('Parsed message:', message);

        if (message.hasOwnProperty('populate_data')) {
          setData(message.events);
          console.log('Events data set to state:', message.events);
        } else if (message.action === 'send_pdf_data') {
          console.log('PDF data received:', message.events);
          generatePDF(message.events);
        } else if (message.action === 'send_csv_data') {
          console.log('CSV data received:', message.events);
          generateCSV(message.events);
        } else {
          console.log('No events found in the message');
        }
      };

      socket.onmessage = handleMessage;

      if (!hasSentMessage.current && userEmail) {
        console.log('Sending message to fetch events: { page_loc: "VolunteerHistory", email: userEmail }');
        sendMessage({ page_loc: 'VolunteerHistory', email: userEmail });
        hasSentMessage.current = true;
      } else if (!userEmail) {
        console.log('No user email found. Please log in.');
      }

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, sendMessage, userEmail]);

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
            {Object.entries(data).map(([eventID, row]) => (
              <tr key={eventID} style={styles.tr}>
                <td style={styles.td}>{row.eventName}</td>
                <td style={styles.td}>{row.location}</td>
                <td style={styles.td}>
                  {new Date(row.eventDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td style={styles.td}>{row.ifRSVP ? 'RSVP\'ed' : 'Not RSVP\'ed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userRole === 'admin' && (
        <div style={styles.downloadContainer}>
          <button style={styles.pdfButton} onClick={handleDownloadPDF}>Download PDF</button>
          <button style={styles.csvButton} onClick={handleDownloadCSV}>Download CSV</button>
        </div>
      )}
    </div>
  );
};

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
    pdfButton:
    {
      borderRadius:'10%',
      backgroundColor:'red',
      paddingBottom:'1vh',
      paddingTop:'1vh',
    },
    csvButton:
    {
  
      borderRadius:'10%',
      backgroundColor:'rgb(66, 231, 45)',
      paddingBottom:'1vh',
      paddingTop:'1vh',
    },
    downloadContainer:
    {
      backgroundColor:'rgb(58, 124, 165)',
      position: 'fixed',
      border:'1px solid',
      bottom: '0',
      right:'0',
      display: 'flex',
      // flexDirection: 'column',
      // alignItems: 'center',
      gap: '1vh',
      padding:'1vh',
    }
};

export default VolunteerHistory;
