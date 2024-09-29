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
from . import Gpio_control,skeletonclass

#import logging

server_core = {'current_state':'Stop','toggle_report' : True}


class SocketConsumer(WebsocketConsumer):
    """Asynchronous method of communication"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
        if server_core["toggle_report"] is True:
            server_core["toggle_report"] = False
            self.send_message(f'{str(datetime.datetime.now())},\n')
        else:
            async_to_sync(self.channel_layer.group_send)(
            'event_sharif',
            {
                'type': 'send_message',
                'message': "\nWelcome back!!!\n\n"
            })
    def disconnect(self, code):
        """handle disconnection"""       
        pass

    def receive(self, text_data):
        """handle message from users"""
        text_data_json = json.loads(text_data)
        message, change_mode = text_data_json["message"],text_data_json["next_state"]
        if change_mode is True:
            self.verify_and_change()
            async_to_sync(self.channel_layer.group_send)(
            'event_sharif',
            {
                'type': 'send_message',
                'message': f"Mode changed to {server_core['current_state']}\n"
            })

        else:
            #save message into local database
            if isinstance(message,str) is False:
                file_path = open(os.path.join(os.path.dirname(__file__), "DjangoStoreMode.txt"),
                                 'wb')
                pickle.dump(message,file_path)
                message = 'Data Saved'
                self.send(text_data=json.dumps({"message": message,
                                    "running_mode":f'{server_core["current_state"]}'}))
            else:
                self.send_batch_report(message)
                self.send(text_data=json.dumps({"message": f'Send report to {message}',
                                    "running_mode":f'{server_core["current_state"]}'}))                

    def send_message(self, event):
        """Send message to users"""
        if isinstance(event,str) is False:
            event = event['message']#event = {'message' : 'something'}
        with open(os.path.join(os.path.dirname(__file__), "info_log.txt"),'w') as file_path:
            file_path.write(str(event))
        self.send(text_data=json.dumps({"message": event,
                                        "running_mode":f'{server_core["current_state"]}'}))

    def emergency_stop(self,event):
        """stop if misaligned"""
        #server_core["current_state"] = 'Idle'
        message = event['message']
        with open(os.path.join(os.path.dirname(__file__), "info_log.txt"),'w') as file_path:
            file_path.write(str(message))
        self.send(text_data=json.dumps({"message": message,
                                        "running_mode":'Idle'}))

    def verify_and_change(self):
        """change button color"""
        if server_core['current_state'] == "Running":
            server_core['current_state'] = 'Idle'
            #self.flasheart.idle_pause()
        elif server_core['current_state'] == "Idle":
            server_core['current_state'] = 'Stop'
            #put a different modification here    #revised this and javascript to color only
                                                #don't need a middle likem red or green
        else:
            server_core['current_state'] = 'Running'

    def send_batch_report(self,reciever):
        """create and send batch report"""
        server_core["toggle_report"]= True
        credential = pickle.load(open(os.path.join(os.path.dirname(__file__), "List1.txt"),'rb'))
        server_core["toggle_report"] = False
        outlook.username = credential[0]
        outlook.password = credential[1]
        try:
            for i in range(1):
                print(reciever)
                outlook.send(
                   receivers=[reciever],
                   subject="This email sent automatic",
                   text="WHATS YOUR BANK ACCOUNT INFO",
                   attachments={
                       'info_log.txt': Path(os.path.join(os.path.dirname(__file__), "info_log.txt"))
                   }
               )
        except:#in case wrong address
            self.send_message('A problem occured during batch report sending process! \n')
#state modify function and send data back for color display

#recieve should call the function to send data to, that function also modify value




