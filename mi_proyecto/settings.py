import os
from pathlib import Path

# 1. Directorio base del proyecto y detección automática de la carpeta de configuración
BASE_DIR = Path(__file__).resolve().parent.parent
_PROJECT_NAME = Path(__file__).resolve().parent.name

# 2. Clave secreta y modo desarrollo (Soluciona error de ALLOWED_HOSTS)
SECRET_KEY = 'django-insecure-clave-de-desarrollo-lopez-cripto'
DEBUG = True
ALLOWED_HOSTS = ['*']

# 3. Aplicaciones instaladas (incluye CORS y tu app 'api')
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
]

# 4. Middlewares (CorsMiddleware posicionado en primer lugar)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 5. Configuración dinámica de URLs y WSGI (Soluciona error ModuleNotFoundError)
ROOT_URLCONF = f'{_PROJECT_NAME}.urls'
WSGI_APPLICATION = f'{_PROJECT_NAME}.wsgi.application'

# 6. Configuración de Plantillas (Soluciona error admin.E403)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 7. Base de Datos por defecto (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 8. Validadores de contraseñas
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 9. Idioma y zona horaria
LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# 10. Archivos estáticos
STATIC_URL = 'static/'

# 11. Tipo de campo por defecto para IDs
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 12. Permite peticiones desde la aplicación React/Vite
CORS_ALLOW_ALL_ORIGINS = True