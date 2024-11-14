# Generated by Django 5.1.1 on 2024-10-28 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hostsetting', '0005_remove_eventdetails_if_matched_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='volunteerhistory',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='eventdetails',
            name='if_matched',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='eventdetails',
            name='if_rsvp',
            field=models.BooleanField(default=False),
        ),
        migrations.RemoveField(
            model_name='volunteerhistory',
            name='matched_status',
        ),
    ]