# GGL QR Studio

Fresh Flask QR generator in the requested cartoonic dark theme.

## Includes

- Website, Text, Email, Phone, SMS, Wi-Fi, Contact and WhatsApp QR types.
- Live preview that is constrained to its preview window.
- User logo upload: PNG/JPG/JPEG only, maximum 2 MB.
- Uploaded logos are read locally in the browser and never sent to Flask.
- 100 popular brand presets with search and a tidy logo grid.
- Rounded, Dots, Classy and Classic styles.
- QR/background colors.
- Logo size slider.
- 512–2000 px output sizes.
- PNG and SVG downloads.
- Private dashboard with total generation events, today, unique daily IP fingerprints, daily chart, type chart and recent logs.
- Raw QR payloads are never logged.
- Raw IP addresses are never stored; the dashboard uses an HMAC fingerprint.

## Run

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Open http://127.0.0.1:5000

## Admin

Edit `config.py` before deployment:

- ADMIN_PATH
- ADMIN_USERNAME
- ADMIN_PASSWORD
- SECRET_KEY
- IP_HASH_SECRET

The route is intentionally not `/admin`. The hidden path is only obscurity; the credentials are the actual authentication.

## Privacy

The QR is rendered client-side. A user-uploaded logo is never posted to this Flask app. The only generation request sent to the backend contains the QR type and selected output size, so the admin dashboard does not know the user's URL/text/contact data.

## Production

Use HTTPS and a production WSGI server such as Gunicorn behind a reverse proxy. If deploying behind a proxy, configure trusted proxy handling before relying on `REMOTE_ADDR`.
