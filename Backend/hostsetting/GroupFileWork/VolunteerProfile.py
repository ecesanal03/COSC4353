# In-memory storage for profile data
profile_data_store = {}

class VolunteerProfile:

    @staticmethod
    def save_profile_data(data):
        """Save or update the profile data in-memory (or to a database if needed)."""
        email = data.get('email') 

        if email in profile_data_store:
            profile_data_store[email] = data
            return {'status': 'success', 'message': 'Profile updated successfully'}
            
        else:
            # New profile, create it
            profile_data_store[email] = data
            return {'status': 'success', 'message': 'Profile saved successfully'}

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
        required_fields = ['fullName', 'address1', 'city', 'state', 'zipCode', 'skills', 'availability']
        
        for field in required_fields:
            if not data.get(field):
                return {'status': 'error', 'message': f'Missing or invalid field: {field}'}
        if len(data.get('zipCode', '')) < 5:
            return {'status': 'error', 'message': 'Invalid ZIP code'}
        
        return {'status': 'success'}
