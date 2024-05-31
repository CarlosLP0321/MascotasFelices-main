from django.contrib import admin

# Register your models here.
from .models import Duenos, Desparasitaciones, Mascotas, Citas

admin.site.register(Duenos)
admin.site.register(Desparasitaciones)
admin.site.register(Mascotas)
admin.site.register(Citas)
