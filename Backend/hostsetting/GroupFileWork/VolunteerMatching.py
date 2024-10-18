data ={
  "S15598": {
    "eventID": "S15598",
    "ifRSVP": True,
    "ifMatched": False,#remember this for database, ifMatched will always false before performing the check
    "eventImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
    "eventName": "Music Concert",
    "eventLocation": "Central Park, NY",
    "eventTime": "2024-09-15 18:00",
    "volunteerSkill":["coding","haha"]
  },
  "S19586": {
    "eventID": "S19586",
    "ifRSVP": False,
    "ifMatched": False,
    "eventImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s",
    "eventName": "Art Exhibition",
    "eventLocation": "Downtown Gallery, LA",
    "eventTime": "2024-09-20 10:00",
    "volunteerSkill":["design"]
  }
  
}
def if_matched(userInfo):

  for i in userInfo["skills"]:# check if skill matched
    for key, value in data.items():
      if i in value["volunteerSkill"]:
        data[key]["ifMatched"] = True
      else:
        data[key]["ifMatched"] = False


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