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
from hostsetting.GroupFileWork.VolunteerLogin import VolunteerLogin
from hostsetting.GroupFileWork.VolunteerProfile import VolunteerProfile
from hostsetting.GroupFileWork.VolunteerManagement import EventManagement
from hostsetting.GroupFileWork.VolunteerMatching import VolunteerMatching
from hostsetting.models import UserCredentials, EventDetails, VolunteerHistory, UserProfile
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import check_password


from .GroupFileWork import VolunteerHistory,VolunteerManagement
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
    
    def is_authenticated(self, email):
        """Check if the user is authenticated based on the email in the database"""
        try:
            # Check if the user exists in the database
            user = UserCredentials.objects.get(email=email)
            return True
        except UserCredentials.DoesNotExist:
            return False

    def receive(self, text_data):
        """Handle incoming WebSocket messages from clients"""
        text_data_json = json.loads(text_data)
        print(f"Received JSON: {text_data_json}")

        if 'page_loc' in text_data_json:
            self.front_end_page = text_data_json['page_loc']
            print(f"Page location: {self.front_end_page}")

            email = text_data_json.get('email')
            # Ensure user is authenticated for non-signup pages
            if self.front_end_page != "VolunteerSignup" and not self.is_authenticated(email):
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
                self.handle_volunteer_history(text_data_json)

        else:
            print("No page_loc found in the received data")

    def handle_volunteer_signup(self, data):
        """Handle volunteer signup using the database"""
        email = data.get('email')
        password = data.get('password')
        
        # Check if user already exists
        if UserCredentials.objects.filter(email=email).exists():
            response = {'status': 'error', 'message': 'Email already registered'}
        else:
            # Create a new user and save it to the database
            UserCredentials.objects.create(email=email, password=password, role='volunteer')
            response = {'status': 'success', 'message': 'User registered successfully'}
        
        self.send(text_data=json.dumps(response))

    def handle_volunteer_login(self, data):
        """Delegate login handling to VolunteerLogin class"""
        response = VolunteerLogin.main_function(data)  # Use login module for authentication
        self.send(text_data=json.dumps(response))

    def handle_volunteer_profile(self, data):
        """Handle volunteer profile (update or create a profile in the database)"""
        print(f"Handling volunteer profile for email: {data.get('email')}")  # Ensure this is logged

        # Reuse the existing main function for profile handling
        response = VolunteerProfile.main_function(data)

        # Send the response back to the frontend
        self.send(text_data=json.dumps(response))

    def handle_volunteer_matching(self, data):
        """Handle volunteer matching (fetching events from the database and RSVP actions)"""
        print("VolunteerMatching triggered. Fetching events data...")

        # Handle RSVP actions if present in the data
        if 'action' in data:
            event_id = data.get('eventID')
            if data['action'] == 'rsvp':
                print(f"RSVPing to event {event_id}")
                VolunteerMatching.set_data(event_id, True)
            elif data['action'] == 'cancel_rsvp':
                print(f"Canceling RSVP for event {event_id}")
                VolunteerMatching.set_data(event_id, False)

        # Fetch all events data
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

    def get_all_events(self):
        """Fetch all events from the database"""
        return EventManagement.get_events()

    def handle_volunteer_history(self, data):
        """Handle volunteer history (fetching participation history from the database)"""
        email = data.get('email')
        try:
            user = UserCredentials.objects.get(email=email)
            volunteer_history = VolunteerHistory.objects.filter(user=user).values()  # Fetch history data
            if volunteer_history:
                self.send(text_data=json.dumps({
                    "populate_data": True,
                    "events": list(volunteer_history)
                }))
            else:
                self.send(text_data=json.dumps({
                    "populate_data": False,
                    "message": "No volunteer history available."
                }))
        except UserCredentials.DoesNotExist:
            self.send(text_data=json.dumps({
                "status": "error",
                "message": "User not found"
            }))

    def handle_event_management(self, data):
        """Handle event management (create, fetch, update events in the database)"""
        action = data.get('action')

        if action == "create_event":
            response = EventManagement.create_event(data)
            if response['status'] == 'success':
                new_event = {
                    'status': 'new_event',
                    'events': EventManagement.get_events()  # Fetch all updated events
                }
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,  # Your room group name
                    {
                        'type': 'send_message',  # The handler in the consumer
                        'message': json.dumps(new_event)
                    }
                )
            self.send(text_data=json.dumps(response))

        elif action == "fetch_events":
            events = EventManagement.get_events()
            if events:
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
            response = EventManagement.update_event(data)
            self.send(text_data=json.dumps(response))

        elif action == "delete_event":
            event_id = data.get('eventID')
            response = EventManagement.delete_event(event_id)
            self.send(text_data=json.dumps(response))

    def send_message(self, event):
        """Send a message to the WebSocket"""
        message = event['message']
        self.send(text_data=message)
        
            




