from hostsetting.models import VolunteerHistory, EventDetails
from django.core.exceptions import ObjectDoesNotExist
import json

def main_function(json_data):
    """Handle RSVP actions."""
    print(json_data)
    if json_data.get('action') == 'rsvp':
        function_display()
    set_data(json_data['eventID'], json_data['action'])

def function_display():
    """Example function to display confirmation."""
    print("RSVP action confirmed")

def get_data():
    """Get volunteer history data from the database."""
    volunteer_history = VolunteerHistory.objects.all()  # Fetch all volunteer history records
    data = []
    for history in volunteer_history:
        event = history.event
        data.append({
            "eventName": event.event_name,
            "eventLocation": event.location,
            "eventTime": event.event_date.strftime("%Y-%m-%d %H:%M"),
            "ifRSVP": history.participation_status
        })
    return data

def set_data(event_id, if_rsvp_result):
    """Update RSVP status for a specific event in volunteer history."""
    try:
        event = EventDetails.objects.get(id=event_id)  # Fetch the event by its ID
        history = VolunteerHistory.objects.get(event=event)  # Fetch the volunteer history related to the event
        history.participation_status = if_rsvp_result  # Update the RSVP status
        history.save()  # Save the changes to the database
    except ObjectDoesNotExist:
        print(f"Event with ID {event_id} not found or volunteer history does not exist.")

def send_event_data(websocket):
    """Send event data over WebSocket."""
    events = get_data()  # Fetch all event data
    message = {
        "events": events
    }
    websocket.send(json.dumps(message))  # Send the data as a JSON message