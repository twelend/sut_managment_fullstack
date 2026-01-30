import json
import logging
import urllib.error
import urllib.request
from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram_message(text: str) -> bool:
    """Отправляет сообщение в Telegram. Токен и chat_id берутся из settings."""
    token = getattr(settings, "TG_BOT_TOKEN", None) or ""
    chat_id = getattr(settings, "TG_CHANNEL_ID", None) or ""
    token = token.strip()
    chat_id = str(chat_id).strip() if chat_id else ""
    if not token or not chat_id:
        logger.warning(
            "Telegram: не заданы TG_BOT_TOKEN или TG_CHANNEL_ID в .env / окружении. Уведомление не отправлено."
        )
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({
        "chat_id": chat_id,
        "text": text,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode()
            if resp.status != 200:
                logger.warning("Telegram API вернул статус %s: %s", resp.status, body)
                return False
            out = json.loads(body) if body else {}
            if not out.get("ok"):
                logger.warning("Telegram API ответил ok=false: %s", body)
                return False
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        logger.warning("Telegram API HTTPError %s: %s", e.code, body)
        return False
    except Exception as e:
        logger.warning("Telegram: ошибка отправки: %s", e, exc_info=True)
        return False
