from django.shortcuts import render
from rest_framework import viewsets
from .models import Duenos, Mascotas, Desparasitaciones, Citas
from .serializers import DuenosSerializer, DesparasitacionesSerializer, MascotasSerializer, CitasSerializer

# Create your views here.
class DuenosViewSet(viewsets.ModelViewSet):
    queryset = Duenos.objects.all()
    serializer_class = DuenosSerializer
    permission_classes = []

class DesparasitacionesViewSet(viewsets.ModelViewSet):
    queryset = Desparasitaciones.objects.all()
    serializer_class = DesparasitacionesSerializer
    permission_classes = []

class MascotasViewSet(viewsets.ModelViewSet):
    queryset = Mascotas.objects.all()
    serializer_class = MascotasSerializer
    permission_classes = []

class CitasViewSet(viewsets.ModelViewSet):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer
    permission_classes = []