# Generated by Django 5.1.1 on 2024-10-28 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hostsetting', '0004_eventdetails_if_matched'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eventdetails',
            name='if_matched',
        ),
        migrations.RemoveField(
            model_name='eventdetails',
            name='if_rsvp',
        ),
        migrations.AddField(
            model_name='volunteerhistory',
            name='matched_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterUniqueTogether(
            name='volunteerhistory',
            unique_together={('user', 'event')},
        ),
    ]
