// VolunteerMatching.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "../CSS_styling/volunteerMatching.css";

const EventCard = ({ user, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(user)}>
      <div className="eventImageHolder">
        <img
          className="eventImage"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s"
          alt={user.eventName}
        />
        {/* {user.eventImage} */}
      </div>
      <div className="cardText">
        <div
          className="eventName"
          id={user.eventID}
          // data-RSVP={user.ifRSVP}
          style={{ fontWeight: 'bolder' }}
        >
          {user.eventName}
        </div>
        <div className="eventLocation">{user.eventLocation}</div>
        <div className="eventTime">{user.eventTime}</div>
      </div>
    </div>
  );
};

// Handle RSVP directly
const handleRSVP = (user) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: true,
  });

  if (user.ifRSVP) {
    swalWithBootstrapButtons.fire({
      title: "RSVP'ed",
      text: "Would you like to cancel RSVP?",
      icon: "info",
      confirmButtonText: "Cancel RSVP",
      confirmButtonColor: "red",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        user.ifRSVP = false;
        swalWithBootstrapButtons.fire({
          title: "Canceled!",
          text: "Your RSVP has been canceled.",
          confirmButtonColor: "green",
          icon: "error",
        });
      }
    });
  } else {
    swalWithBootstrapButtons.fire({
      title: "No RSVP found",
      text: "Would you like to RSVP?",
      icon: "info",
      confirmButtonText: "RSVP",
      confirmButtonColor: "green",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        user.ifRSVP = true;
        swalWithBootstrapButtons.fire({
          title: "RSVP'ed!",
          text: "Your RSVP has been logged.",
          confirmButtonColor: "green",
          icon: "success",
        });
      }
    });
  }
};

const VolunteerMatching = () => {
  const data = [
    {
      eventID: "S15598",
      ifRSVP: true,
      eventImage: "https://example.com/image1.jpg",
      eventName: "Music Concert",
      eventLocation: "Central Park, NY",
      eventTime: "2024-09-15 18:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    ,
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    ,
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },
    ,
    {
      eventID: "S19586",
      ifRSVP: false,
      eventImage: "https://example.com/image2.jpg",
      eventName: "Art Exhibition",
      eventLocation: "Downtown Gallery, LA",
      eventTime: "2024-09-20 10:00",
    },

  ];

  return (
    <div className="event-container">
      <div id="NavContainer">
        {/* <div id="NavBar">eeee</div> */}
      </div>

      <div id="formMatching">
        <div>
          <h1 id="formMatchingHeader">
            <span className="formMatchingBar"></span> <i>Form Matching</i> <span className="formMatchingBar"></span>
          </h1>
        </div>

        <section className="dynamic-box">
          {data.map((user) => (
            <EventCard key={user.eventID} user={user} onClick={handleRSVP} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default VolunteerMatching;
