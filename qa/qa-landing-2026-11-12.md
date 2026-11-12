# QA integral de la landing — 12 de noviembre de 2026

## Resultado

**QA técnico local: PASS. Publicación autorizada.**

## Alcance revisado

Landing estática con tres rutas localizadas, selector de idioma, menú responsive, animaciones, soluciones por sector, equipo, formulario sin envío, metadatos sociales y tres imágenes Open Graph.

## Resultados de QA

| Área | Resultado |
|---|---|
| Español, inglés y portugués brasileño | PASS. Páginas completas, rutas directas y `lang` coherente. Cambios ES↔EN↔PT actualizan contenido y metadatos; ya se había verificado persistencia y conservación de campos del formulario. |
| Responsive | PASS. Sin desbordamiento horizontal en 360, 390, 430, 768, 1024, 1440 y 1920 px en cada idioma (21 combinaciones). Titular sin desbordamiento y selector visible. |
| Navegación | PASS. Sin anclas rotas; enlaces internos encontrados tienen destino. Menú móvil probado al abrir/cerrar. Selector operable con teclado. |
| Formularios | PASS para el alcance vigente. Controles con etiquetas; envío sigue deshabilitado y la nota explica que aún no recibe solicitudes. |
| Animación e interacción | PASS. Pausa/reanudar actualiza etiqueta y estado accesible; sectores usan controles nativos. La hoja respeta `prefers-reduced-motion`. |
| Recursos gráficos | PASS en referencias locales. Ninguna imagen completada falló en la vista final; las imágenes fuera de pantalla usan carga diferida. No se detectaron errores de consola. |
| SEO e internacionalización | PASS estático. Canonical, `hreflang`, títulos, descripciones y URL Open Graph coinciden con cada idioma. Sitemap contiene las tres rutas. |
| Open Graph y X Cards | PASS local. Tres PNG de 1200 × 630 px (aprox. 330 KB) enlazados por idioma; etiquetas completas en HTML inicial; la vista dinámica también cambia imagen, locale, URL y texto alternativo. La imagen española cargó desde la vista previa local con dimensiones correctas. |
| Foto de Jorge Kano | PASS en el sitio público. El retrato actualizado carga en español, inglés y portugués brasileño desde `assets/team/jorge-kano.jpg?v=20261112-jorge2` (655 × 873 px). |
| Fotos de Rodrigo y Santiago | PASS en el sitio público. Rodrigo (1086 × 1448 px, 79 KB) y Santiago con fondo blanco (1278 × 1230 px, 156 KB) cargan en las tres rutas de idioma; texto alternativo, dimensiones y carga diferida comprobados. |
| Accesibilidad básica | PASS en comprobaciones de estructura: un H1 por página, texto alternativo y dimensiones para imágenes, etiquetas para campos, foco visible, enlaces/controles semánticos y estados anunciados. |
| Sintaxis y generación | PASS. `scripts/build_i18n.py` se ejecutó y `node --check` terminó sin errores en `site/main.js` y `site/language-init.js`. El sitio no tiene build de producción ni suite de pruebas configurada. |
| GitHub Pages | PASS. QA base en `718597b`; el retrato de Jorge se publicó en `5c34f24` y los retratos de Rodrigo y Santiago en `7d5788f`. Se verificaron en vivo ES/EN/PT-BR y 21 anchos de pantalla, sin desbordamiento ni errores de consola. Títulos, rutas e imágenes Open Graph de la verificación base coinciden; las tres imágenes sociales cargaron desde HTTPS a 1200 × 630 px. |

## Alcance de verificación y pendientes

No se ejecutaron Lighthouse, Core Web Vitals, VoiceOver/NVDA, validadores externos de HTML ni depuradores de vista previa de redes. No se afirma conformidad WCAG completa. Las vistas previas de LinkedIn y Facebook se pueden revisar con sus inspectores; WhatsApp y X pueden conservar tarjetas en caché.

## Alcance de publicación

Se publicaron únicamente los archivos necesarios de la web y este resumen QA. Los documentos de trabajo y materiales fuente permanecen fuera del repositorio público.
