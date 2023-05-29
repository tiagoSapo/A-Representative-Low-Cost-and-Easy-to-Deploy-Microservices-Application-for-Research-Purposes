import logging

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications_app.models import Notification
from notifications_app.serializer import NotificationSerializer

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class NotificationList(APIView):

    def get(self, request):
        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Insert code to send the notification received
        serializer.save()
        logger.error(msg="Notification: " + str(serializer.data))

        return Response(serializer.data, status=status.HTTP_200_OK)


class NotificationDetails(APIView):

    def get_by_id(self, pk):
        try:
            return Notification.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return None

    def get(self, request, pk):
        notification = self.get_by_id(pk=pk)
        if notification is None:
            return Response("There is no notification with id = " + str(pk), status=status.HTTP_400_BAD_REQUEST)

        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        notification = self.get_by_id(pk=pk)
        if notification is None:
            return Response("There is no notification with id = " + str(pk), status=status.HTTP_400_BAD_REQUEST)

        serializer = NotificationSerializer(notification, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update notification
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
        notification = self.get_by_id(pk=pk)
        if notification is None:
            return Response("There is no notification with id = " + str(pk), status=status.HTTP_400_BAD_REQUEST)

        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
