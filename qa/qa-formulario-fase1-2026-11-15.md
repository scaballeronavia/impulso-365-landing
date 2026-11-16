# QA — formulario Fase 1

**Fecha:** 15 de noviembre de 2026. **Alcance:** landing ES/EN/PT-BR y formulario preparado sin envío.

| Control | Resultado | Evidencia |
|---|---|---|
| Integridad visual | PASS | Cambios limitados a formulario, privacidad y Turnstile; se conservan identidad, navegación, WhatsApp y animaciones. |
| Formulario | PASS | Empresa obligatoria, validación de campos y contacto, consentimiento sin premarcar, honeypot y botón deshabilitado. No existe endpoint de envío. |
| Privacidad | PASS para interfaz | Panel de información desplegable en tres idiomas; la política completa sigue pendiente de aprobación y no se publica. |
| Turnstile local | PASS | Clave oficial de prueba completada en `127.0.0.1`; el envío permaneció deshabilitado. |
| Turnstile real | PASS configuración / NOT TESTED en producción | El widget `IMPULSO365-Contacto` está en modo Managed y autoriza `impulso365.dev`. La clave real solo se carga en el dominio oficial. La verificación en el sitio público queda para después de desplegar esta versión. |
| Idiomas | PASS | ES → EN → PT-BR preservó Empresa y el panel de privacidad abierto; sin errores de consola. |
| Responsive | PASS | 360, 390, 768 y 1440 px con Turnstile local: sin desbordamiento horizontal y botón deshabilitado. La revisión previa cubrió nueve anchos por idioma. |
| Recursos y seguridad | PASS limitado | Sin imágenes rotas ni errores de consola; no hay Secret Key en el frontend, almacenamiento de datos del formulario ni petición al CRM. |
| Rendimiento, lectores de pantalla y otros navegadores | NOT TESTED | No hay Lighthouse comparable ni auditoría asistiva integral; no se afirma conformidad WCAG completa. |

**Nota de producción (16 nov. 2026):** el HTML servía la ruta cacheada `main.js?v=20261112-i18n2`, a pesar de que la integración Turnstile se añadió después. En producción el widget no se insertaba y quedaba el texto inicial. Se actualizó la referencia versionada a `20261116-turnstile`; la clave de prueba completó Turnstile en local. Pendiente repetir la verificación en GitHub Pages y en producción después de desplegar el cambio.

**Despliegue:** el PR #2 se combinó el 16 de noviembre de 2026 (commit `896af59`). GitHub Actions completó el despliegue a `impulso365.dev`; se verificó respuesta HTTP 200 y que el dominio sirve el HTML y CSS actualizados, incluida la alineación de “Servicio de interés”. Las ramas `main` y `develop` quedaron sincronizadas en `896af59`.

**Decisión:** el código preparado está publicado en GitHub Pages y en `impulso365.dev`; el formulario permanece sin envío. Activarlo requiere política legal aprobada, backend con validación Siteverify y QA funcional del widget real en producción.
