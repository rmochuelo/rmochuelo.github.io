/**
 * Comportamiento del portafolio de Ramón Puentes (v3).
 *
 * JavaScript sin dependencias. Cada función «init» configura una sola cosa y
 * la página sigue siendo usable si el script no carga (mejora progresiva).
 */
'use strict';

const THEME_STORAGE_KEY = 'theme';
const NAV_OPEN_CLASS = 'site-nav--open';

/* ---------------------------------------------------------------------------
   Textos que escribe el script (v3.4, B1): uno por idioma de la página.
   El HTML de cada versión ya viene traducido; aquí solo viven los mensajes
   que el JavaScript genera en el momento.
   --------------------------------------------------------------------------- */

const UI_TEXT = {
  es: {
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    progress: (done, total) => `${done} de ${total} respondidas`,
    alsoReview: (names) => `También conviene revisar: ${names.join(' y ')}.`,
    weightCached:
      'pesa esta página. En esta visita tu navegador la cargó desde su caché: casi 0 kB de red.',
    weightLive: 'transfirió esta página en tu visita, medido por tu navegador.',
    copied: 'Copiado',
    copyFailed: 'No se pudo copiar',
  },
  en: {
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    progress: (done, total) => `${done} of ${total} answered`,
    alsoReview: (names) => `Also worth reviewing: ${names.join(' and ')}.`,
    weightCached:
      'is what this page weighs. On this visit your browser loaded it from its cache: almost 0 kB over the network.',
    weightLive: 'is what this page transferred on your visit, measured by your browser.',
    copied: 'Copied',
    copyFailed: 'Could not copy',
  },
};

const text = UI_TEXT[document.documentElement.lang] ?? UI_TEXT.es;

/* ---------------------------------------------------------------------------
   Tema claro / oscuro (oscuro por defecto)
   --------------------------------------------------------------------------- */

/** @returns {'light' | 'dark'} */
function getActiveTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Conecta el botón de tema, guarda la elección y mantiene aria-pressed. */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');

  if (!toggle) {
    return;
  }

  const syncToggleState = () => {
    const isDark = getActiveTheme() === 'dark';

    toggle.setAttribute('aria-pressed', String(isDark));
    // v3.2 (C-20): al pasar el cursor se lee qué hará el botón.
    toggle.title = isDark ? text.themeToLight : text.themeToDark;
  };

  toggle.addEventListener('click', () => {
    const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';

    if (nextTheme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Sin localStorage la elección vale solo para esta visita.
    }

    syncToggleState();
  });

  syncToggleState();
}

/* ---------------------------------------------------------------------------
   Menú móvil
   --------------------------------------------------------------------------- */

