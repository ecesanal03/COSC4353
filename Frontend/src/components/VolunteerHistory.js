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

  const handleDownloadVolunteerHistoryPDF = () => {
    console.log('Volunteer history PDF requested');
    sendMessage({ action: 'request_volunteer_history' });
  };
  
  const handleDownloadEventAssignmentsPDF = () => {
    console.log('Event assignments PDF requested');
    sendMessage({ action: 'request_event_assignments' });
  };

  const handleDownloadVolunteerHistoryCSV = () => {
    console.log('Volunteer history CSV requested');
    sendMessage({ action: 'request_volunteer_history_csv' });
  };
  
  const handleDownloadEventAssignmentsCSV = () => {
    console.log('Event assignments CSV requested');
    sendMessage({ action: 'request_event_assignments_csv' });
  };
  
  const generateVolunteerHistoryPDF = (data) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Page height
    const margin = 10;
    const lineHeight = 8;
  
    let y = margin;
  
    doc.setFontSize(14);
    doc.text('List of Volunteers and Participation History', margin, y);
    y += lineHeight * 2;
  
    // Group data by volunteer email
    const groupedData = data.reduce((acc, curr) => {
      acc[curr.volunteerEmail] = acc[curr.volunteerEmail] || [];
      acc[curr.volunteerEmail].push(curr);
      return acc;
    }, {});
  
    // Loop through grouped data
    Object.entries(groupedData).forEach(([email, events], index) => {
      doc.setFontSize(12);
  
      // Check if adding the section title would exceed the page height
      if (y + lineHeight * 2 > pageHeight) {
        doc.addPage();
        y = margin;
      }
  
      // Add volunteer email
      doc.text(`${index + 1}. Volunteer Email: ${email}`, margin, y);
      y += lineHeight;
  
      // Add each event for the current email
      events.forEach((event, i) => {
        if (y + lineHeight * 5 > pageHeight) { // Account for extra spacing
          doc.addPage();
          y = margin;
        }
  
        doc.text(`  Event ${i + 1}:`, margin, y);
        y += lineHeight;
        doc.text(`    Event Name: ${event.eventName}`, margin, y);
        y += lineHeight;
        doc.text(`    Location: ${event.eventLocation}`, margin, y);
        y += lineHeight;
        doc.text(`    Date: ${event.eventDate}`, margin, y);
        y += lineHeight;
        doc.text(`    Participation Status: ${event.participationStatus}`, margin, y);
        y += lineHeight * 2; // Extra spacing between events
      });
  
      y += lineHeight; // Extra space between volunteers
    });
  
    doc.save('volunteer_history.pdf');
  };
  
  
  const generateEventAssignmentsPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Event Details and Volunteer Assignments', 10, 10);
  
    let y = 20;
    data.forEach((event, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. Event Name: ${event.eventName}`, 10, y);
      y += 8;
      doc.text(`Location: ${event.eventLocation}`, 10, y);
      y += 8;
      doc.text(`Date: ${event.eventDate}`, 10, y);
      y += 8;
      doc.text(`Urgency: ${event.urgency}`, 10, y);
      y += 8;
      doc.text(`Assigned Volunteers: ${event.assignedVolunteers}`, 10, y);
      y += 12;
    });
  
    doc.save('event_assignments.pdf');
  };

  const generateVolunteerHistoryCSV = (data) => {
    // Group data by volunteer email
    const groupedData = data.reduce((acc, curr) => {
      acc[curr.volunteerEmail] = acc[curr.volunteerEmail] || [];
      acc[curr.volunteerEmail].push(curr);
      return acc;
    }, {});
  
    // Prepare CSV rows
    const csvRows = [];
  
    Object.entries(groupedData).forEach(([email, events]) => {
      // Add a header row for each volunteer
      csvRows.push({
        VolunteerEmail: email,
        EventName: '',
        Location: '',
        Date: '',
        ParticipationStatus: '',
      });
  
      events.forEach((event, i) => {
        csvRows.push({
          VolunteerEmail: '',
          EventName: event.eventName,
          Location: event.eventLocation,
          Date: new Date(event.eventDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }), // Properly format the date
          ParticipationStatus: event.participationStatus,
        });
      });
  
      // Add an empty row to separate volunteers
      csvRows.push({});
    });
  
    // Generate and download the CSV
    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteer_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  const generateEventAssignmentsCSV = (data) => {
    const csvRows = data.map((event) => ({
      EventName: event.eventName,
      Location: event.eventLocation,
      Date: new Date(event.eventDate).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }), // Properly format the date
      Urgency: event.urgency,
      AssignedVolunteers: event.assignedVolunteers || 'No Volunteers', // Use assignedVolunteers as is
    }));
  
    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'event_assignments.csv');
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

        // Handle different WebSocket actions
        if (message.hasOwnProperty('populate_data')) {
          setData(message.events);
          console.log('Events data set to state:', message.events);
        } else if (message.action === 'send_volunteer_history') {
          console.log('Volunteer history data received:', message.volunteers);
          generateVolunteerHistoryPDF(message.volunteers); // Generate PDF
        } else if (message.action === 'send_event_assignments') {
          console.log('Event assignment data received:', message.events);
          generateEventAssignmentsPDF(message.events); // Generate PDF
        } else if (message.action === 'send_volunteer_history_csv') {
          console.log('Volunteer history data received for CSV:', message.volunteers);
          generateVolunteerHistoryCSV(message.volunteers);
        } else if (message.action === 'send_event_assignments_csv') {
          console.log('Event assignment data received for CSV:', message.events);
          generateEventAssignmentsCSV(message.events);
        } else {
          console.log('No recognized action in the message');
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
          <button style={styles.pdfButton} onClick={handleDownloadVolunteerHistoryPDF}>
            Download Volunteer History (PDF)
          </button>
          <button style={styles.pdfButton} onClick={handleDownloadEventAssignmentsPDF}>
            Download Event Assignments (PDF)
          </button>
          <button style={styles.csvButton} onClick={handleDownloadVolunteerHistoryCSV}>
            Download Volunteer History (CSV)
          </button>
          <button style={styles.csvButton} onClick={handleDownloadEventAssignmentsCSV}>
            Download Event Assignments (CSV)
          </button>
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
