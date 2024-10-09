# In-memory storage for profile data
profile_data_store = {}

class VolunteerProfile:

    @staticmethod
    def validate_profile(data):
        """Validate profile data before saving."""
        required_fields = ['fullName', 'address1', 'city', 'state', 'zipCode', 'skills', 'availability']
        
        # Ensure all required fields are present and non-empty
        for field in required_fields:
            if not data.get(field):
                return {'status': 'error', 'message': f'Missing or invalid field: {field}'}
        
        # Additional validation can be added here (e.g., ZIP code format, state validation)
        if len(data.get('zipCode', '')) < 5:
            return {'status': 'error', 'message': 'Invalid ZIP code'}
        
        # Passed validation
        return {'status': 'success'}
    
    @staticmethod
    def save_profile_data(data):
        """Save the profile data in-memory (or to a database if needed)."""
        # Use email as the unique key for storing profile data
        email = data.get('email')  # Make sure 'email' is part of the frontend data
        
        if email in profile_data_store:
            return {'status': 'error', 'message': 'Profile already exists for this email'}
        
        # Save the profile
        profile_data_store[email] = data
        return {'status': 'success', 'message': 'Profile saved successfully'}
    
    @staticmethod
    def main_function(data):
        """Main entry point for handling profile data."""
        # Validate profile data
        validation_response = VolunteerProfile.validate_profile(data)
        
        if validation_response['status'] == 'error':
            return validation_response
        
        # Save profile data after validation
        save_response = VolunteerProfile.save_profile_data(data)
        return save_response
