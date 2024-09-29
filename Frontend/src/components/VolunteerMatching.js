import React from 'react';
import Swal from 'sweetalert2';
import "../CSS_styling/volunteerMatching.css";

const EventCard = ({ user, onRSVP }) => {
  const handleRSVPClick = () => {
    if (user.ifRSVP) {
      Swal.fire({
        title: "RSVP'ed",
        text: "Would you like to cancel RSVP?",
        icon: "info",
        confirmButtonText: "Cancel RSVP",
        confirmButtonColor: "red",
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          user.ifRSVP = false;
          Swal.fire({
            title: "Canceled!",
            text: "Your RSVP has been canceled.",
            confirmButtonColor: "green",
            icon: "error",
          });
        }
      });
    } else {
      Swal.fire({
        title: "No RSVP found",
        text: "Would you like to RSVP?",
        icon: "info",
        confirmButtonText: "RSVP",
        confirmButtonColor: "green",
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          user.ifRSVP = true;
          onRSVP(user); // Call the RSVP function passed down from the parent
          Swal.fire({
            title: "RSVP'ed!",
            text: "Your RSVP has been logged.",
            confirmButtonColor: "green",
            icon: "success",
          });
        }
      });
    }
  };

  return (
    <div className="card" onClick={handleRSVPClick}>
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
        <div className="eventTime">{user.eventTime}</div>
      </div>
    </div>
  );
};

const VolunteerMatching = ({ onRSVP }) => {
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
  ];

  return (
    <div className="event-container">
      <div id="NavContainer">
        {/* <div id="NavBar">eeee</div> */}
      </div>

      <div id="formMatching">
        <h1 id="formMatchingHeader">
          <span className="formMatchingBar"></span>
          <i>Form Matching</i>
          <span className="formMatchingBar"></span>
        </h1>

        <section className="dynamic-box">
          {data.map((user) => (
            <EventCard key={user.eventID} user={user} onRSVP={onRSVP} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default VolunteerMatching;