/** Abre y cierra el menú en pantallas pequeñas. Se cierra con Escape o al elegir un enlace. */
function initMobileNav() {
  const nav = document.querySelector('.site-nav');
  const toggle = nav?.querySelector('.site-nav__toggle');

  if (!nav || !toggle) {
    return;
  }

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (shouldOpen) => {
    nav.classList.toggle(NAV_OPEN_CLASS, shouldOpen);
    toggle.setAttribute('aria-expanded', String(shouldOpen));
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  nav.addEventListener('click', (event) => {
    if (event.target.closest('.site-nav__link')) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------------------------
   Sección activa en la navegación
   --------------------------------------------------------------------------- */

/** Marca en el menú la sección que está en pantalla (aria-current). */
function initScrollSpy() {
  const navLinks = [...document.querySelectorAll('.site-nav__link')];
  const sections = document.querySelectorAll('main > section[id]');

  if (navLinks.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }

  const markCurrentSection = (sectionId) => {
    navLinks.forEach((link) => {
      if (link.hash === `#${sectionId}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => markCurrentSection(entry.target.id));
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------------------------
   Diagnóstico de 60 segundos
   Los textos de resultado viven en el HTML (plantillas ocultas); el script
   solo suma puntos y muestra la plantilla que corresponde. No guarda nada.
   --------------------------------------------------------------------------- */

/** Calcula el puente más débil y muestra su resultado en la región aria-live. */
function initQuiz() {
  const form = document.querySelector('[data-quiz]');

  if (!form) {
    return;
  }

  const result = form.querySelector('[data-quiz-result]');
  const error = form.querySelector('[data-quiz-error]');
  const questions = [...form.querySelectorAll('fieldset[data-bridge]')];
  const progress = form.querySelector('[data-quiz-progress]');

  // v3.2 (C-24): progreso visible («1 de 3 respondidas»). El botón nunca se
  // desactiva: si falta una respuesta, la validación lo explica y lleva el foco.
  const updateProgress = () => {
    const answered = questions.filter((fieldset) => fieldset.querySelector('input:checked'));

    progress.textContent = text.progress(answered.length, questions.length);
  };

  if (progress) {
    progress.hidden = false;
    form.addEventListener('change', updateProgress);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const scores = questions.map((fieldset) => {
      const checked = fieldset.querySelector('input:checked');

      return {
        bridge: fieldset.dataset.bridge,
        name: fieldset.dataset.bridgeName,
        score: checked ? Number(checked.value) : null,
        // v3.2 (C-24): una respuesta puede pedir su propia variante de resultado.
        outcome: checked?.dataset.outcome ?? fieldset.dataset.bridge,
      };
    });

    if (scores.some((item) => item.score === null)) {
      error.hidden = false;
      result.replaceChildren();
      questions
        .find((fieldset) => !fieldset.querySelector('input:checked'))
        ?.querySelector('input')
        ?.focus();
      return;
    }

    error.hidden = true;

    const maxScore = Math.max(...scores.map((item) => item.score));
    const weakest = scores.filter((item) => item.score === maxScore);
    const outcomeKey = maxScore === 0 ? 'none' : weakest[0].outcome;
    const template = document.querySelector(`template[data-outcome="${outcomeKey}"]`);

    result.replaceChildren(template.content.cloneNode(true));

    // v3.1 (C-05): en móvil el botón del resultado quedaba fuera de la pantalla.
    // Se lleva el resultado a la vista; el foco sigue en el botón de enviar, así que
    // el siguiente Tab entra al resultado y la región aria-live lo anuncia.
    result.scrollIntoView({ block: 'start' });

    // Empate: se muestra el primero en el orden de la página y se nombra el otro.
    if (maxScore > 0 && weakest.length > 1) {
      const also = document.createElement('p');
      also.textContent = text.alsoReview(weakest.slice(1).map((item) => item.name));
      result.querySelector('[data-outcome-body]')?.after(also);
    }
  });

  // v3.1 (C-05): «Volver a responder» (botón type="reset" dentro del resultado).
  form.addEventListener('reset', () => {
    result.replaceChildren();
    error.hidden = true;
    // El reset limpia los radios después de este evento: se espera un ciclo.
    if (progress) {
      setTimeout(updateProgress);
    }
    questions[0].scrollIntoView({ block: 'start' });
    questions[0].querySelector('input')?.focus({ preventScroll: true });
  });
}

/* ---------------------------------------------------------------------------
   Medidor de peso (Performance API)
   Muestra lo que esta visita transfirió de verdad, no una cifra declarada.
   --------------------------------------------------------------------------- */

/** Suma los bytes transferidos de la página y sus recursos y los muestra en kB. */
function initPageWeight() {
  const output = document.querySelector('[data-page-weight]');
  const note = document.querySelector('[data-page-weight-note]');

  if (!output || !('performance' in window) || !performance.getEntriesByType) {
    return;
  }

  const update = () => {
    const entries = [
      ...performance.getEntriesByType('navigation'),
      ...performance.getEntriesByType('resource'),
    ];
    const transferred = entries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    const encoded = entries.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0);

    // transferSize es 0 cuando el navegador usa su caché: se informa el peso real.
    const fromCache = transferred < 1024 && encoded > 0;
    const bytes = fromCache ? encoded : transferred;

    if (bytes > 0) {
      output.textContent = `${Math.round(bytes / 1024)} kB`;
      note.textContent = fromCache ? text.weightCached : text.weightLive;
    }
  };

  window.addEventListener('load', update);

  // Las imágenes con carga diferida llegan después: se actualiza al recibirlas.
  if ('PerformanceObserver' in window) {
    new PerformanceObserver(update).observe({ type: 'resource', buffered: true });
  }
}

/* ---------------------------------------------------------------------------
   Copiar el correo (v3.1, C-02)
   Patrón «copy-button» de Modern Web Guidance: Invoker Commands (command y
   commandfor) con respaldo por clic, Async Clipboard y una burbuja que es a la
   vez el aviso visible y la región viva para lectores de pantalla.
   --------------------------------------------------------------------------- */

const copyTimers = new WeakMap();
let lastCopyMessage = '';

/** Muestra «Copiado» o «No se pudo copiar» en la burbuja junto al botón. */
function reportCopy(button, ok) {
  const tip = button.nextElementSibling;
  let message = ok ? text.copied : text.copyFailed;

  // VoiceOver no repite un aviso idéntico: un espacio duro lo hace distinto.
  if (message === lastCopyMessage) {
    message += '\u00A0';
  }
  lastCopyMessage = message;

  clearTimeout(copyTimers.get(button));
  button.removeAttribute('data-copied');
  tip.textContent = '';

  if (ok) {
    button.setAttribute('data-copied', '');
  }
  requestAnimationFrame(() => {
    tip.textContent = message;
  });

  copyTimers.set(
    button,
    setTimeout(() => {
      button.removeAttribute('data-copied');
      tip.textContent = '';
    }, 2000),
  );
}

/** Copia el texto del elemento indicado en commandfor. */
async function copyText(button, target) {
  const text = target.innerText.trim();

  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    reportCopy(button, true);
  } catch {
    reportCopy(button, false);
  }
}

function initCopyButtons() {
  if ('CommandEvent' in window) {
    // Los eventos «command» no burbujean: se escuchan en la fase de captura.
    document.addEventListener(
      'command',
      (event) => {
        if (event.command === '--copy') {
          copyText(event.source, event.target);
        }
      },
      true,
    );
    return;
  }

  // Respaldo para navegadores sin Invoker Commands: mismo marcado, un solo camino.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented) {
      return;
    }

    const button = event.target.closest('button[command="--copy"]');
    const target = button && document.getElementById(button.getAttribute('commandfor'));

    if (target) {
      copyText(button, target);
    }
  });
}

/* ---------------------------------------------------------------------------
   Cambio de idioma (v3.4, B1)
   El enlace funciona solo; el script le suma la sección que se está leyendo,
   para que el cambio de idioma no devuelva a la persona al inicio. Las dos
   versiones comparten los mismos id de sección.
   --------------------------------------------------------------------------- */

function initLangToggle() {
  const link = document.querySelector('[data-lang-toggle]');

  if (!link) {
    return;
  }

  link.addEventListener('click', () => {
    const current = document.querySelector('.site-nav__link[aria-current="true"]');
    const hash = current?.hash || window.location.hash || '';
    const url = new URL(link.href);

    url.hash = hash;
    link.href = url.href;
  });
}

/* ---------------------------------------------------------------------------
   Año del pie de página
   --------------------------------------------------------------------------- */

function initCurrentYear() {
  const yearElement = document.querySelector('[data-current-year]');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

/* ---------------------------------------------------------------------------
   Arranque (el script se carga con "defer": el HTML ya está disponible)
   --------------------------------------------------------------------------- */

initThemeToggle();
initMobileNav();
initScrollSpy();
initQuiz();
initCopyButtons();
initLangToggle();
initPageWeight();
initCurrentYear();
