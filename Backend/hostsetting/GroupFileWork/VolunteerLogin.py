import json
from .VolunteerProfile import profile_data_store
from .VolunteerSignup import user_data_store, VolunteerSignup

class VolunteerLogin:
    
    @staticmethod
    def authenticate(email, password):
        
        VolunteerSignup.initialize_admins()
        
        if email in user_data_store and user_data_store[email]['password'] == password:
            return True
        return False

    @staticmethod
    def main_function(data):
        email = data.get('email', '')
        password = data.get('password', '')

        if VolunteerLogin.authenticate(email, password):
            profile = profile_data_store.get(email, None)
            role = user_data_store[email]['role']

            response = {
                'status': 'success',
                'message': 'Login successful',
                'profile': profile,
                'role': role  # Include role in the response
            }
        else:
            response = {'status': 'error', 'message': 'Invalid email or password'}
        
        return response
