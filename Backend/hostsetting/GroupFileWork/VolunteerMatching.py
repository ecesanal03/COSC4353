from hostsetting.models import EventDetails
from django.core.exceptions import ObjectDoesNotExist

class VolunteerMatching:

    @staticmethod
    def if_matched(userInfo):
        """
        Check if the user's skills match with any event's required skills.
        userInfo['skills'] is assumed to be a list of skill names or IDs.
        """
        user_skills = userInfo.get('skills', [])
        matched_events = []

        # Fetch all events
        events = EventDetails.objects.all()

        for event in events:
            # Get the required skills for the event as a list of skill names
            required_skills = event.required_skills.values_list('name', flat=True)

            # Check if any of the user's skills match the required skills for this event
            if any(skill in required_skills for skill in user_skills):
                event.if_matched = True
                matched_events.append(event)
            else:
                event.if_matched = False

            # Save the updated matched status
            event.save()

        return matched_events

    @staticmethod
    def get_data():
        """Get the latest event data from EventDetails."""
        events = EventDetails.objects.all()

        serialized_events = []
        for event in events:
            event_data = {
                'eventID': event.id,
                'eventName': event.event_name,
                'location': event.location,
                'urgency': event.urgency,
                'eventDate': event.event_date.isoformat() if event.event_date else None,
                'requiredSkills': list(event.required_skills.values_list('name', flat=True)),  # Skill names
                'eventImage': event.event_image,
                'ifRSVP': event.if_rsvp,
                'ifMatched': event.if_matched
            }
            serialized_events.append(event_data)

        return serialized_events

    @staticmethod
    def set_data(event_id, if_rsvp_result):
        """Set RSVP status for a specific event."""
        try:
            event = EventDetails.objects.get(id=event_id)  # Fetch the event by its ID
            event.if_rsvp = if_rsvp_result
            event.save()
        except ObjectDoesNotExist:
            print(f"Event with ID {event_id} not found.")

    @staticmethod
    def main_function(json_data):
        """Handle RSVP actions."""
        if json_data.get('action') == 'rsvp':
            VolunteerMatching.set_data(json_data['eventID'], True)
        elif json_data.get('action') == 'cancel_rsvp':
            VolunteerMatching.set_data(json_data['eventID'], False)

    @staticmethod
    def function_display():
        """Example function to display confirmation."""
        print("RSVP action confirmed")