# Arquitectura

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (`@theme inline` en `globals.css`) |
| Fuente | Fredoka (`next/font/google`, variable `--font-fredoka`) |
| Animaciones | Framer Motion |
| Íconos | `@tabler/icons-react` (UI) + imágenes propias en `public/images/` (contenido) |
| Persistencia | `localStorage` (sin backend, sin DB) |
| Despliegue | Vercel — ver [despliegue.md](./despliegue.md) |

No hay audio en la app — se decidió explícitamente no usar `window.speechSynthesis`
para pronunciar nombres en voz alta (ver `docs/componentes.md`, tipos descartados).

No hay `.env`, ni Prisma, ni rutas `/api` — todo el estado vive en el cliente.

## Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx           # fuente Fredoka + fondo global (background.avif)
│   ├── globals.css          # tokens de color por dosha + dorado, Tailwind v4
│   ├── icon.png             # favicon (recorte cuadrado del loto)
│   ├── page.tsx             # mapa de lecciones (home) + botón "Borrar progreso"
│   └── lesson/[lessonId]/page.tsx  # runner de una lección
├── data/
│   ├── doshas.ts            # Vata/Pitta/Kapha
│   ├── subdoshas.ts         # las 15 entradas (área, función) + subdoshaAreaImage()
│   └── lessons.ts           # LESSONS: qué tipos de pregunta entran en cada lección
├── lib/
│   ├── quiz/
│   │   ├── types.ts           # unión discriminada Question (8 tipos)
│   │   ├── random.ts          # shuffle, sample, pickDistractors (rng inyectable)
│   │   ├── buildLesson.ts     # arma la cola inicial de preguntas de una lección
│   │   └── generators/index.ts # un generador por tipo de pregunta
│   ├── progress/
│   │   ├── types.ts, constants.ts, storage.ts  # ProgressState + localStorage SSR-safe
│   └── date.ts               # helpers de racha diaria
├── common/hooks/
│   ├── useProgress.ts        # xp, racha, dominio, desbloqueos, resetProgress
│   └── useLessonSession.ts   # cola de preguntas + repetición espaciada
└── components/
    ├── lesson-map/LessonNode.tsx
    ├── ui/
    │   ├── AnimatedCounter.tsx  # XP con count-up (framer-motion)
    │   └── Confetti.tsx         # lluvia de confetti en loop, sin librería nueva
    └── quiz/
        ├── QuestionOptionButton.tsx  # shake en error, chispas + fill verde en correcto
        ├── ProgressBar.tsx
        ├── QuestionRenderer.tsx      # switch sobre Question['type']
        ├── LessonResultsScreen.tsx   # resultado de una lección intermedia
        ├── VictoryScreen.tsx         # pantalla completa al terminar TODO el curso
        └── questions/*.tsx           # un componente por tipo (8 en total)
```

`public/images/` tiene las 15 ilustraciones de área (`{subdoshaId}.webp`), los 3
emblemas de dosha vectorizados a mano con `potrace` (`vata.svg`, `pitta.svg`,
`kapha.svg`), el loto (`loto.webp`, y su recorte cuadrado en `src/app/icon.png` como
favicon), el reverso de carta para "Empareja" (`memoria.webp`), el fondo
(`background.avif`) y el gif de Ganesha para la pantalla de victoria
(`ganesha.gif`, comprimido con `ffmpeg` de 2.4MB a ~1.2MB y con el fondo vuelto
transparente vía chroma-key).

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

`buildLesson(lesson, rng)` recorre `lesson.steps` (definidos en `data/lessons.ts`).
El scope de subdoshas de la lección se **mezcla** (`shuffle(scope, rng)`) antes de
recorrerlo con un cursor compartido — así jugar la misma lección dos veces pregunta
por subdoshas en distinto orden cada vez, en vez de repetir siempre la misma
secuencia (Prana → Udana → Vyana...).

`questionSubdoshaIds(question)` extrae de qué subdosha(s) trata una pregunta — se usa
tanto para la repetición espaciada como para registrar dominio (`mastery`) al acertar.

## Repetición espaciada (sin preguntas repetidas)

`useLessonSession` mantiene una cola de `Question[]` y, en un `useRef`, un
`Map<SubdoshaId, Set<QuestionType>>` con qué tipos de pregunta ya están en la cola
para cada subdosha (poblado desde el armado inicial de la lección).

- `advance()` se llama solo cuando el jugador satisface la pregunta actual (todas las
  correctas encontradas / las dos secciones de "relacionar" completas / opción
  correcta elegida) y recién ahí avanza la cola.
- `recordMiss(subdoshaIds)` se llama en cada click incorrecto: **no** avanza la cola
  (la pregunta actual sigue ahí para reintentar), pero genera una pregunta de refuerzo
  con `generateReinforcementQuestion(subdoshaId, excludeTypes)` — excluyendo *todos*
  los tipos ya usados para ese subdosha en la lección (no solo el que se acaba de
  fallar), y la inserta 2-4 posiciones más adelante en la cola. Esto evita que, por
  ejemplo, ya tenías una `true-false` de Prana programada más adelante y el refuerzo
  por otro error vuelva a elegir `true-false` para Prana — se sentía como "la misma
  pregunta dos veces".

## Persistencia (`useProgress`)

`localStorage` bajo la clave `ayurveda-quiz:progress:v1` (ver `lib/progress/storage.ts`,
SSR-safe). Guarda `xp`, `streak` (racha **diaria** — solo sube una vez por día
calendario, comparando `lastActiveDateISO`; no es un contador de lecciones),
`unlockedCount` (cuántas lecciones de `LESSON_ORDER` están desbloqueadas) y `mastery`
(contador de aciertos por subdosha, tope 5). Sin vidas/corazones: un error nunca corta
la lección.

`resetProgress()` (botón "Borrar progreso" en `/`, con confirmación; y botón "Volver a
empezar" sin confirmación en `VictoryScreen`, ya que ahí es la única acción posible)
limpia la clave de `localStorage` y vuelve el estado a `defaultProgress()`.
