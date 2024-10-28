from hostsetting.models import EventDetails, UserProfile, UserCredentials, VolunteerHistory
from django.core.exceptions import ObjectDoesNotExist

class VolunteerMatching:

    @staticmethod
    def if_matching(user_credential):
        """Check if the user's skills match with any event's required skills."""
        try:
            user = UserCredentials.objects.get(email=user_credential)
            user_profile = UserProfile.objects.get(user=user)
        except (UserCredentials.DoesNotExist, UserProfile.DoesNotExist):
            print("User or user profile not found.")
            return []

        user_skills = user_profile.skills.all()
        matched_events = []

        events = EventDetails.objects.all()
        for event in events:
            if event.required_skills.filter(id__in=user_skills).exists():
                VolunteerHistory.objects.update_or_create(
                    user=user, event=event,
                    defaults={'matched_status': True}
                )
                matched_events.append(event)
            else:
                VolunteerHistory.objects.update_or_create(
                    user=user, event=event,
                    defaults={'matched_status': False}
                )

        return matched_events

    @staticmethod
    def get_user_events(user):
        """Get all events along with user-specific RSVP and matched statuses."""
        events = EventDetails.objects.all()
        serialized_events = []

        for event in events:
            try:
                history = VolunteerHistory.objects.get(user=user, event=event)
                rsvp_status = history.participation_status
                matched_status = history.matched_status
            except VolunteerHistory.DoesNotExist:
                rsvp_status = False
                matched_status = False

            serialized_events.append({
                'eventID': event.id,
                'eventName': event.event_name,
                'location': event.location,
                'urgency': event.urgency,
                'eventDate': event.event_date.isoformat() if event.event_date else None,
                'requiredSkills': list(event.required_skills.values_list('name', flat=True)),
                'eventImage': event.event_image,
                'ifRSVP': rsvp_status,
                'ifMatched': matched_status
            })

        return serialized_events

    @staticmethod
    def set_rsvp_status(user, event_id, rsvp_status):
        """Set RSVP status for a specific event for the user."""
        try:
            event = EventDetails.objects.get(id=event_id)
            VolunteerHistory.objects.update_or_create(
                user=user,
                event=event,
                defaults={'participation_status': rsvp_status}
            )
        except EventDetails.DoesNotExist:
            print(f"Event with ID {event_id} not found.")