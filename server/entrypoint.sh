#!/bin/bash
set -e

echo "Ожидание подключения к базе данных..."
python << EOF
import sys
import time
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sutsite.settings')
import django
django.setup()
from django.db import connection

max_attempts = 30
attempt = 0
while attempt < max_attempts:
    try:
        connection.ensure_connection()
        print("База данных доступна!")
        sys.exit(0)
    except Exception as e:
        attempt += 1
        if attempt < max_attempts:
            print(f"Попытка {attempt}/{max_attempts}: База данных недоступна - ожидание...")
            time.sleep(2)
        else:
            print(f"Не удалось подключиться к базе данных после {max_attempts} попыток")
            sys.exit(1)
EOF

echo "Применение миграций..."
python manage.py migrate --noinput

echo "Создание тестового пользователя..."
python manage.py create_test_user --email test@example.com --password testpass123 --superuser || echo "Пользователь уже существует или произошла ошибка"

echo "Запуск сервера..."
exec "$@"

