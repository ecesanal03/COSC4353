from hostsetting.models import VolunteerHistory, EventDetails, UserCredentials
from django.core.exceptions import ObjectDoesNotExist
import json

class VolunteerRSVPHandler:
    """Handles RSVP actions for volunteer events on a per-user basis."""

    @staticmethod
    def handle_action(json_data):
        """Main function to process RSVP actions based on the provided JSON data."""
        print(json_data)
        if json_data.get('action') == 'rsvp':
            VolunteerRSVPHandler.confirm_rsvp()
        user_id = json_data.get('userID')
        event_id = json_data.get('eventID')
        action = json_data.get('action')
        VolunteerRSVPHandler.set_data(user_id, event_id, action == 'rsvp')

    @staticmethod
    def confirm_rsvp():
        """Example function to display confirmation."""
        print("RSVP action confirmed")

    @staticmethod
    def get_user_event_data(user_id):
        """Get volunteer history data for a specific user."""
        try:
            user = UserCredentials.objects.get(id=user_id)
            volunteer_history = VolunteerHistory.objects.filter(user=user)  # Fetch only this user's volunteer history
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
        except UserCredentials.DoesNotExist:
            print(f"User with ID {user_id} not found.")
            return []

    @staticmethod
    def set_data(user_id, event_id, rsvp_status):
        """Update RSVP status for a specific event for a specific user."""
        try:
            user = UserCredentials.objects.get(id=user_id)  # Fetch the user by their ID
            event = EventDetails.objects.get(id=event_id)  # Fetch the event by its ID
            history, created = VolunteerHistory.objects.update_or_create(
                user=user,
                event=event,
                defaults={'participation_status': rsvp_status}
            )
            if created:
                print(f"Created new volunteer history for user {user.email} and event {event.event_name}")
            else:
                print(f"Updated RSVP status for user {user.email} and event {event.event_name}")
        except (UserCredentials.DoesNotExist, EventDetails.DoesNotExist):
            print(f"User with ID {user_id} or Event with ID {event_id} not found.")

    @staticmethod
    def send_event_data(websocket, user_id):
        """Send event data over WebSocket for a specific user."""
        events = VolunteerRSVPHandler.get_user_event_data(user_id)  # Fetch only the user's event data
        message = {
            "events": events
        }
        websocket.send(json.dumps(message))  # Send the data as a JSON message