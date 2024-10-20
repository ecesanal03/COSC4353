import json

data = {
    "S15598": {
        "ifRSVP": True,
        "eventName": "Music Concert",
        "eventLocation": "Central Park, NY",
        "eventTime": "2024-09-15 18:00",
    },
    "S19586": {
        "ifRSVP": False,
        "eventName": "Art Exhibition",
        "eventLocation": "Downtown Gallery, LA",
        "eventTime": "2024-09-20 10:00",
    },
    "S155953": {
        "ifRSVP": True,
        "eventName": "Pottery",
        "eventLocation": "Seattle, WA",
        "eventTime": "2024-09-15 5:00",
    },
}

def main_function(json):
    print(json)
    if json.get('action') == 'rsvp':
        function_display()
    set_data(json['eventID'], json['action'])

def function_display():
    print("Heyyyyyyyyyyyyyyyyyyyyyyyy, rsvp'ed")

def get_data():
    return list(data.values()) 

def set_data(eventID, ifRSVP_result):
    data[eventID]['ifRSVP'] = ifRSVP_result

def send_event_data(websocket):
    events = get_data()
    message = {
        "events": events
    }
    websocket.send(json.dumps(message))