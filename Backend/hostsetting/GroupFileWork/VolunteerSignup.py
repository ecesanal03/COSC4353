import json
import re

user_data_store = {}

class VolunteerSignup:
    
    admin_credentials = {
        'admin1@example.com': {
            'password': 'AdminPassword123',
            'role': 'admin'
        },
        'admin2@example.com': {
            'password': 'AdminPassword456',
            'role': 'admin'
        }
    }

    @staticmethod
    def initialize_admins():
        for email, info in VolunteerSignup.admin_credentials.items():
            if email not in user_data_store:
                user_data_store[email] = info
                print(f"Admin {email} added to user_data_store.")
    
    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email)
    
    @staticmethod
    def validate_password(password):
        return len(password) >= 8

    @staticmethod
    def save_user_data(email, password):
        if email in user_data_store:
            return {'status': 'error', 'message': 'Email already registered'}
        
        user_data_store[email] = {
            'password': password,
            'role': 'user'  
        }
        return {'status': 'success', 'message': 'User registered successfully'}

    @staticmethod
    def main_function(data):
        VolunteerSignup.initialize_admins()
        email = data.get('email', '')
        password = data.get('password', '')
        print(f"Received email: {email}, password: {password}")
        if not VolunteerSignup.validate_email(email):
            response = {'status': 'error', 'message': 'Invalid email format'}
        elif not VolunteerSignup.validate_password(password):
            response = {'status': 'error', 'message': 'Password must be at least 8 characters'}
        else:
            response = VolunteerSignup.save_user_data(email, password)
        
        return response
