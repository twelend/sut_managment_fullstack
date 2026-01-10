from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает тестового пользователя для проверки авторизации'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='test@example.com',
            help='Email пользователя (будет использован как username)',
        )
        parser.add_argument(
            '--password',
            type=str,
            default='testpass123',
            help='Пароль пользователя',
        )
        parser.add_argument(
            '--superuser',
            action='store_true',
            help='Создать суперпользователя (is_staff=True, is_superuser=True)',
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        is_superuser = options['superuser']

        # Проверяем, существует ли пользователь
        if User.objects.filter(username=email).exists():
            self.stdout.write(
                self.style.WARNING(f'Пользователь с email {email} уже существует')
            )
            user = User.objects.get(username=email)
        else:
            # Создаем нового пользователя
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                is_staff=is_superuser,
                is_superuser=is_superuser,
            )
            self.stdout.write(
                self.style.SUCCESS(f'Создан пользователь: {email}')
            )

        # Создаем или получаем токен
        token, created = Token.objects.get_or_create(user=user)
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Создан токен для пользователя: {token.key}')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Токен уже существует: {token.key}')
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nДанные для входа:\n'
                f'Email: {email}\n'
                f'Password: {password}\n'
                f'Token: {token.key}'
            )
        )

