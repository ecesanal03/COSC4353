from hostsetting.models import UserProfile, UserCredentials, States, Skill

class VolunteerProfile:

    @staticmethod
    def save_profile_data(data):
        """Save or update the profile data in the PostgreSQL database."""
        email = data.get('email')

        try:
            # Fetch the user associated with the email
            user = UserCredentials.objects.get(email=email)
        except UserCredentials.DoesNotExist:
            return {'status': 'error', 'message': 'User not found'}

        # Ensure availability is formatted correctly (as a list or a single value)
        availability = data.get('availability')
        if isinstance(availability, str):
            availability = [availability]  # Wrap in a list if it's a single date string

        print(f"Availability received: {availability}")  # Log to ensure correct format

        # Ensure state is correctly set
        state_code = data.get('state')
        try:
            state = States.objects.get(state_code=state_code)
        except States.DoesNotExist:
            return {'status': 'error', 'message': 'Invalid state code'}

        # First, create or update the user profile (excluding skills)
        profile, created = UserProfile.objects.update_or_create(
            user=user,  # Link profile to the user
            defaults={
                'first_name': data.get('firstName'),
                'last_name': data.get('lastName'),
                'address': data.get('address1'),
                'city': data.get('city'),
                'state': state,  # Ensure state is a States instance
                'zipcode': data.get('zipCode'),
                'preferences': data.get('preferences', ''),
                'availability': availability  # Handle the availability correctly
            }
        )

        # Now handle the skills (ManyToMany field)
        skill_names = data.get('skills', [])
        # Fetch or create the Skill instances based on the provided skill names
        skill_instances = [Skill.objects.get_or_create(name=skill)[0] for skill in skill_names]
        
        # Assign the skills to the profile using set()
        profile.skills.set(skill_instances)

        if created:
            return {'status': 'success', 'message': 'Profile created successfully'}
        else:
            return {'status': 'success', 'message': 'Profile updated successfully'}

    @staticmethod
    def main_function(data):
        """Main entry point for handling profile data."""
        validation_response = VolunteerProfile.validate_profile(data)

        if validation_response['status'] == 'error':
            return validation_response

        save_response = VolunteerProfile.save_profile_data(data)
        return save_response

    @staticmethod
    def validate_profile(data):
        """Validate profile data before saving."""
        required_fields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zipCode', 'skills', 'availability']

        for field in required_fields:
            if not data.get(field):
                return {'status': 'error', 'message': f'Missing or invalid field: {field}'}

        if len(data.get('zipCode', '')) < 5:
            return {'status': 'error', 'message': 'Invalid ZIP code'}

        return {'status': 'success'}

