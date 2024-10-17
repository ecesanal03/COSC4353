import json
import re

# In-memory storage for users
user_data_store = {}

class VolunteerSignup:
    
    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email)
    
    @staticmethod
    def validate_password(password):
        return len(password) >= 8

    @staticmethod
    def save_user_data(email, password):
        # Save user data in the dictionary
        if email in user_data_store:
            return {'status': 'error', 'message': 'Email already registered'}
        
        user_data_store[email] = password
        return {'status': 'success', 'message': 'User registered successfully'}

    @staticmethod
    def main_function(data):
        email = data.get('email', '')
        password = data.get('password', '')
        print(f"Received email: {email}, password: {password}")  # Debugging statement
        if not VolunteerSignup.validate_email(email):
            response = {'status': 'error', 'message': 'Invalid email format'}
        elif not VolunteerSignup.validate_password(password):
            response = {'status': 'error', 'message': 'Password must be at least 8 characters'}
        else:
            response = VolunteerSignup.save_user_data(email, password)
        
        return response
