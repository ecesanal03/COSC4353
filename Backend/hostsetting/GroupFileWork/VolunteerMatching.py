from hostsetting.models import EventDetails, UserProfile, UserCredentials
from django.core.exceptions import ObjectDoesNotExist

class VolunteerMatching:

    @staticmethod
    def ifMatching(user_credential):
        """
        Check if the user's skills match with any event's required skills.
        user_id: ID of the user for whom we're checking skill matches.
        """
        print('\n\n\n\nIFMATCHHHHHHHH\n\n\n\n\n\n')
        user = UserCredentials.objects.get(email=user_credential)
        try:
            user_profile = UserProfile.objects.get(user_id=user.id)
            print(f'\n\n\n User ID is {user.id} \n\n\n')
        except UserProfile.DoesNotExist:
            print("User profile not found.")
            return []

        user_skills = user_profile.skills.all()

        matched_events = []

        events = EventDetails.objects.all()

        for event in events:
            if event.required_skills.filter(id__in=user_skills).exists():
                event.if_matched = True
                matched_events.append(event)
            else:
                event.if_matched = False
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
                'requiredSkills': list(event.required_skills.values_list('name', flat=True)), 
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
            event = EventDetails.objects.get(id=event_id)
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