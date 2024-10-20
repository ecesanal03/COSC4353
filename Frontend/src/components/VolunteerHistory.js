import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../WebSocketContext.js';

const VolunteerHistory = () => {
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false);
  var message = {};
  const userEmail = localStorage.getItem('userEmail'); 

  useEffect(() => {
    console.log('Component mounted, WebSocket initialized');
    
    if (socket) {
      const handleMessage = (event) => {
        console.log('WebSocket message received:', event.data);

        const message = JSON.parse(event.data);
        console.log('Parsed message:', message);

        if (message.hasOwnProperty('events')) {
          setData(message.events);
          console.log('Events data set to state:', message.events); 
        } else {
          console.log('No events found in the message');
        }
      };

      socket.onmessage = handleMessage;

      if (!hasSentMessage.current && userEmail) {
        console.log('Sending message to fetch events: { page_loc: "VolunteerHistory", email: userEmail }');
        sendMessage({ page_loc: 'VolunteerMatching', email: userEmail });
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
                                          {Object.entries(data).map(([eventID, row], index) => (
                          <tr key={eventID} style={styles.tr}>
                              <td style={styles.td}>{row.eventName}</td>
                              <td style={styles.td}>{row.location}</td>
                              <td style={styles.td}>
                                {new Date(row.eventDate).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',  // Full month name
                                  day: 'numeric', // Day of the month
                                  hour: '2-digit', // Hours
                                  minute: '2-digit', // Minutes
                                })}
                              </td>
                              <td style={styles.td}>{row.ifRSVP ? 'RSVP\'ed' : 'Not RSVP\'ed'}</td>
                          </tr>
                      ))}
                    </tbody>
                </table>
            </div>
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
};

export default VolunteerHistory;