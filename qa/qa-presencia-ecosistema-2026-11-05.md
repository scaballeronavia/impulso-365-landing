# QA ampliado — Presencia y ecosistema

Fecha: 5 de noviembre de 2026. Alcance: landing publicada, secciones `#cobertura` y gráfica `.hero-stage` de `#solucion`. El prompt «Global Presence & Connected Technology Experience» se usó como matriz de aceptación. Esta revisión no implementa ese rediseño.

## Resultado

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| Identidad y contenido | Pasa | Logo Órbita, Manrope/Inter y colores vigentes. La lista contiene exactamente Bolivia, Uruguay, México, Perú y Colombia; la portada muestra las cuatro capacidades y el mensaje existente. |
| Responsive básico | Pasa | Comprobados 360×780, 390×844, 768×1024, 1024×768, 1440×900 y 1920×1080. Sin desbordamiento horizontal; el formulario conserva el envío deshabilitado. |
| Navegación a cobertura | Pasa | Ancla `#cobertura`, sección activa y cierre del menú móvil. Las cinco banderas SVG cargaron. |
| Pausa de movimiento | Pasa | Clic activa `aria-pressed=true` y pausa las animaciones; `Enter` reanuda. Consola sin errores en el recorrido. |
| Contraste calculado | Pasa | Título de cobertura 16.89:1; rótulo azul 5.46:1; rótulos de portada 14.95:1 y pie del gráfico 9.4:1 sobre Azul Noche, usando los valores CSS declarados. |
| Presencia internacional interactiva | Pendiente | Los cinco países son elementos de una lista, sin foco ni interacción. No hay información específica por país que justifique desplegables. |
| Ecosistema navegable | Pendiente | Los cuatro nodos son texto visual dentro de `.hero-stage[aria-hidden="true"]`; no se pueden activar por teclado o tacto ni llevan al servicio correspondiente. |
| Scrollytelling de ambas experiencias | Pendiente | Cobertura tiene entrada escalonada; la gráfica de portada tiene entrada inicial y desplazamiento global. No existe una secuencia por país o por capacidad vinculada al progreso de esas secciones. |

## Hallazgos priorizados

1. **P1 — Criterio de la propuesta aún sin implementar:** el documento solicita transformar cobertura y gráfica orbital en experiencias conectadas e interactivas. La landing actual no contiene esas dos transformaciones. Esto es una diferencia de alcance, no una regresión de la versión publicada.
2. **P2 — Accesibilidad del mensaje gráfico:** `site/index.html` marca toda `.hero-stage` como `aria-hidden="true"`; el texto «Una operación conectada a tu forma de trabajar.» solo existe allí. El mensaje no aparece en la representación accesible de la página. Los cuatro nombres de capacidades sí reaparecen en Servicios.
3. **P2 — Legibilidad visual móvil:** los rótulos `.hero-node` usan 8 px a 360–390 px. Aunque contrastan con el fondo, son demasiado pequeños para lectura cómoda. Las capacidades vuelven a aparecer más abajo en texto grande.
4. **P3 — Ruta de rendimiento a revisar antes de ampliar motion:** el `pointermove` de portada consulta `getBoundingClientRect()` y escribe dos propiedades CSS por evento. No se midió una regresión, pero conviene agrupar esas actualizaciones en un frame si se amplía la interactividad.

## Precisión de contenido

El usuario confirmó **presencia física** en cinco países. El prompt nuevo describe integrantes vinculados a esos países, pero las fuentes vigentes no identifican integrantes, nombres ni ubicaciones individuales. No convertir la lista en un mapa de equipo, oficinas o sedes sin evidencia específica.

## Límites de esta ronda

Se verificaron navegador, código y tamaños de pantalla. No se ejecutaron Lighthouse, medición de FPS/Core Web Vitals, emulación de `prefers-reduced-motion` ni una sesión con lector de pantalla. La comprobación de movimiento reducido sigue siendo estática por CSS/JavaScript. No se alteró el sitio ni el repositorio publicado en esta ronda.
