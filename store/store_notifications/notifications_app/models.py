from django.db import models


class Notification(models.Model):
    """
    This class represents an email message to be sent to a Customer
    """

    # email's subject
    subject = models.CharField(max_length=255)

    # email's content and description
    content = models.TextField()

    # customer's email
    email = models.CharField(max_length=255)

    # email's type, for example 'registration message', 'order message', etc
    type = models.CharField(max_length=255)

    def __str__(self):
        return f"[{self.subject}, {self.email}, {self.type}]"

