data ={
  "S15598": {
    "eventID": "S15598",
    "ifRSVP": True,
    "eventImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
    "eventName": "Music Concert",
    "eventLocation": "Central Park, NY",
    "eventTime": "2024-09-15 18:00",
    "eventTime": "2024-09-15 18:00",
    "volunteerSkill":["hehe","haha"]
  },
  "S19586": {
    "eventID": "S19586",
    "ifRSVP": False,
    "eventImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
    "eventName": "Art Exhibition",
    "eventLocation": "Downtown Gallery, LA",
    "eventTime": "2024-09-20 10:00",
    "eventTime": "2024-09-20 10:00",
    "volunteerSkill":[]
  }
  
}


def main_function(json):
    print(json)
    print(json)
    if (json['action'] == 'rsvp'):
        function_display()
    set_data(json['eventID'],json['action'])
        
def function_display():
    print("Heyyyyyyyyyyyyyyyyyyyyyyyy, rsvp'ed")
    
def get_data():
    return data

def set_data(eventID, ifRSVP_result):
    data[eventID]['ifRSVP'] = ifRSVP_result