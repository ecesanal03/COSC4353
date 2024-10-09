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

from .GroupFileWork import VolunteerMatching,VolunteerHistory,VolunteerManagement,VolunteerProfile,VolunteerSignup,VolunteerLogin
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

    def receive(self, text_data):
        """handle message from users"""
        # print('raw text is',text_data)
        text_data_json = json.loads(text_data)
        print('recieved json', text_data_json)
        if 'page_loc' in text_data_json:
            self.front_end_page = text_data_json['page_loc']
            if self.front_end_page== "socketinit":
                self.send(text_data=json.dumps({"dummy":True}))
            elif self.front_end_page == "VolunteerMatching": 
                self.send(text_data=json.dumps({"populate_data": True,
                            "events":VolunteerMatching.get_data()}))
        else:
            if self.front_end_page == "VolunteerSignup":
                VolunteerSignup.main_function(text_data_json)
            elif self.front_end_page == "VolunteerLogin":
                VolunteerLogin.main_function(text_data_json)
            elif self.front_end_page == "VolunteerProfile":
                VolunteerProfile.main_function(text_data_json)
            elif self.front_end_page == "VolunteerManagement":
                VolunteerManagement.main_function(text_data_json)
            elif self.front_end_page == "VolunteerMatching":
                VolunteerMatching.main_function(text_data_json)
                print(VolunteerMatching.get_data())
            elif self.front_end_page == "VolunteerHistory":
                VolunteerHistory.main_function(text_data_json)
        
            



#state modify function and send data back for color display

#recieve should call the function to send data to, that function also modify value




