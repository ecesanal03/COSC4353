import uuid
event_data_store = {}

class EventManagement:

    @staticmethod
    def create_event(event_data):
        event_name = event_data.get('eventName')
        event_description = event_data.get('eventDescription')
        event_location = event_data.get('location')
        event_skills = event_data.get('requiredSkills')
        event_urgency = event_data.get('urgency')
        event_date = event_data.get('eventDate')
        creator_email = event_data.get('email')
        event_image = event_data.get('eventImage')
        if_rsvp = event_data.get('ifRSVP', False)

       
        event_id = str(uuid.uuid4())  
        
        for event in event_data_store.values():
            if (
                event['eventName'] == event_name and
                event['location'] == event_location and
                event['eventDate'] == event_date
            ):
                return {'status': 'error', 'message': 'Duplicate event found'}

        # Add the event to the event_data_store
        event_data_store[event_id] = {
            'eventID': event_id,
            'eventName': event_name,
            'eventDescription': event_description,
            'location': event_location,
            'requiredSkills': event_skills,
            'urgency': event_urgency,
            'eventDate': event_date,
            'creatorEmail': creator_email,
            'eventImage': event_image,
            'ifRSVP': if_rsvp  
        }

        return {'status': 'success', 'message': f'Event "{event_name}" created successfully', 'eventID': event_id}

    @staticmethod
    def update_event(data):
        """Update an existing event in the event_data_store"""
        event_id = data.get("eventID")
        if event_id not in event_data_store:
            return {
                'status': 'error',
                'message': 'Event ID not found'
            }
        event_data_store[event_id].update({
            'eventName': data.get('eventName'),
            'eventDescription': data.get('eventDescription'),
            'location': data.get('location'),
            'requiredSkills': data.get('requiredSkills', []),
            'urgency': data.get('urgency'),
            'eventDate': data.get('eventDate'),
            'ifRSVP': data.get('ifRSVP', False),  # Persist RSVP status
            'eventImage': data.get('eventImage')
        })
        return {
            'status': 'success',
            'message': 'Event updated successfully',
            'eventID': event_id
        }

    @staticmethod
    def delete_event(event_id):
        """Delete an event from event_data_store"""
        if event_id not in event_data_store:
            return {
                'status': 'error',
                'message': 'Event ID not found'
            }
        del event_data_store[event_id]
        return {
            'status': 'success',
            'message': f'Event {event_id} deleted successfully'
        }

    @staticmethod
    def get_events():
        """Return all events from event_data_store"""
        return event_data_store
