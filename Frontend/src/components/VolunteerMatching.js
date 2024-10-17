import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useWebSocket } from '../WebSocketContext.js';
import "../CSS_styling/volunteerMatching.css";

const EventList = () => {
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false); // Use a ref to track if the message has been sent
  var message = {};
  useEffect(() => {
    console.log('this mean message is ready, gogogo')
    if (socket) {
      const handleMessage = (event) => {
        message = JSON.parse(event.data);
        console.log('Message received from server:', message);
        if (message.hasOwnProperty('events')) {
          setData(message.events);
        }
        console.log(Object.values(data));
      };

      socket.onmessage = handleMessage;
      

      sendMessage({ page_loc: 'VolunteerMatching' });
      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage]);

  
  const showPopup = (user, eventID, ifRSVP) => {
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
              onClick={() => showPopup(user, user.eventID, user.ifRSVP)}
            >
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
