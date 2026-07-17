# Componentes

## Piezas compartidas de quiz (`src/components/quiz/`)

| Componente | Responsabilidad |
|---|---|
| `QuestionOptionButton` | Botón de opción reutilizado por casi todos los tipos. Shake (`framer-motion` keyframes) en click incorrecto. En click correcto: fill verde + check + estallido de chispas (`Sparks`, definido en el mismo archivo), y recién ~850ms después llama a `onCorrectClick` (le da tiempo al jugador a ver que acertó antes de pasar de pregunta). En selección múltiple, `locked` mantiene el fill con el color de acento de la pregunta en vez del verde genérico. |
| `ProgressBar` | Barra de progreso de la lección (`progressRatio` de `useLessonSession`). |
| `QuestionRenderer` | `switch` exhaustivo sobre `Question['type']` que renderiza el componente de pregunta correspondiente. |
| `LessonResultsScreen` | Resultado de una lección intermedia: estrellas según precisión, XP de esa lección animado (`AnimatedCounter`), racha, botón a la siguiente lección. |
| `VictoryScreen` | Pantalla completa (`fixed inset-0`) al terminar la **última** lección del curso — gif de Ganesha animado, confetti (`Confetti`) en loop, "¡GANASTE!", XP **total** acumulado, racha, y botón "Volver a empezar" que llama a `resetProgress()` y navega a `/`. |

## Los 8 tipos de pregunta (`src/components/quiz/questions/`)

| Componente | Tipo (`Question['type']`) | Mecánica |
|---|---|---|
| `DoshaSubdoshasSelectQuestion` | `dosha-subdoshas-select` | Nombre del dosha al centro, tocás los 5 subdoshas correctos entre distractores. Selección múltiple — shake en incorrecto, avanza al completar los 5. |
| `AreaToSubdoshaImageQuestion` | `area-to-subdosha-image` | Nombre del subdosha arriba, 4 opciones son imágenes del área (`/public/images/{subdoshaId}.webp`). |
| `FunctionToSubdoshaQuestion` | `function-to-subdosha` | Se muestra la función, opciones son nombres de subdosha. |
| `SubdoshaToDoshaQuestion` | `subdosha-to-dosha` | Nombre del subdosha, elegís su dosha entre los 3 botones grandes. |
| `TrueFalseQuestion` | `true-false` | Afirmación de área o función, Verdadero/Falso. |
| `MatchingPairsQuestion` | `matching-pairs` | Memorama con flip 3D (`rotateY` + `backface-visibility`, `perspective` inline): cartas rectangulares (proporción real de `memoria.webp`, 420:229) con el reverso completo sin recortar, que se voltean para mostrar nombre o función y emparejar. Grid a 1 columna en mobile / 2 en desktop para que el rectángulo tenga ancho de sobra y el texto de la función entre sin desbordar. No usa `QuestionOptionButton` (tiene su propia mecánica de flip). |
| `RelateSubdoshaTripleQuestion` | `relate-subdosha-triple` | Nombre del subdosha arriba; abajo dos grillas independientes — imágenes de área y textos de función, cada una con distractores. Hay que acertar las dos (en cualquier orden) para avanzar; usa un `useEffect` que mira `[areaDone, fnDone]` en vez de revisar el otro flag dentro del handler de click (revisarlo ahí era un closure obsoleto: si contestabas las dos casi al mismo tiempo, cada handler leía un valor viejo del otro y nunca se cumplía la condición — quedaban las dos en verde pero no avanzaba). Reutiliza el mismo patrón visual de `AreaToSubdoshaImageQuestion`/`FunctionToSubdoshaQuestion` sobre `QuestionOptionButton`. |
| `SortToDoshaBulkQuestion` | `sort-to-dosha-bulk` | Repaso masivo: varios subdoshas mezclados de los 3 doshas, se van clasificando en 3 "cestas". |

> Se descartaron a propósito dos tipos que llegaron a estar implementados:
> `listen-and-choose` (usaba `window.speechSynthesis` para pronunciar el nombre — el
> usuario no quiere audio) y, más tarde, `mnemonic-complete` + `sequence-order` (no le
> gustaba la mecánica de la frase/orden mnemónicos). Estos dos últimos se
> reemplazaron por `relate-subdosha-triple`.

Todos reciben `question`, `onCorrect(subdoshaIds)` y `onMiss(subdoshaIds)` — el runner
de la lección (`app/lesson/[lessonId]/page.tsx`) conecta esos callbacks a
`useLessonSession` (avance / repetición espaciada) y `useProgress` (XP y dominio).

## Imágenes de área (`public/images/{subdoshaId}.webp`)

Cada subdosha tiene su propia ilustración de área (diagrama anatómico simple, estilo
póster). `subdoshaAreaImage(id)` en `src/data/subdoshas.ts` arma la ruta. Se usan
directo con `next/image`, sin componente propio.

## Mapa de lecciones (`src/components/lesson-map/LessonNode.tsx` + `app/page.tsx`)

Nodo de lección: bloqueado (candado, opaco), disponible (pulso infinito) o completado
(check). Usa el SVG del dosha correspondiente (`vata.svg`, `pitta.svg`, `kapha.svg`,
trazados a vector con `potrace` a partir del arte original) o el loto para la lección
de repaso. Los nodos se conectan con un camino curvo (SVG generado inline en
`app/page.tsx`, sin componente aparte) que cambia de color a medida que se completan
las lecciones. Debajo del camino, un botón discreto "Borrar progreso" (con
confirmación) llama a `resetProgress()`.

## UI compartida (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `AnimatedCounter` | Número que cuenta hacia arriba con `framer-motion` (`useMotionValue` + `animate`). Usado para el XP en `LessonResultsScreen` y `VictoryScreen`. |
| `Confetti` | ~36 rectángulos de colores cayendo en loop infinito, posiciones/velocidades aleatorias generadas una vez con `useMemo`. Sin librería externa — solo `VictoryScreen` la usa. |
