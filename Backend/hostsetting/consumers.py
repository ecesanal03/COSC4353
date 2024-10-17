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
from hostsetting.GroupFileWork.VolunteerProfile import VolunteerProfile


from .GroupFileWork import VolunteerMatching,VolunteerHistory,VolunteerManagement
#import logging


class SocketConsumer(WebsocketConsumer):
    """Asynchronous method of communication"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.front_end_page = ""


    def connect(self):    
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
        """Handle message from users"""
        text_data_json = json.loads(text_data)
        print('received json', text_data_json)  # Debugging statement

        if 'page_loc' in text_data_json:
            self.front_end_page = text_data_json['page_loc']
            print(f'Page location received: {self.front_end_page}')  # Debugging statement

            # Check for user authentication before proceeding
            if self.front_end_page != "VolunteerSignup" and not self.is_authenticated(text_data_json):
                # If the user is not authenticated and is not on the signup page, return an error
                self.send(text_data=json.dumps({
                    'status': 'error',
                    'message': 'User not authenticated. Please log in or sign up.'
                }))
                return

            # Handle page locations
            if self.front_end_page == "socketinit":
                self.send(text_data=json.dumps({"dummy": True}))

            elif self.front_end_page == "VolunteerSignup":
                print('VolunteerSignup triggered')  # Debugging statement
                response = VolunteerSignup.main_function(text_data_json)
                print(f'Sending Signup Response: {response}')  # Debugging statement
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerLogin":
                print('VolunteerLogin triggered')  # Debugging statement
                response = VolunteerLogin.main_function(text_data_json)
                print(f'Sending Login Response: {response}')  # Debugging statement
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerMatching":
                # Log when VolunteerMatching is triggered
                print("VolunteerMatching triggered. Fetching events data...")

                # Fetch data using VolunteerMatching.get_data()
                events_data = VolunteerMatching.get_data()
                if events_data:
                    print(f"Events data found: {events_data}")  # Log the events data
                    self.send(text_data=json.dumps({
                        "populate_data": True,
                        "events": events_data  # Send event data to frontend
                    }))
                else:
                    print("No events data found.")
                    self.send(text_data=json.dumps({
                        "populate_data": False,
                        "message": "No events available."
                    }))

            elif self.front_end_page == "VolunteerProfile":
                print('VolunteerProfile triggered')  # Debugging statement
                response = VolunteerProfile.main_function(text_data_json)
                print(f'Profile response: {response}')  # Debugging statement
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerManagement":
                VolunteerManagement.main_function(text_data_json)

            elif self.front_end_page == "VolunteerHistory":
                VolunteerHistory.main_function(text_data_json)
        else:
            print('No page_loc in received data')  # Debugging statement
        
            



#state modify function and send data back for color display

#recieve should call the function to send data to, that function also modify value




