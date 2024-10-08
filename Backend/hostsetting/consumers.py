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

from . import tempt1
#import logging

class SocketConsumer(WebsocketConsumer):
    """Asynchronous method of communication"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.front_end_page = ""
        # self.flasheart = FlashbeardHeart(5,0,1,2000)
        # self.flasheart.start()

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

        # if (front end saying what page it is)
        #     self.front_end_page = "Volunteer Matchiang"
        
    def disconnect(self, code):
        """handle disconnection"""       
        pass

    def receive(self, text_data):
        """handle message from users"""
        text_data_json = json.loads(text_data)
        print(text_data_json)
        if self.front_end_page == "Volunteer Matching":
            tempt1.main_function(text_data_json)


#state modify function and send data back for color display

#recieve should call the function to send data to, that function also modify value




