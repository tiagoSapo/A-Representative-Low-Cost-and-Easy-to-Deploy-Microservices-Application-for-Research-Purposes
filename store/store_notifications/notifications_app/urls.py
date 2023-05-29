
from django.contrib import admin
from django.urls import path, include

from notifications_app.views import NotificationList, NotificationDetails

urlpatterns = [
    path('notification/', NotificationList.as_view(), name="notification-list"),
    path('notification/<int:pk>', NotificationDetails.as_view(), name="notification-details")
]
