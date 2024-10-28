from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role='volunteer'):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), role=role)
        user.set_password(password)  # Encrypts the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        return self.create_user(email, password, role='admin')
    
    
    
class UserCredentials(AbstractBaseUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('volunteer', 'Volunteer')])
    
    objects = UserManager()  # Custom manager for creating users
    
    USERNAME_FIELD = 'email'
    
    def __str__(self):
        return self.email
    
    
# Skill model for Many-to-Many relationship
class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# UserProfile table
class UserProfile(models.Model):
    user = models.OneToOneField(UserCredentials, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.ForeignKey('States', on_delete=models.SET_NULL, null=True, blank=True)
    zipcode = models.CharField(max_length=10)
    skills = models.ManyToManyField(Skill, blank=True)  # Many-to-Many relationship for skills
    preferences = models.TextField(blank=True, null=True)
    availability = models.JSONField()  # Array field for available dates

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# EventDetails table
class EventDetails(models.Model):
    event_name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    required_skills = models.ManyToManyField(Skill, blank=True)  # Many-to-Many relationship for skills
    urgency = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])
    event_date = models.DateTimeField()
    creator_email = models.EmailField()  
    event_image = models.URLField()  

    def __str__(self):
        return self.event_name


# VolunteerHistory table
class VolunteerHistory(models.Model):
    user = models.ForeignKey(UserCredentials, on_delete=models.CASCADE)
    event = models.ForeignKey(EventDetails, on_delete=models.CASCADE)
    participation_status = models.BooleanField(default=False)
    matched_status = models.BooleanField(default=False)  # Matching status

    class Meta:
        unique_together = ('user', 'event')  # Ensures unique RSVP status per user-event

    def __str__(self):
        return f"{self.user.email} - {self.event.event_name} RSVP: {self.participation_status}"


# States table
class States(models.Model):
    state_code = models.CharField(max_length=2, unique=True)
    state_name = models.CharField(max_length=50)

    def __str__(self):
        return self.state_name
