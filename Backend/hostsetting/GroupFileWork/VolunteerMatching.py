from hostsetting.GroupFileWork.VolunteerManagement import EventManagement

def if_matched(userInfo):
    """Check if the user's skills match with any events."""
    events = EventManagement.get_events()  
    for i in userInfo["skills"]:  
        for key, value in events.items():
            # Match the user's skill with the event's required skills
            if i in value["requiredSkills"]:
                events[key]["ifMatched"] = True
            else:
                events[key]["ifMatched"] = False

def get_data():
    """Get the latest event data from EventManagement."""
    return EventManagement.get_events()  

def set_data(eventID, ifRSVP_result):
    """Set RSVP status for a specific event."""
    events = EventManagement.get_events()  
    if eventID in events:
        events[eventID]['ifRSVP'] = ifRSVP_result  
        EventManagement.update_event(events[eventID])

# Main function for other actions like RSVP
def main_function(json):
    """Handle RSVP actions."""
    if json['action'] == 'rsvp':
        set_data(json['eventID'], True)  
    elif json['action'] == 'cancel_rsvp':
        set_data(json['eventID'], False)  

def function_display():
    """Example function to display confirmation."""
    print("Heyyyyyyyyyyyyyyyyyyyyyyyy, rsvp'ed")