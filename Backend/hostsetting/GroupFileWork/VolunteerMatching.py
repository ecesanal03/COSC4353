from hostsetting.GroupFileWork.VolunteerManagement import EventManagement

def if_matched(userInfo):
    """Check if the user's skills match with any events."""
    events = EventManagement.get_events()  # Fetch the latest events from the event management
    for i in userInfo["skills"]:  # Check each skill of the user
        for key, value in events.items():
            # Match the user's skill with the event's required skills
            if i in value["requiredSkills"]:
                events[key]["ifMatched"] = True
            else:
                events[key]["ifMatched"] = False

def get_data():
    """Get the latest event data from EventManagement."""
    return EventManagement.get_events()  # Fetch fresh data from EventManagement

def set_data(eventID, ifRSVP_result):
    """Set RSVP status for a specific event."""
    events = EventManagement.get_events()  # Fetch fresh event data
    if eventID in events:
        events[eventID]['ifRSVP'] = ifRSVP_result  # Update RSVP status
        EventManagement.update_event(events[eventID])

# Main function for other actions like RSVP
def main_function(json):
    """Handle RSVP actions."""
    if json['action'] == 'rsvp':
        set_data(json['eventID'], True)  # RSVP'd
    elif json['action'] == 'cancel_rsvp':
        set_data(json['eventID'], False)  # Cancel RSVP  # Update the RSVP status

def function_display():
    """Example function to display confirmation."""
    print("Heyyyyyyyyyyyyyyyyyyyyyyyy, rsvp'ed")