import re

from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer

from notifications_app.models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"

    def validate_email(self, value):
        pattern = r'^\S+@\S+\.\S+$'
        if not re.match(pattern, value):
            raise ValidationError("" + value + " is not an email")
        return value



