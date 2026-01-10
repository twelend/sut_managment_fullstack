# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем файл зависимостей
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники проекта
COPY . .

# Делаем entrypoint исполняемым
RUN chmod +x /app/entrypoint.sh

# Переменные окружения
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=sutsite.settings

# Собираем статические файлы
RUN python manage.py collectstatic --noinput || true

# Создаем непривилегированного пользователя
RUN useradd -m -u 1000 django && chown -R django:django /app
USER django

# Открываем порт
EXPOSE 8000

# Используем entrypoint для инициализации
ENTRYPOINT ["/app/entrypoint.sh"]

# Запускаем сервер
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

