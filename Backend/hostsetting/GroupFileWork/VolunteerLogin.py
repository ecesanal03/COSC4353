import json
from .VolunteerProfile import profile_data_store
from .VolunteerSignup import user_data_store

class VolunteerLogin:
    
    @staticmethod
    def authenticate(email, password):
        if email in user_data_store and user_data_store[email] == password:
            return True
        return False

    @staticmethod
    def main_function(data):
        email = data.get('email', '')
        password = data.get('password', '')

        if VolunteerLogin.authenticate(email, password):
            profile = profile_data_store.get(email, None)

            response = {
                'status': 'success',
                'message': 'Login successful',
                'profile': profile
            }
        else:
            response = {'status': 'error', 'message': 'Invalid email or password'}
        
        return response
