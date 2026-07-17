# Despliegue

App 100% client-side sin variables de entorno ni build command custom — Vercel
detecta Next.js automáticamente. Actualmente en producción en:

**https://subdoshas-game.vercel.app**

Repo: [github.com/Webe1104/subdoshas_game](https://github.com/Webe1104/subdoshas_game)
(cuenta `Webe1104`), proyecto de Vercel bajo el scope `g4n3sh4` (cuenta `webe1104`).

## Cómo se hizo

Con el [Vercel CLI](https://vercel.com/docs/cli) (`npx vercel`), sin pasar por el
dashboard:

```bash
npx vercel --prod --yes   # primer deploy: detecta Next.js, crea el proyecto, builda y publica
```

El primer `npx vercel` pide login si no hay sesión — usa un flujo de device code:
imprime una URL (`https://vercel.com/oauth/device?user_code=XXXX-XXXX`) para
visitar y confirmar desde el navegador ya logueado, y el CLI queda autenticado solo
con eso (no hace falta pegar ningún token).

## Gotchas encontrados (y cómo se resolvieron)

1. **Conexión automática con GitHub falló**: al crear el proyecto, Vercel intentó
   linkear `Webe1104/subdoshas_game` y tiró `Failed to connect ... to project`. El
   deploy igual funcionó (subió los archivos directo), pero **no queda activado el
   auto-deploy en cada push**. Para activarlo: Vercel dashboard → proyecto →
   Settings → Git → conectar el repo (puede pedir autorizar la GitHub App de Vercel
   sobre ese repo). Mientras tanto, cada deploy nuevo se dispara a mano con
   `npx vercel --prod --yes`.

2. **Renombrar el proyecto no genera solo el subdominio corto**: `vercel project
   rename <viejo> <nuevo>` cambia el nombre, pero el alias `<nuevo>.vercel.app` no se
   crea automáticamente — hace falta un deploy nuevo (`npx vercel --prod --yes`)
   para que Vercel genere el alias `<nuevo>-<scope>.vercel.app`. El dominio corto
   sin el sufijo del scope (`<nuevo>.vercel.app`) hay que agregarlo a mano:
   ```bash
   npx vercel domains add subdoshas-game.vercel.app subdoshas-game
   ```
   (Falla con "ya existe" si alguien más lo tiene tomado globalmente — no fue el
   caso acá.)

3. **El link quedaba detrás de un login de Vercel (SSO)**: los proyectos bajo un
   scope de equipo traen por default `ssoProtection` en
   `all_except_custom_domains` — protege TODOS los `*.vercel.app` del proyecto
   (incluida la URL de producción) detrás de un login de Vercel, así que cualquiera
   que entrara sin sesión veía una pantalla de login en vez del juego. Se
   desactivó con:
   ```bash
   npx vercel project protection disable subdoshas-game --sso
   ```
   Se puede revisar el estado actual con `npx vercel project protection
   subdoshas-game`.

## Deploy manual (mientras no esté conectado el auto-deploy de Git)

```bash
git push                    # subir los cambios al repo primero
npx vercel --prod --yes     # build + deploy a producción
```

## Si se quiere borrar

Vercel → proyecto `subdoshas-game` → Settings → Delete Project. No afecta el repo de
GitHub.
