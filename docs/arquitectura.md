# Arquitectura

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (`@theme inline` en `globals.css`) |
| Animaciones | Framer Motion |
| Íconos | `@tabler/icons-react` (UI) + imágenes propias en `public/images/` (contenido) |
| Persistencia | `localStorage` (sin backend, sin DB) |
| Despliegue | Vercel (demo temporal) |

No hay audio en la app — se decidió explícitamente no usar `window.speechSynthesis`
para pronunciar nombres en voz alta (ver sección de tipos de pregunta).

No hay `.env`, ni Prisma, ni rutas `/api` — todo el estado vive en el cliente.

## Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx, globals.css, page.tsx      # mapa de lecciones (home)
│   └── lesson/[lessonId]/page.tsx              # runner de una lección
├── data/
│   ├── doshas.ts            # Vata/Pitta/Kapha
│   ├── subdoshas.ts         # las 15 entradas (área, función, letra mnemónica)
│   └── lessons.ts           # LESSONS: qué tipos de pregunta entran en cada lección
├── lib/
│   ├── quiz/
│   │   ├── types.ts           # unión discriminada Question (9 tipos)
│   │   ├── random.ts          # shuffle, sample, pickDistractors (rng inyectable)
│   │   ├── buildLesson.ts     # arma la cola inicial de preguntas de una lección
│   │   └── generators/index.ts # un generador por tipo de pregunta
│   ├── progress/
│   │   ├── types.ts, constants.ts, storage.ts  # ProgressState + localStorage SSR-safe
│   └── date.ts               # helpers de racha diaria
├── common/hooks/
│   ├── useProgress.ts        # xp, racha, dominio, desbloqueos
│   └── useLessonSession.ts   # cola de preguntas + repetición espaciada
└── components/
    ├── lesson-map/LessonNode.tsx
    └── quiz/
        ├── QuestionOptionButton.tsx  # shake en error, chispas + fill verde en correcto
        ├── ProgressBar.tsx
        ├── QuestionRenderer.tsx      # switch sobre Question['type']
        ├── LessonResultsScreen.tsx
        └── questions/*.tsx           # un componente por tipo (8 en total)
```

`public/images/` tiene las 15 ilustraciones de área (`{subdoshaId}.webp`), los 3
emblemas de dosha vectorizados (`vata.svg`, `pitta.svg`, `kapha.svg`), el loto
(`loto.webp`, y su recorte cuadrado en `src/app/icon.png` como favicon), el reverso de
carta para "Empareja" (`memoria.webp`) y el fondo (`background.avif`).

## Modelo de datos

`src/data/subdoshas.ts` es la fuente única de verdad. Cada `Subdosha` tiene `id`,
`doshaId`, `name`, `area` y `fn`. `subdoshaAreaImage(id)` arma la ruta a la imagen de
área (`/images/{id}.webp`) — no hace falta una tabla de mapeo aparte porque el nombre
de archivo coincide con el `id`.

**Corrección de datos**: el póster original mostraba un recuadro repetido de
"Avalambaka" en Kapha con información errónea — se descartó. Cada dosha tiene
exactamente 5 subdoshas.

## Motor de preguntas

`Question` (en `lib/quiz/types.ts`) es una unión discriminada por `type` con 8
variantes. Cada tipo tiene un generador puro en `lib/quiz/generators/index.ts` que
arma distractores usando `shuffle`/`pickDistractors` (rng inyectable, testeable).
`buildLesson(lesson, rng)` recorre `lesson.steps` (definidos en `data/lessons.ts`) y
llama al generador correspondiente, ciclando el "sujeto" (qué subdosha preguntar) a
través del scope de la lección para cubrir las 5 subdoshas del dosha.

`questionSubdoshaIds(question)` extrae de qué subdosha(s) trata una pregunta — se usa
tanto para la repetición espaciada como para registrar dominio (`mastery`) al acertar.

## Repetición espaciada

`useLessonSession` mantiene una cola de `Question[]`. `advance()` se llama solo cuando
el jugador satisface la pregunta actual (todas las correctas encontradas / opción
correcta elegida) y avanza la cola. `recordMiss(subdoshaIds)` se llama en cada click
incorrecto: **no** avanza la cola (la pregunta actual sigue ahí para reintentar), pero
genera una pregunta de refuerzo de un tipo *distinto* sobre ese mismo subdosha
(`generateReinforcementQuestion`) y la inserta 2-4 posiciones más adelante en la cola.

## Persistencia (`useProgress`)

`localStorage` bajo la clave `ayurveda-quiz:progress:v1` (ver `lib/progress/storage.ts`,
SSR-safe). Guarda `xp`, `streak` (racha diaria comparando `lastActiveDateISO`),
`unlockedCount` (cuántas lecciones de `LESSON_ORDER` están desbloqueadas) y `mastery`
(contador de aciertos por subdosha, tope 5). Sin vidas/corazones: un error nunca corta
la lección.
