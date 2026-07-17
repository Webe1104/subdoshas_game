# Subdoshas — Documentación

App tipo Duolingo para aprender los 15 subdoshas del Ayurveda (5 por cada dosha: Vata,
Pitta, Kapha). 100% client-side, sin backend — el progreso vive en `localStorage` del
navegador. Demo pensada para desplegarse gratis en Vercel.

## Índice

| Documento | Descripción |
|---|---|
| [arquitectura.md](./arquitectura.md) | Stack, estructura de carpetas, modelo de datos, motor de preguntas |
| [componentes.md](./componentes.md) | Los 10 tipos de pregunta y las piezas de UI compartidas |
| [desarrollo.md](./desarrollo.md) | Cómo correr la app local y agregar contenido nuevo |
| [despliegue.md](./despliegue.md) | Cómo publicar la demo en Vercel |

## Visión general del flujo

```
/  (mapa de lecciones)
  │  useProgress() lee/escribe localStorage
  ▼
/lesson/[lessonId]
  │  useLessonSession() arma la cola de preguntas (buildLesson)
  │  cada pregunta corre hasta acertar (shake en error, repetición espaciada
  │  reinserta una pregunta de refuerzo unas posiciones más adelante)
  ▼
Cola vacía → LessonResultsScreen (XP, estrellas, racha)
  │  completeLesson() persiste y desbloquea el siguiente nodo
  ▼
vuelve a /
```
