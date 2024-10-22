import json
import re
from hostsetting.models import UserCredentials
from django.contrib.auth.hashers import make_password

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
            # Use Django ORM to check if the user exists
            if not UserCredentials.objects.filter(email=email).exists():
                UserCredentials.objects.create(
                    email=email,
                    password=make_password(info['password']),  
                    role=info['role']
                )
                print(f"Admin {email} added to UserCredentials model.")
    
    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email)
    
    @staticmethod
    def validate_password(password):
        return len(password) >= 8

    @staticmethod
    def save_user_data(email, password):
        if UserCredentials.objects.filter(email=email).exists():
            return {'status': 'error', 'message': 'Email already registered'}
        
        UserCredentials.objects.create(
            email=email,
            password=make_password(password),  # Hash the password
            role='volunteer'  # Default role for newly signed up users
        )
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