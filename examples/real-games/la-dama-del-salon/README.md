# Street Escape La Dama del Salón

Este es un archivo README inicial para el proyecto DAMA.

# <YOUR_APP_NAME>

This project is based on [OpenSaas](https://opensaas.sh) template and consists of three main dirs:
1. `app` - Your web app, built with [Wasp](https://wasp.sh).
2. `e2e-tests` - [Playwright](https://playwright.dev/) tests for your Wasp web app.
3. `blog` - Your blog / docs, built with [Astro](https://docs.astro.build) based on [Starlight](https://starlight.astro.build/) template.

For more details, check READMEs of each respective directory!

DATABASE_URL=postgres://ladama_server:tX08fzRyLQt5BTn@ladama-db.flycast:5432/ladama_server?sslmode=disable
wasp deploy fly cmd --context server secrets set WASP_WEB_CLIENT_URL=https://ladamadelsalon.es