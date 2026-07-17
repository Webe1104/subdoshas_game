# Despliegue (Vercel, demo temporal)

App 100% client-side sin variables de entorno ni build command custom — Vercel
detecta Next.js automáticamente.

1. Repo en GitHub (`git push` a la rama principal).
2. [vercel.com](https://vercel.com) → **Add New Project** → importar el repo.
3. Framework Preset: Next.js (autodetectado). No hace falta tocar Build Command,
   Output Directory ni Install Command.
4. Deploy. La URL pública queda lista en minutos.

Como es una demo temporal, el proyecto se puede eliminar de Vercel cuando ya no se
necesite (Vercel → Project Settings → Delete Project) sin afectar el repo de GitHub.

No hay pasos adicionales: sin `.env`, sin base de datos, sin configuración de dominio
necesaria para la demo.
