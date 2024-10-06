import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

import "../CSS_styling/volunteerMatching.css";

const socketUrl = 'ws://localhost:8000/';

const EventList = () => {
  const [data, setData] = useState([
    {
      eventID: "S15598",
      ifRSVP: true,
      eventImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
      eventName: "Music Concert",
      eventLocation: "Central Park, NY",
      eventTime: "2024-09-15 18:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19581",
      ifRSVP: false,
      eventImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19582",
      ifRSVP: false,
      eventImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
  ]);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(socketUrl);

    socket.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message received from server:', message);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

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
          setData((prevData) => 
            prevData.map((item) => 
              item.eventID === eventID ? { ...item, ifRSVP: false } : item
            )
          );
          if (socket.current) {
            socket.current.send(JSON.stringify({ eventID, action: 'cancel_rsvp' }));
          }
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
          setData((prevData) => 
            prevData.map((item) => 
              item.eventID === eventID ? { ...item, ifRSVP: true } : item
            )
          );
          if (socket.current) {
            socket.current.send(JSON.stringify({ eventID, action: 'rsvp' }));
          }
          swalWithBootstrapButtons.fire({
            title: "RSVP'ed!",
            text: 'Your file has been logged.',
            confirmButtonColor: 'green',
            icon: 'success'
          });
        }
      });
    }
  };

  return (
    <div className="event-container">
      <div id="NavContainer">
      </div>

      <div id="formMatching">
        <h1 id="formMatchingHeader">
          <span className="formMatchingBar"></span>
          <i className = "disable-select">Form Matching</i>
          <span className="formMatchingBar"></span>
        </h1>

        <div className="dynamic-box">
          {data.map((user, index) => (
            <div key={index} className="card disable-select" onClick={() => showPopup(user, user.eventID, user.ifRSVP)}>
            <div className="eventImageHolder">
              <img
                className="eventImage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s"
                alt={user.eventName}
              />
            </div>
            <div className="cardText">
            <div className="eventName" id={user.eventID} style={{ fontWeight: 'bolder' }}>
              {user.eventName}
            </div>
              <div className="eventLocation">{user.eventLocation}</div>
              <div className="eventTime">{user.eventTime}{user.ifRSVP && <span title="This event has been RSVP'ed">&#9989;</span>}</div>
            </div>
          </div>
          ))}
        </div>

      </div>
    </div>

  );
};

export default EventList;
