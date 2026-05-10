from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import PerfilVARK, Usuario


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ['email', 'nombre', 'apellido', 'rol', 'password']

    def validate_email(self, value):
        value = value.lower().strip()
        dominio = getattr(settings, 'DOMINIO_INSTITUCIONAL', '')
        if dominio and not value.endswith(f'@{dominio}'):
            raise serializers.ValidationError(
                f'El correo debe pertenecer al dominio @{dominio}.'
            )
        return value

    def validate_rol(self, value):
        roles_validos = [r[0] for r in Usuario.ROL_CHOICES]
        if value not in roles_validos:
            raise serializers.ValidationError(
                f'Rol no válido. Opciones permitidas: {roles_validos}.'
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        PerfilVARK.objects.create(usuario=usuario)
        return usuario


class UsuarioSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'nombre_completo', 'rol', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


class PerfilVARKSerializer(serializers.ModelSerializer):
    vector = serializers.SerializerMethodField()
    estilo_dominante = serializers.SerializerMethodField()

    class Meta:
        model = PerfilVARK
        fields = [
            'puntaje_visual', 'puntaje_auditivo', 'puntaje_lectura',
            'puntaje_kinestesico', 'test_completado', 'fecha_test',
            'vector', 'estilo_dominante',
        ]

    def get_vector(self, obj):
        return obj.vector

    def get_estilo_dominante(self, obj):
        vector = obj.vector
        return max(vector, key=vector.get)


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['usuario'] = UsuarioSerializer(self.user).data
        try:
            data['vark_completado'] = self.user.perfil_vark.test_completado
        except PerfilVARK.DoesNotExist:
            data['vark_completado'] = False
        return data


class RespuestasTestSerializer(serializers.Serializer):
    sesion_id = serializers.IntegerField()
    respuestas = serializers.DictField(
        child=serializers.CharField(max_length=1),
        help_text='Diccionario {pregunta_id: opcion_id}, ej: {"1": "a", "2": "c"}',
    )

    def validate_respuestas(self, value):
        if not value:
            raise serializers.ValidationError('Las respuestas no pueden estar vacías.')
        return value
