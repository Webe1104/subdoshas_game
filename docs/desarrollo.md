# Desarrollo local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción + typecheck
npm run lint
```

No hace falta `.env` ni ninguna base de datos — el progreso vive en `localStorage`
(clave `ayurveda-quiz:progress:v1`). Para resetear el progreso durante desarrollo,
borrala desde devtools → Application → Local Storage.

## Agregar un subdosha nuevo (o corregir uno existente)

Editar `src/data/subdoshas.ts` — `SUBDOSHAS`, `SUBDOSHA_ORDER` y `SUBDOSHAS_BY_DOSHA`
deben quedar consistentes. Si el área no tiene ícono todavía, sumarlo a
`AreaIconKey` y a `AREA_ICONS` en `src/components/icons/area-icons.tsx`, y su posición
aproximada en `src/data/bodyZones.ts` (`BODY_ZONES`, coordenadas sobre el viewBox
`0 0 200 440` de `<BodySilhouette>`).

## Agregar un tipo de pregunta nuevo

1. Definir la interfaz en `src/lib/quiz/types.ts` y sumarla a la unión `Question` (y a
   `questionSubdoshaIds` si aplica a subdoshas concretos).
2. Escribir el generador en `src/lib/quiz/generators/index.ts` (recibe el/los sujetos +
   un `Rng` inyectable, devuelve la `Question`).
3. Crear el componente en `src/components/quiz/questions/`, recibiendo
   `{ question, onCorrect, onMiss }`.
4. Sumar el `case` en `QuestionRenderer.tsx`.
5. Referenciar el tipo por su string literal en los `steps` de `src/data/lessons.ts`
   donde corresponda.

## Agregar o reordenar lecciones

`src/data/lessons.ts` — `LESSONS` es un array lineal; el orden define
`LESSON_ORDER`, que `useProgress` usa para desbloqueo (`unlockedCount`) y el runner
para saber cuál es "la siguiente lección" al terminar una.
