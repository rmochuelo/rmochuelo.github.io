/**
 * Inicialización temprana del tema.
 *
 * Se carga en el <head> sin "defer": debe ejecutarse antes del primer pintado
 * para que la página no parpadee al aplicar el tema elegido.
 *
 * 1. Marca <html class="js">: el CSS sabe que hay JavaScript (menú plegable,
 *    botón de tema y diagnóstico).
 * 2. El tema oscuro es el predeterminado (menor consumo en pantallas OLED).
 *    Si la persona eligió el claro en una visita anterior, se aplica aquí.
 */
(function initThemeEarly() {
  'use strict';

  // Misma clave que usa js/main.js al guardar la preferencia.
  const THEME_STORAGE_KEY = 'theme';
  const root = document.documentElement;

  root.classList.add('js');

  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === 'light') {
      root.dataset.theme = 'light';
    }
  } catch {
    // localStorage puede estar bloqueado (modo privado): se queda el tema oscuro.
  }
})();
