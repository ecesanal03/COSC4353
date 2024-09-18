// VolunteerMatching.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "../CSS_styling/volunteerMatching.css";

const EventCard = ({ user, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(user)}>
      <div className="eventImageHolder">
        <img className="eventImage" src="https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1080&crop=smart&auto=webp&s=28c3ad73cff636f7ba478a0c19d734cd538949d4" alt={user.eventName} />
        {/* {user.eventImage} */}
      </div>
      <div className="cardText">
        <div className="eventName" id={user.eventID} data-RSVP={user.ifRSVP} style={{ fontWeight: 'bolder' }}>
          {user.eventName}
        </div>
        <div className="eventLocation">{user.eventLocation}</div>
        <div className="eventTime">{user.eventTime}</div>
      </div>
    </div>
  );
};

const EventPopup = ({ user, closePopup }) => {
  const handleRSVP = () => {
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
          closePopup(); // Close the popup after canceling RSVP
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
          closePopup(); // Close the popup after RSVP
        }
      });
    }
  };

  return (
    <div className="popup">
      <h2>{user.eventName}</h2>
      <button onClick={handleRSVP}>RSVP</button>
      <button onClick={closePopup}>Close</button>
    </div>
  );
};

const VolunteerMatching = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      eventID: "S12285",
      ifRSVP: true,
      eventImage: "https://example.com/image3.jpg",
      eventName: "Tech Conference",
      eventLocation: "TechHub, SF",
      eventTime: "2024-10-05 09:00",
    },
  ];

  const showPopup = (user) => {
    setSelectedEvent(user);
  };

  const closePopup = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="event-container">
      <div id="NavContainer">
        <div id="NavBar">eeee</div>
      </div>

      <div id="formMatching">
        <div>
          <h1 id="formMatchingHeader">
            <span className="formMatchingBar"></span> <i>Form Matching</i> <span className="formMatchingBar"></span>
          </h1>
        </div>

        <section className="dynamic-box">
          {data.map((user) => (
            <EventCard key={user.eventID} user={user} onClick={showPopup} />
          ))}
        </section>

        {selectedEvent && (
          <EventPopup user={selectedEvent} closePopup={closePopup} />
        )}
      </div>
    </div>
  );
};

export default VolunteerMatching;