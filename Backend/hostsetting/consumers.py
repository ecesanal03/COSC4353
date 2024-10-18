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


from .GroupFileWork import VolunteerMatching,VolunteerHistory,VolunteerManagement
#import logging


class SocketConsumer(WebsocketConsumer):
    """Asynchronous method of communication"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.front_end_page = ""
        self.profile_need_update = True#need this to update when first enter page or user press submit

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
        print('received json', text_data_json) 
        
        if 'page_loc' in text_data_json:
            self.front_end_page = text_data_json['page_loc']
            print(f'Page location received: {self.front_end_page}') 

            if self.front_end_page != "VolunteerSignup" and not self.is_authenticated(text_data_json):
                self.send(text_data=json.dumps({
                    'status': 'error',
                    'message': 'User not authenticated. Please log in or sign up.'
                }))
                return
            

            # Handle page locations
            if self.front_end_page == "socketinit":
                self.send(text_data=json.dumps({"dummy": True}))

            elif self.front_end_page == "VolunteerSignup":
                print('VolunteerSignup triggered')
                response = VolunteerSignup.main_function(text_data_json)
                print(f'Sending Signup Response: {response}')
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerLogin":
                print('VolunteerLogin triggered') 
                response = VolunteerLogin.main_function(text_data_json)
                print(f'Sending Login Response: {response}')
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerMatching":

                print("VolunteerMatching triggered. Fetching events data...")
                if self.profile_need_update == True:
                    self.profile_need_update = False
                    print(profile_data_store)
                    email = text_data_json.get('email')
                    if email in profile_data_store:
                        VolunteerMatching.if_matched(profile_data_store[text_data_json.get('email')])
                            
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

            elif self.front_end_page == "VolunteerProfile":
                print('VolunteerProfile triggered')
                response = VolunteerProfile.main_function(text_data_json)
                print(f'Profile response: {response}') 
                if response['status'] == 'success':
                    self.profile_need_update = True
                self.send(text_data=json.dumps(response))

            elif self.front_end_page == "VolunteerManagement":
                VolunteerManagement.main_function(text_data_json)

            elif self.front_end_page == "VolunteerHistory":
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
        elif 'action' in text_data_json and self.front_end_page == "VolunteerMatching":
            VolunteerMatching.main_function(text_data_json)
        else:
            print('No page_loc in received data')
        
            




