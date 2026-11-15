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

**Decisión:** apto para publicar el código preparado en GitHub Pages, manteniendo el formulario sin envío. La activación comercial del formulario requiere política legal aprobada, backend con validación Siteverify y QA del widget real en `impulso365.dev`.
