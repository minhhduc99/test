from django.shortcuts import render
from rest_framework import serializers, viewsets
from .models import Card

# Create your views here.

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class CardsViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    queryset = Card.objects.all()
