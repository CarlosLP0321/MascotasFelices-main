from rest_framework import serializers
from .models import Duenos, Mascotas, Desparasitaciones, Citas

class DuenosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duenos
        fields = '__all__'

class DesparasitacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desparasitaciones
        fields = '__all__'

class MascotasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = '__all__'

class CitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citas
        fields = '__all__'