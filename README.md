# Impulso 365 — sitio público

Landing empresarial estática disponible en español, inglés y portugués brasileño.

URL pública: <https://scaballeronavia.github.io/impulso-365-landing/>.

El formulario permanece preparado sin envío hasta configurar receptor y aviso de privacidad. Se publica únicamente la web, sus recursos y los informes QA; los documentos y materiales internos del proyecto permanecen fuera de este repositorio.

- [Informe de QA de la landing (12 nov. 2026)](qa/qa-landing-2026-11-12.md)
- [Informe de QA de presencia y ecosistema](qa/qa-presencia-ecosistema-2026-11-05.md)

## Estructura del sitio

| Archivo | Contenido |
| --- | --- |
| `index.html` | Landing en español y metadatos sociales. |
| `en/`, `pt-br/` | Páginas estáticas completas en inglés y portugués brasileño. |
| `styles.css` | Estilos, diseño responsive y animaciones. |
| `main.js`, `language-init.js` | Menú, animaciones, selector y preferencia de idioma. |
| `assets/` | Recursos visuales, banderas, fotos autorizadas e imágenes sociales. |
| `sitemap.xml` | Rutas públicas por idioma. |
| `qa/` | Informes de verificación técnica. |
| `Dockerfile` | Imagen Nginx para servir la landing. |
| `docker-compose.yaml` | Orquestación del contenedor. |

## Ejecución con Docker

El repositorio incluye un `Dockerfile` y un `docker-compose.yaml` para servir la landing desde un contenedor Nginx.

Requisitos: Docker Engine y el plugin Docker Compose (compruébalo con `docker compose version`).

```bash
# Construir la imagen y levantar el servicio en segundo plano
docker compose up -d --build

# Ver el estado del servicio y sus registros
docker compose ps
docker compose logs -f app-web

# Detener y eliminar el contenedor
docker compose down
```

La landing queda disponible en <http://localhost:8004>.

Detalles de la configuración:

- `Dockerfile`: parte de `nginx:alpine`, cambia el `listen` del sitio por defecto a `8000`, copia el contenido del repositorio en `/usr/share/nginx/html` y arranca Nginx con `CMD ["nginx", "-g", "daemon off;"]`.
- `docker-compose.yaml`: servicio `app-web` construido desde el contexto actual, contenedor `impulso365-landing`, puerto publicado `127.0.0.1:8004:8000` (host → contenedor) y política `restart: unless-stopped`.

El puerto está atado a `127.0.0.1`, de modo que el contenedor no queda expuesto a la red: solo es accesible de forma local y, en producción, a través de Caddy (ver la sección siguiente).

Tras modificar archivos de la landing, vuelve a construir la imagen para actualizar el contenedor:

```bash
docker compose up -d --build
```

## Ejecución local

La landing es estática: no hay compilación, dependencias ni paso de build, así que basta con cualquier servidor de archivos estáticos.

```bash
# Con Python, sin instalar nada
python3 -m http.server 8000

# Alternativa con Node.js
npx serve -l 8000
```

Abre <http://localhost:8000>. Todas las rutas del sitio son relativas y funcionan desde la raíz del repositorio. El formulario de contacto mantiene el envío deshabilitado.

## Producción (Caddy)

En producción la landing se publica con Docker Compose y el acceso público lo resuelve Caddy, que actúa como reverse proxy hacia el puerto `8004` del contenedor (el puerto interno `8000` de Nginx), es decir `127.0.0.1:8004`.

Caddy se encarga del dominio, los certificados TLS y la redirección de HTTP a HTTPS; el contenedor Nginx queda detrás, sin exposición directa a internet.

Ejemplo de `Caddyfile`:

```
impulso365.dev {
    reverse_proxy 127.0.0.1:8004
}
```

Caddy emite y renueva los certificados automáticamente. El workflow de despliegue automático se ejecuta cuando se combina un pull request a `main`; las actualizaciones directas de GitHub Pages se publican desde la rama principal.
