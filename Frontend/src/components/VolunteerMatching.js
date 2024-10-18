import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useWebSocket } from '../WebSocketContext.js';
import "../CSS_styling/volunteerMatching.css";

const EventList = () => {
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
        console.log('Sending message to fetch events: { page_loc: "VolunteerMatching", email: userEmail }');
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

  const showPopup = (user, eventID, ifRSVP, ifMatched) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });

    if (ifRSVP) {
      swalWithBootstrapButtons.fire({
        title: "RSVP'ed",
        text: 'Would you like to cancel RSVP?',
        icon: 'info',
        confirmButtonText: 'Cancel RSVP',
        confirmButtonColor: 'red',
        showCloseButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          setData((prevData) => ({
            ...prevData,
            [eventID]: { ...prevData[eventID], ifRSVP: false }
          }));
          sendMessage({ eventID, action: false });
          swalWithBootstrapButtons.fire({
            title: 'Canceled!',
            text: 'Your RSVP has been canceled.',
            confirmButtonColor: 'green',
            icon: 'error'
          });
        }
      });
    } else {
      swalWithBootstrapButtons.fire({
        title: 'No RSVP found',
        text: 'Would you like to RSVP?',
        icon: 'info',
        confirmButtonText: 'RSVP',
        confirmButtonColor: 'green',
        showCloseButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          setData((prevData) => ({
            ...prevData,
            [eventID]: { ...prevData[eventID], ifRSVP: true }
          }));
            sendMessage({ eventID, action: true });
          swalWithBootstrapButtons.fire({
            title: "RSVP'ed!",
            text: 'Your RSVP has been logged.',
            confirmButtonColor: 'green',
            icon: 'success'
          });
        }
      });
    }
  };

  return (
  
    <div className="event-container">
      <div id="NavContainer"></div>
      <div id="formMatching">
        <h1 id="formMatchingHeader">
          <span className="formMatchingBar"></span>
          <i className="disable-select">Form Matching</i>
          <span className="formMatchingBar"></span>
        </h1>

        <div className="dynamic-box">
          {Object.values(data).map((user) => (
            <div
              key={user.eventID}
              className="card disable-select"
              onClick={() => showPopup(user, user.eventID, user.ifRSVP, user.ifMatched)}
            >

                <div
                  className="userProfileMatch"
                  style={{backgroundColor: user.ifMatched ? 'rgb(66, 231, 45)' : 'red',}}>
                  {user.ifMatched ? (
                    <span title="You matched the request for this event">&#9989;&nbsp;matched&nbsp;</span>
                  ) : (
                    <span title="You do not match the request for this event">&#10060;&nbsp;not matched&nbsp;</span>
                  )}
                </div>

              <div className="eventImageHolder">
                <img
                  className="eventImage"
                  src={user.eventImage}
                  alt={user.eventName}
                />
              </div>
              <div className="cardText">
                <div className="eventName" id={user.eventID} style={{ fontWeight: 'bolder' }}>
                  {user.eventName}
                </div>
                <div className="eventLocation">{user.eventLocation}</div>
                <div className="eventTime">
                  {user.eventTime}
                  {user.ifRSVP && <span title="This event has been RSVP'ed">&#9989;</span>}
                </div>
                  <div>
                    <b>Experienced: </b>
                    {user.volunteerSkill.length > 0 ? 
                    (
                      user.volunteerSkill.map((item, index) => (
                        <span key={index}>
                          {item}
                          {index < user.volunteerSkill.length - 1 && ', '}
                        </span>
                      ))
                    ) : 
                    (
                      <div>N/A</div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;