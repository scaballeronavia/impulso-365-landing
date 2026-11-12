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
| Accesibilidad básica | PASS en comprobaciones de estructura: un H1 por página, texto alternativo y dimensiones para imágenes, etiquetas para campos, foco visible, enlaces/controles semánticos y estados anunciados. |
| Sintaxis y generación | PASS. `scripts/build_i18n.py` se ejecutó y `node --check` terminó sin errores en `site/main.js` y `site/language-init.js`. El sitio no tiene build de producción ni suite de pruebas configurada. |
| GitHub Pages | Despliegue autorizado tras el PASS local. Lighthouse, Core Web Vitals, VoiceOver/NVDA, validadores externos de HTML y depuradores de vista previa de redes no se ejecutaron. No se afirma conformidad WCAG completa. |

## Validación pendiente después del despliegue

Al publicar, confirmar HTTP 200 y `Content-Type: image/png` en las tres URL sociales HTTPS y revisar las vistas previas con LinkedIn Post Inspector y Facebook Sharing Debugger. WhatsApp y X pueden conservar tarjetas en caché. Confirmar también que las tres rutas de idioma cargan en GitHub Pages.

## Alcance de publicación

Publicar únicamente los archivos necesarios de la web y el resumen QA. Mantener documentos de trabajo y materiales fuente fuera del repositorio público.
