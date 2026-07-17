# Desarrollo local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción + typecheck
npm run lint
```

No hace falta `.env` ni ninguna base de datos — el progreso vive en `localStorage`
(clave `ayurveda-quiz:progress:v1`). Para resetear el progreso durante desarrollo,
usá el botón "Borrar progreso" en `/`, o borrala a mano desde devtools →
Application → Local Storage.

El indicador de desarrollo de Next.js (el badge flotante de la esquina) está
desactivado a propósito (`devIndicators: false` en `next.config.ts`).

## Agregar un subdosha nuevo (o corregir uno existente)

1. Editar `src/data/subdoshas.ts` — `SUBDOSHAS`, `SUBDOSHA_ORDER` y
   `SUBDOSHAS_BY_DOSHA` deben quedar consistentes.
2. Agregar la imagen de área en `public/images/{id}.webp` — el nombre de archivo
   tiene que coincidir exactamente con el `id` del subdosha, porque
   `subdoshaAreaImage(id)` arma la ruta a partir de eso, sin tabla de mapeo aparte.

## Agregar un tipo de pregunta nuevo

1. Definir la interfaz en `src/lib/quiz/types.ts` y sumarla a la unión `Question` (y a
   `questionSubdoshaIds` si aplica a subdoshas concretos).
2. Escribir el generador en `src/lib/quiz/generators/index.ts` (recibe el/los sujetos +
   un `Rng` inyectable, devuelve la `Question`). Si el tipo trata sobre un solo
   subdosha, sumarlo también a `SINGLE_SUBJECT_GENERATORS` para que pueda aparecer
   como pregunta de refuerzo en la repetición espaciada.
3. Crear el componente en `src/components/quiz/questions/`, recibiendo
   `{ question, onCorrect, onMiss }`. Para preguntas de opción única/múltiple,
   reutilizar `QuestionOptionButton` (ya trae shake, chispas y el delay antes de
   avanzar). Si la pregunta tiene más de una condición que cumplir antes de avanzar
   (como `RelateSubdoshaTripleQuestion`), usar un `useEffect` que mire el estado
   directamente en vez de revisarlo dentro del handler de click — revisarlo ahí
   puede leer un closure obsoleto si las condiciones se cumplen casi al mismo tiempo.
4. Sumar el `case` en `QuestionRenderer.tsx`.
5. Referenciar el tipo por su string literal en los `steps` de `src/data/lessons.ts`
   donde corresponda.

## Agregar o reordenar lecciones

`src/data/lessons.ts` — `LESSONS` es un array lineal; el orden define
`LESSON_ORDER`, que `useProgress` usa para desbloqueo (`unlockedCount`) y el runner
para saber cuál es "la siguiente lección" al terminar una. La **última** lección de
`LESSON_ORDER` es especial: al completarla se muestra `VictoryScreen` en vez de
`LessonResultsScreen` (ver `app/lesson/[lessonId]/page.tsx`, chequeo de
`!nextLessonId`).
