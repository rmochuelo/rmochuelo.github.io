# Portafolio de Ramón Puentes

Sitio personal de Ramón Puentes, Lead Product UX Designer. Una sola página, sin frameworks:
HTML semántico, SCSS modular y JavaScript sin dependencias.

- **En vivo:** https://rmochuelo.github.io/
- **Origen:** proyecto final de la especialización Front-End de Eidos Global – Código LATAM (2023).
- **Versión 2 (2026):** reconstruido con un flujo humano + IA. Ramón definió la arquitectura, el
  contenido y los criterios de calidad; la IA (Claude) generó el código y Ramón lo revisó.
- **Versión 3 (2026-11-16):** de portafolio a landing de conversión dual (consultoría y talento).
  Estructura por «3 puentes»: problema → propuesta → prueba → casos → diagnóstico → auditoría →
  credenciales → acción. Tema oscuro por defecto, divulgación progresiva con `<details>`,
  diagnóstico de 3 preguntas y medidor de peso en vivo. La v2 queda en `portafolio-web` para
  comparar.
- **Versión 3.4 (2026-11-24):** versión en inglés en `/en/` con un botón de idioma junto al de
  tema (enlace con `hreflang`, funciona sin JavaScript y conserva la sección que se está
  leyendo). Las dos versiones comparten CSS, JS e id de sección; los mensajes que escribe el
  script viven en `UI_TEXT` de `js/main.js`. Encabezado compacto en teléfonos (desde 320 px, todo
  en una fila) y `robots.txt` + `sitemap.xml` con las dos versiones.
- **Versión 3.3 (2026-11-23):** títulos en Inter; se retira Space Grotesk (una descarga menos).
- **Versión 3.2 (2026-11-23):** correcciones de los tres auditores (Claude, Gemini y la prueba
  de Ramón en su teléfono) y de Lighthouse: casos HOPE, ADALID y Dolce Amaretto actualizados
  (reto de 3 semanas, equipo en tripla, rol de Awaker, etiqueta con CO2e por lote), Kanban
  ilustrativo con contenido, «Menú» visible, flecha unida al texto, cifras enlazadas a su
  evidencia, siguiente paso tras los casos, progreso del diagnóstico y opción «todavía no usamos
  IA», servicio titulado en español, etiquetas sin aspecto de botón, línea de tiempo con los roles
  vigentes primero, accesos rápidos en el pie, encabezado mobile first y tema inicial en línea.
- **Versión 3.1 (2026-11-23):** correcciones de la auditoría heurística (Nielsen + Shneiderman) y
  de la revisión renderizada: la tabla del caso 2 ya no tapa «Cómo lo hice», CTA con etiqueta
  honesta («Solicitar»), correo visible con botón de copiar, «Diagnóstico» en el menú, resultado
  del diagnóstico visible en móvil y «Volver a responder», fuentes enlazadas, línea de tiempo en
  una columna y líneas de ~70 caracteres. Patrones verificados con Modern Web Guidance (Chrome).

## Estructura

```text
.
├── index.html            Página única en español (contenido y estructura)
├── en/index.html         La misma página en inglés (rutas con ../)
├── robots.txt, sitemap.xml
├── css/
│   └── styles.css        CSS compilado. No se edita a mano: sale de scss/
├── scss/                 Código fuente de los estilos
│   ├── main.scss         Índice: solo ordena los parciales
│   ├── abstracts/        Tokens de diseño y mixins (no generan CSS por sí solos)
│   ├── base/             Fuentes, reset, tipografía y accesibilidad
│   ├── layout/           Contenedor, encabezado y pie
│   ├── components/       Piezas reutilizables: botón, etiqueta, tarjeta, línea de tiempo...
│   └── sections/         Estilos propios de cada sección de la página
├── js/
│   └── main.js           Tema, menú, sección activa, diagnóstico, medidor de peso y año
├── fonts/                Inter (variable, subconjunto latino) para títulos y texto
├── img/                  Imágenes optimizadas (WebP) y favicon
└── (configuración)       .editorconfig, .prettierrc.json, .htmlhintrc, .stylelintrc.json,
                          eslint.config.mjs, .vscode/
```

## Cómo trabajar en el proyecto

