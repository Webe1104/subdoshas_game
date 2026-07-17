# Subdoshas — Documentación

App tipo Duolingo para aprender los 15 subdoshas del Ayurveda (5 por cada dosha: Vata,
Pitta, Kapha). 100% client-side, sin backend — el progreso vive en `localStorage` del
navegador.

**En producción**: [subdoshas-game.vercel.app](https://subdoshas-game.vercel.app)
(repo: [github.com/Webe1104/subdoshas_game](https://github.com/Webe1104/subdoshas_game)).

## Índice

| Documento | Descripción |
|---|---|
| [arquitectura.md](./arquitectura.md) | Stack, estructura de carpetas, modelo de datos, motor de preguntas |
| [componentes.md](./componentes.md) | Los 8 tipos de pregunta y las piezas de UI compartidas |
| [desarrollo.md](./desarrollo.md) | Cómo correr la app local y agregar contenido nuevo |
| [despliegue.md](./despliegue.md) | Cómo se publicó en Vercel y los gotchas que aparecieron |

## Visión general del flujo

```
/  (mapa de lecciones)
  │  useProgress() lee/escribe localStorage
  │  botón "Borrar progreso" reinicia todo a cero
  ▼
/lesson/[lessonId]
  │  useLessonSession() arma la cola de preguntas (buildLesson, orden de
  │  subdoshas aleatorio en cada intento)
  │  cada pregunta corre hasta acertar (shake en error; acertar dispara
  │  chispas + ~850ms de espera antes de avanzar)
  │  repetición espaciada: un error reinserta una pregunta de refuerzo de un
  │  tipo aún no usado para ese subdosha, unas posiciones más adelante
  ▼
Cola vacía
  ├─ si quedan lecciones → LessonResultsScreen (XP, estrellas, racha,
  │    botón a la siguiente lección) → completeLesson() persiste y
  │    desbloquea el siguiente nodo → vuelve a /
  └─ si era la última lección (repaso-final) → VictoryScreen (pantalla
       completa: Ganesha animado, confetti, XP total, racha, botón
       "Volver a empezar" que resetea el progreso) → vuelve a /
```
