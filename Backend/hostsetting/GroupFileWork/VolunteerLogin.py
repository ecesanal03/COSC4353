import json
from .VolunteerProfile import profile_data_store
# Reuse the same user_data_store from VolunteerSignup.py
from .VolunteerSignup import user_data_store

class VolunteerLogin:
    
    @staticmethod
    def authenticate(email, password):
        # Check if the email exists and the password matches
        if email in user_data_store and user_data_store[email] == password:
            return True
        return False

    @staticmethod
    def main_function(data):
        email = data.get('email', '')
        password = data.get('password', '')

        if VolunteerLogin.authenticate(email, password):
            # Fetch the user's profile if it exists
            profile = profile_data_store.get(email, None)

            response = {
                'status': 'success',
                'message': 'Login successful',
                'profile': profile  # Return the associated profile if it exists
            }
        else:
            response = {'status': 'error', 'message': 'Invalid email or password'}
        
        return response