Requisito: [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install        # instala las herramientas de desarrollo (una sola vez)
npm run dev        # recompila el CSS cada vez que guardas un .scss
npm run build      # compila el CSS final, minificado
npm run lint       # revisa HTML, SCSS y JavaScript
npm run format     # aplica el formato de Prettier a todo el proyecto
```

Para ver el sitio usa la extensión **Live Server** de VS Code (clic derecho en `index.html` →
«Open with Live Server»). También abre con doble clic, pero un servidor local se comporta igual
que GitHub Pages.

Al abrir la carpeta, VS Code sugiere las extensiones recomendadas (`.vscode/extensions.json`) y
formatea al guardar (`.vscode/settings.json`).

## Convenciones de código

| Tema        | Regla                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Indentación | 2 espacios por nivel padre → hijo. La tecla Tab inserta 2 espacios (`.editorconfig`).                                                        |
| Formato     | Lo decide Prettier, no cada persona. Se aplica al guardar o con `npm run format`.                                                            |
| HTML        | Etiquetas con significado (`header`, `nav`, `main`, `section`, `article`, `figure`, `ol`, `dl`, `time`). `div` solo para agrupar por diseño. |
| Clases CSS  | BEM: `bloque__elemento--modificador` (por ejemplo `project-card__meta`). Stylelint lo verifica.                                              |
| Idioma      | Identificadores en inglés (clases, variables, funciones). Contenido y comentarios en español.                                                |
| Nombres     | Describen qué es la cosa, no cómo se ve: `site-nav__toggle`, `initMobileNav()`, `saveTheme()`.                                               |
| Comentarios | Explican el **porqué** de una decisión o separan bloques grandes. No repiten lo que el código ya dice.                                       |
| DRY         | Los valores viven una sola vez: tokens en `scss/abstracts/_tokens.scss`, iconos en un sprite SVG, mixins para lo repetido.                   |
| CSS         | Mobile-first. Los colores se usan siempre mediante tokens de tema (`var(--color-...)`), nunca con el valor directo.                          |
| JavaScript  | Una función `init...` por comportamiento. Sin dependencias ni `onclick` en el HTML.                                                          |

## Decisiones técnicas y su porqué

- **Sin frameworks ni librerías.** Una página de contenido no los necesita; menos código es menos
  peso, menos mantenimiento y menos energía.
- **Fuentes autoalojadas y variables.** Un archivo por familia cubre todos los pesos y no se
  hacen peticiones a terceros (más privacidad, menos latencia).
- **Tema claro y oscuro.** Oscuro por defecto; el botón permite cambiarlo y la elección se
  guarda en `localStorage`. Un script corto en línea dentro del `<head>` aplica el tema antes del
  primer pintado y evita el parpadeo (desde la v3.2 va en línea: como archivo aparte bloqueaba el
  renderizado con una petición más).
- **Mejora progresiva.** Sin JavaScript el menú se muestra completo y el botón de tema se oculta.
  La clase `js` en `<html>` activa el menú plegable.
- **`role="list"` en listas sin viñetas.** Safari con VoiceOver deja de anunciar como lista un
  `<ul>` con `list-style: none`. El atributo conserva esa semántica. Algunos validadores lo marcan
  como redundante: es intencional.
- **Imágenes.** WebP, con `width` y `height` para reservar el espacio (sin saltos de layout) y
  `loading="lazy"` bajo el primer pantallazo.
- **SEO y redes.** Descripción, URL canónica, Open Graph (vista previa en LinkedIn) y datos
  estructurados `schema.org/Person`.

## Accesibilidad

Criterios aplicados (WCAG 2.2 nivel AA):

- Contraste: texto y texto secundario en AAA (7:1 o más) en ambos temas; acentos y enlaces en AA
  (5.4:1 o más). Tema claro sin blanco puro.
- Navegación completa por teclado, foco siempre visible y enlace «Saltar al contenido».
- Un solo `h1` y jerarquía de títulos sin saltos; cada sección tiene nombre accesible.
- Botones con estado (`aria-expanded`, `aria-pressed`); el menú se cierra con Escape.
- Texto alternativo en imágenes informativas y `alt=""` en las decorativas.
- Se respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- Áreas táctiles de al menos 44 px.

Pendiente recomendado: una pasada manual con lector de pantalla (NVDA o VoiceOver) y con
[WAVE](https://wave.webaim.org) o Lighthouse después de publicar.

## Rendimiento y sostenibilidad

Medición real tras publicar la v3.3 (23-nov-2026, Chromium, primera visita sin caché):

| Recurso                      | Peso transferido                                       |
| ---------------------------- | ------------------------------------------------------ |
| HTML                         | 18 kB (comprimido; 69.6 kB el 19-nov)                  |
| CSS                          | 5 kB (comprimido; 20.5 kB el 19-nov)                   |
| JS (1 archivo)               | 4 kB                                                   |
| Fuentes (1 archivo, Inter)   | 47 kB (Space Grotesk retirada en la v3.3: −22 kB)      |
| Imágenes (2, carga diferida) | 99 kB                                                  |
| **Total**                    | **173 kB en el medidor del sitio (no cuenta favicon)** |

Historia: 267 kB el 19-nov-2026 (Edge InPrivate), con HTML y CSS casi sin comprimir.

La estimación previa (~191 kB) suponía HTML y CSS comprimidos; en la medición llegaron casi a su tamaño completo.

Sin rastreadores, sin cookies y sin peticiones a terceros.

## Contenido: regla de cifras

Toda cifra publicada tiene respaldo documental (contratos, constancias, órdenes de compra o la
fuente original citada). Antes de cambiar un número, confirma su respaldo. El dato de McKinsey de
la sección «Enfoque» proviene de _The state of AI in 2026: On the road to ROI_ (agosto de 2026).

## Publicar en GitHub Pages

GitHub Pages sirve los archivos tal cual: recuerda ejecutar `npm run build` y subir
`css/styles.css` actualizado junto con los cambios.

Al migrar desde la versión de 2023, elimina del repositorio lo que ya no se usa:
`css/styles.scss`, `css/styles.css.map`, `img/img2/`, los iconos PNG antiguos de `img/`,
`img/post-its.jpg` y el CV en PDF anterior.

## Licencias

- Código y contenido: © Ramón Puentes.
- Fuente Inter: SIL Open Font License 1.1 (`fonts/LICENSE.txt`).
