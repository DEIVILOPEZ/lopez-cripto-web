from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_user(request):
    action = request.data.get('action')
    username = request.data.get('username')
    password = request.data.get('password')

    if action == 'register':
        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        login(request._request, user)
        return Response({'status': 'ok', 'username': user.username})

    elif action == 'login':
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request._request, user)
            return Response({'status': 'ok', 'username': user.username})
        return Response({'error': 'Credenciales incorrectas'}, status=400)

    return Response({'error': 'Acción no válida'}, status=400)