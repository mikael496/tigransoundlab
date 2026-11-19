# Tigran Ter-Minasyan — sitio web

Sitio estático (HTML + CSS + JS, sin build) del solista de corno francés Tigran Ter-Minasyan: biografía y hoja de vida, conciertos, videos, formatos de concierto, masterclass y clases online. Idiomas: ES (por defecto), EN, RU y HY.

## Archivos

- `index.html` — contenido en español (fuente de verdad para ES).
- `translations.json` — textos en `es`, `en`, `ru` y `hy`. Cada elemento con `data-i18n="clave"` toma su texto de aquí.
- `styles.css`, `script.js` — diseño, menú móvil, idiomas, videos de YouTube y visor de pósters.
- `assets/img/` — fotos optimizadas. `assets/posters/` — pósters (`-sm.jpg` miniatura, `.jpg` completo).

## Tareas habituales

**Añadir un video de YouTube:** en `index.html`, sección `#videos`, pega el ID del video en `data-youtube=""` (lo que va después de `v=` en el enlace, 11 caracteres). Sin ID, la tarjeta muestra "Video próximamente".

**Añadir un concierto:** copia un `<li class="concert">` dentro del año correspondiente, cambia fecha, título, descripción y sala, y añade el póster en `assets/posters/` (versión completa ~1000 px de ancho y miniatura `-sm` ~420 px). Si la descripción lleva `data-i18n="cN"`, añade esa clave en los cuatro idiomas de `translations.json`.

**Cambiar un texto:** edítalo en `index.html` (español) y en `translations.json` (los cuatro idiomas, incluido `es`).

## Probar en local

```
python -m http.server 8765
```

y abre http://localhost:8765 (las traducciones no cargan si abres el archivo directamente con `file://`).
