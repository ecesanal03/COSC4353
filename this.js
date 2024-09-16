const dataTemplate = document.querySelector('.data-template')
const container = document.querySelector('.dynamic-box')

// page loaded, assign ID onto each rendered button so that it can assign that value onto rsvp button
// when rsvp button clicked, send that ID to back end, from what user --> add that ID into user history
// doing it this way, we need the primary key to be that event ID just so that the database can search when needed

let data=[
    {
        eventID:"S15598",
        ifRSVP:true,
        eventImage: "https://example.com/image1.jpg",
        eventName: "Music Concert",
        eventLocation: "Central Park, NY",
        eventTime: "2024-09-15 18:00"
    },
    {
        eventID:"S19586",
        ifRSVP:false,
        eventImage: "https://example.com/image2.jpg",
        eventName: "Art Exhibition",
        eventLocation: "Downtown Gallery, LA",
        eventTime: "2024-09-20 10:00"
    },
    {
        eventID:"S12285",
        ifRSVP:true,
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    ,
    {
        eventID:"S15598",
        ifRSVP:true,
        eventImage: "https://example.com/image3.jpg",
        eventName: "Tech Conference",
        eventLocation: "TechHub, SF",
        eventTime: "2024-10-05 09:00"
    }
    
];//this data would store json result
data.map(user =>
{
    const card = dataTemplate.content.cloneNode(true).children[0]
    const eventImage = card.querySelector('.eventImage')
    const eventName = card.querySelector('.eventName')
    const eventLocation = card.querySelector('.eventLocation')
    const eventTime = card.querySelector('.eventTime')

    //eventImage.src = user.eventImage;  // Set image source
    // eventName.setAttribute("id", user.eventID);
    // eventName.setAttribute('data-ID', user.ifRSVP);
    eventName.textContent = user.eventName;  // Set event name text
    eventLocation.textContent = user.eventLocation;  // Set event location text
    eventTime.textContent = user.eventTime;  // Set event time text
    card.addEventListener('click', () => {
        showPopup(user, user.eventID, user.ifRSVP); }),// Pass necessary data
    container.append(card)
}
).catch(error => console.error(error))


function showPopup(user, eventID, ifRSVP) {
    var stateTracker = document.getElementById(eventID);
    var RSVP_bool = ifRSVP;
    console.log(eventID)
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true
      });
      if (RSVP_bool == true) 
        {
            swalWithBootstrapButtons.fire({
                title: "RSVP'ed",
                text: "Would you like to cancel RSVP?",
                icon: "info",
                confirmButtonText: "Cancel RSVP",
                confirmButtonColor:"red",
                showCloseButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                    user.ifRSVP = false;
                    swalWithBootstrapButtons.fire({
                    title: "Canceled!",
                    text: "Your RSVP has been canceled.",
                    confirmButtonColor:"green",
                    icon: "error"
                  });
                }});
        }
        else
        {
            swalWithBootstrapButtons.fire({
                title: "No RSVP found",
                text: "Would you like to RSVP?",
                icon: "info",
                confirmButtonText: "RSVP",
                confirmButtonColor:"green",
                showCloseButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                    user.ifRSVP = true;
                    swalWithBootstrapButtons.fire({
                    title: "RSVP'ed!",
                    text: "Your file has been logged.",
                    confirmButtonColor:"green",
                    icon: "success"
                  });
                }});
        }





}