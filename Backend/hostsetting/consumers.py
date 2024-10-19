"""consumer class"""
import json
import time
import pickle
import os
from pathlib import Path
from threading import Thread
import datetime
from redmail import outlook
from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from hostsetting.GroupFileWork.VolunteerSignup import VolunteerSignup
from hostsetting.GroupFileWork.VolunteerSignup import user_data_store
from hostsetting.GroupFileWork.VolunteerLogin import VolunteerLogin
from hostsetting.GroupFileWork.VolunteerProfile import VolunteerProfile, profile_data_store
from hostsetting.GroupFileWork.VolunteerManagement import EventManagement, event_data_store


from .GroupFileWork import VolunteerMatching,VolunteerHistory,VolunteerManagement
#import logging


class SocketConsumer(WebsocketConsumer):
    """Asynchronous method of communication"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.front_end_page = ""
        self.profile_need_update = True#need this to update when first enter page or user press submit

    def connect(self):    
        VolunteerSignup.initialize_admins()
        self.room_name = 'event'
        self.room_group_name = self.room_name+"_sharif"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        # if server_core["toggle_report"] is True:
        #     server_core["toggle_report"] = False
        #     self.send_message(f'{str(datetime.datetime.now())},\n')
        # else:
        #     async_to_sync(self.channel_layer.group_send)(
        #     'event_sharif',
        #     {
        #         'type': 'send_message',
        #         'message': "\nWelcome back!!!\n\n"
        #     })


    def disconnect(self, code):
        """handle disconnection"""       
        pass
    
    def is_authenticated(self, text_data_json):
        """Check if the user is authenticated based on the email in user_data_store"""
        email = text_data_json.get('email')
        if email and email in user_data_store:
            return True
        return False

    def receive(self, text_data):
        """Handle incoming WebSocket messages from clients"""
        text_data_json = json.loads(text_data)
        print(f"Received JSON: {text_data_json}")

        if 'page_loc' in text_data_json:
            self.front_end_page = text_data_json['page_loc']
            print(f"Page location: {self.front_end_page}")

            # Ensure user is authenticated for non-signup pages
            if self.front_end_page != "VolunteerSignup" and not self.is_authenticated(text_data_json):
                self.send(text_data=json.dumps({
                    'status': 'error',
                    'message': 'User not authenticated. Please log in or sign up.'
                }))
                return

            # Handle specific page locations
            if self.front_end_page == "VolunteerSignup":
                self.handle_volunteer_signup(text_data_json)

            elif self.front_end_page == "VolunteerLogin":
                self.handle_volunteer_login(text_data_json)

            elif self.front_end_page == "VolunteerProfile":
                self.handle_volunteer_profile(text_data_json)

            elif self.front_end_page == "VolunteerMatching":
                self.handle_volunteer_matching(text_data_json)

            elif self.front_end_page == "VolunteerManagement":
                self.handle_event_management(text_data_json)

            elif self.front_end_page == "VolunteerHistory":
                self.handle_volunteer_history()

        else:
            print("No page_loc found in the received data")

    def handle_volunteer_signup(self, data):
        """Handle volunteer signup"""
        print('VolunteerSignup triggered')
        response = VolunteerSignup.main_function(data)
        print(f'Sending Signup Response: {response}')
        self.send(text_data=json.dumps(response))

    def handle_volunteer_login(self, data):
        """Handle volunteer login"""
        print('VolunteerLogin triggered')
        response = VolunteerLogin.main_function(data)
        print(f'Sending Login Response: {response}')
        self.send(text_data=json.dumps(response))

    def handle_volunteer_profile(self, data):
        """Handle volunteer profile"""
        print('VolunteerProfile triggered')
        response = VolunteerProfile.main_function(data)
        print(f'Profile Response: {response}')
        if response['status'] == 'success':
            self.profile_need_update = True
        self.send(text_data=json.dumps(response))

    def handle_volunteer_matching(self, data):
        """Handle volunteer matching (fetching events)"""
        print("VolunteerMatching triggered. Fetching events data...")
        
        if 'action' in data:
            event_id = data.get('eventID')
            if data['action'] == 'rsvp':
                print(f"RSVPing to event {event_id}")
                VolunteerMatching.set_data(event_id, True)  # Mark RSVP as True
            elif data['action'] == 'cancel_rsvp':
                print(f"Canceling RSVP for event {event_id}")
                VolunteerMatching.set_data(event_id, False)  # Mark RSVP as False
                
        if self.profile_need_update:
            self.profile_need_update = False
            email = data.get('email')
            if email in profile_data_store:
                VolunteerMatching.if_matched(profile_data_store[email])

        events_data = VolunteerMatching.get_data()
        if events_data:
            print(f"Events data found: {events_data}")
            self.send(text_data=json.dumps({
                "populate_data": True,
                "events": events_data
            }))
        else:
            print("No events data found.")
            self.send(text_data=json.dumps({
                "populate_data": False,
                "message": "No events available."
            }))

    def handle_volunteer_history(self):
        """Handle volunteer history (fetching past events)"""
        events_data = VolunteerMatching.get_data()
        if events_data:
            print(f"Volunteer history data found: {events_data}")
            self.send(text_data=json.dumps({
                "populate_data": True,
                "events": events_data
            }))
        else:
            print("No volunteer history data found.")
            self.send(text_data=json.dumps({
                "populate_data": False,
                "message": "No volunteer history available."
            }))

    def handle_event_management(self, data):
        """Handle event management (create, fetch, update events)"""
        action = data.get('action')
        
        if action == "create_event":
            print("Creating event...")
            response = EventManagement.create_event(data)
            print(f"Create event response: {response}")

            # If the event creation was successful, broadcast the new event to all connected clients
            if response['status'] == 'success':
                new_event = {
                    'status': 'new_event',
                    'events': EventManagement.get_events()  # Fetch all updated events
                }
                # Broadcast to all clients in the 'event_sharif' group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,  # Your room group name
                    {
                        'type': 'send_message',  # The handler in the consumer
                        'message': json.dumps(new_event)
                    }
                )
            self.send(text_data=json.dumps(response))

        elif action == "fetch_events":
            print("Fetching events...")
            events = EventManagement.get_events()
            if events:
                print(f"Fetched events: {events}")
                self.send(text_data=json.dumps({
                    'status': 'success',
                    'events': events
                }))
            else:
                self.send(text_data=json.dumps({
                    'status': 'error',
                    'message': 'No events available.'
                }))

        elif action == "update_event":
            print("Updating event...")
            response = EventManagement.update_event(data)
            print(f"Update event response: {response}")
            self.send(text_data=json.dumps(response))

        elif action == "delete_event":
            print("Deleting event...")
            event_id = data.get('eventID')
            response = EventManagement.delete_event(event_id)
            print(f"Delete event response: {response}")
            self.send(text_data=json.dumps(response))

        else:
            self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Invalid action for event management'
            }))

    def send_message(self, event):
        """Send a message to the WebSocket"""
        message = event['message']
        self.send(text_data=message)
        
            




