import uuid
import datetime
from hostsetting.models import EventDetails, Skill
from django.core.exceptions import ObjectDoesNotExist

class EventManagement:

    @staticmethod
    def create_event(event_data):
        event_name = event_data.get('eventName')
        event_description = event_data.get('eventDescription')
        event_location = event_data.get('location')
        event_skills = event_data.get('requiredSkills', [])  # This should be a list of skill IDs or names
        event_urgency = event_data.get('urgency')
        event_date = event_data.get('eventDate')
        creator_email = event_data.get('email')
        event_image = event_data.get('eventImage')
        if_rsvp = event_data.get('ifRSVP', False)

        # Check if the event already exists
        try:
            EventDetails.objects.get(
                event_name=event_name,
                location=event_location,
                event_date=event_date
            )
            return {'status': 'error', 'message': 'Duplicate event found'}
        except EventDetails.DoesNotExist:
            pass  # Event does not exist, so we can proceed to create it

        # Create the new event (without required skills for now)
        event = EventDetails.objects.create(
            event_name=event_name,
            description=event_description,
            location=event_location,
            urgency=event_urgency,
            event_date=event_date,
            creator_email=creator_email,
            event_image=event_image,
            if_rsvp=if_rsvp
        )

        # Set the required skills using the set() method
        if event_skills:
            # Fetch or create the skill instances
            skill_instances = [Skill.objects.get_or_create(name=skill)[0] for skill in event_skills]
            event.required_skills.set(skill_instances)

        return {'status': 'success', 'message': f'Event "{event_name}" created successfully', 'eventID': event.id}

    @staticmethod
    def update_event(data):
        """Update an existing event in the database"""
        event_id = data.get("eventID")
        event_skills = data.get('requiredSkills', [])  # This should be a list of skill names or IDs

        try:
            event = EventDetails.objects.get(id=event_id)
        except ObjectDoesNotExist:
            return {
                'status': 'error',
                'message': 'Event ID not found'
            }

        # Update the event data
        event.event_name = data.get('eventName')
        event.description = data.get('eventDescription')
        event.location = data.get('location')
        event.urgency = data.get('urgency')
        event.event_date = data.get('eventDate')
        event.if_rsvp = data.get('ifRSVP', False)  # Persist RSVP status
        event.event_image = data.get('eventImage')

        # Save the updated event to the database
        event.save()

        # Update the required skills using set()
        if event_skills:
            skill_instances = [Skill.objects.get_or_create(name=skill)[0] for skill in event_skills]
            event.required_skills.set(skill_instances)
            
        event_data_response = {
            'status': 'success',
            'message': 'Event updated successfully',
            'eventID': event.id,
            'event_date': event.event_date.isoformat()  # Convert datetime to string
        }

        return event_data_response

    @staticmethod
    def delete_event(event_id):
        """Delete an event from the database"""
        try:
            event = EventDetails.objects.get(id=event_id)
            event.delete()
            return {
                'status': 'success',
                'message': f'Event {event_id} deleted successfully'
            }
        except ObjectDoesNotExist:
            return {
                'status': 'error',
                'message': 'Event ID not found'
            }

    @staticmethod
    def get_events():
        """Return all events from the database with serialized datetime fields"""
        events = EventDetails.objects.all().values()
        serialized_events = []
        
        for event in events:
            event_data = dict(event)
            # Convert the event_date (or any other datetime fields) to ISO 8601 string
            if isinstance(event_data.get('event_date'), datetime.datetime):  # Use datetime.datetime
                event_data['event_date'] = event_data['event_date'].isoformat()
            serialized_events.append(event_data)

        return serialized_events
