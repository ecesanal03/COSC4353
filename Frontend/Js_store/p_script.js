// Function to handle form submission
function submitForm(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    // Get form values
    const eventName = document.getElementById('event').value;
    const eventDescription = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    const requiredSkills = Array.from(document.getElementById('skills').selectedOptions).map(option => option.text);
    const urgency = document.getElementById('urgency').value;
    const eventDate = document.getElementById('date').value;
    
    // Form validation
    if (!eventName || !eventDescription || !location || !requiredSkills.length || !urgency || !eventDate) {
        alert('Please fill out all required fields.');
        return;
    }

    if (eventName.length > 100) {
        alert('Event Name must be under 100 characters.');
        return;
    }

    // Create event object to save
    const eventData = {
        eventName: eventName,
        eventDescription: eventDescription,
        location: location,
        requiredSkills: requiredSkills,
        urgency: urgency,
        eventDate: eventDate
    };

    // Save the event object in localStorage
    saveEvent(eventData);

    // Clear the form after submission
    document.querySelector('form').reset();

    alert('Event saved successfully!');
}

// Function to save event in localStorage
function saveEvent(eventData) {
    // Retrieve existing events from localStorage
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Add the new event to the array
    events.push(eventData);

    // Save the updated events array back to localStorage
    localStorage.setItem('events', JSON.stringify(events));
}

// Add event listener to the form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', submitForm);
});
