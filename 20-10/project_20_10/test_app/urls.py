from django.urls import path
from test_app.views import my_view

urlpatterns = [
    path('', my_view)
]
