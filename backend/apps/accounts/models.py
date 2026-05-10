from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UsuarioManager


class Usuario(AbstractBaseUser, PermissionsMixin):

    ROL_ESTUDIANTE = 'estudiante'
    ROL_DOCENTE = 'docente'
    ROL_ADMINISTRADOR = 'administrador'

    ROL_CHOICES = [
        (ROL_ESTUDIANTE, 'Estudiante'),
        (ROL_DOCENTE, 'Docente'),
        (ROL_ADMINISTRADOR, 'Administrador'),
    ]

    email = models.EmailField(unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default=ROL_ESTUDIANTE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    objects = UsuarioManager()

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.nombre} {self.apellido} <{self.email}>'

    @property
    def nombre_completo(self):
        return f'{self.nombre} {self.apellido}'


class PerfilVARK(models.Model):

    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='perfil_vark',
        db_column='usuario_id',
    )
    puntaje_visual = models.FloatField(default=0.0)
    puntaje_auditivo = models.FloatField(default=0.0)
    puntaje_lectura = models.FloatField(default=0.0)
    puntaje_kinestesico = models.FloatField(default=0.0)
    test_completado = models.BooleanField(default=False)
    fecha_test = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'perfil_vark'
        verbose_name = 'Perfil VARK'
        verbose_name_plural = 'Perfiles VARK'

    def __str__(self):
        return f'Perfil VARK — {self.usuario}'

    @property
    def vector(self):
        return {
            'V': self.puntaje_visual,
            'A': self.puntaje_auditivo,
            'R': self.puntaje_lectura,
            'K': self.puntaje_kinestesico,
        }


class SesionTestVARK(models.Model):

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='sesiones_test_vark',
        db_column='usuario_id',
    )
    preguntas_json = models.JSONField()
    completado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sesion_test_vark'
        verbose_name = 'Sesión Test VARK'
        verbose_name_plural = 'Sesiones Test VARK'

    def __str__(self):
        estado = 'completado' if self.completado else 'pendiente'
        return f'Test de {self.usuario} — {estado}'
