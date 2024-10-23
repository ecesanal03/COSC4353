import json
from django.contrib.auth.hashers import check_password
from hostsetting.models import UserCredentials, UserProfile, Skill, States

class VolunteerLogin:
    
    @staticmethod
    def authenticate(email, password):
        """Authenticate the user by checking password type (hashed or plain text)."""
        try:
            # Find the user by email
            user = UserCredentials.objects.get(email=email)

            # Check if the user is an admin (hashed password)
            if user.role == 'admin':
                # Use check_password for admin, since their passwords are hashed
                if check_password(password, user.password):
                    return user
            else:
                # For volunteers, directly compare the plain text password
                if user.password == password:
                    return user

        except UserCredentials.DoesNotExist:
            return None

    @staticmethod
    def get_profile_data(user):
        """Fetch and format the user's profile data."""
        profile = UserProfile.objects.filter(user=user).first()
        if profile:
            # Structure the profile data for frontend consumption
            profile_data = {
                'firstName': profile.first_name,
                'lastName': profile.last_name,
                'address1': profile.address,
                'city': profile.city,
                'state': profile.state.state_code if profile.state else '',
                'zipCode': profile.zipcode,
                'skills': [skill.name for skill in profile.skills.all()],
                'preferences': profile.preferences,
                'availability': profile.availability
            }
            return profile_data
        return {}

    @staticmethod
    def main_function(data):
        """Handle the login process and return the result with profile information."""
        email = data.get('email', '')
        password = data.get('password', '')

        # Authenticate the user
        user = VolunteerLogin.authenticate(email, password)
        if user:
            # Fetch the user's profile data
            profile_data = VolunteerLogin.get_profile_data(user)
            response = {
                'status': 'success',
                'message': 'Login successful',
                'profile': profile_data,
                'role': user.role
            }
        else:
            response = {'status': 'error', 'message': 'Invalid email or password'}

        return response
