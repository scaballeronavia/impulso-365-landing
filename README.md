# Impulso 365 — demostración de landing

Landing estática para revisión del cliente. El formulario está preparado, pero el envío permanece deshabilitado hasta configurar receptor y aviso de privacidad.

Se publica únicamente el código, los activos necesarios para la página y el [informe de QA de presencia y ecosistema](qa/qa-presencia-ecosistema-2026-11-05.md). Los documentos de trabajo y materiales fuente permanecen fuera de este repositorio.

## Estructura del proyecto

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y contenido de la landing. |
| `styles.css` | Estilos, diseño responsive y animaciones. |
| `main.js` | Interacciones: menú móvil, animaciones al hacer scroll y pausa de movimiento. |
| `assets/` | Logotipos de marca y banderas SVG de cobertura. |
| `qa/` | Informe de QA de presencia y ecosistema. |
| `Dockerfile` | Imagen Nginx que sirve la landing. |
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

La landing queda disponible en <http://localhost:8003>.

Detalles de la configuración:

- `Dockerfile`: parte de `nginx:alpine`, cambia el `listen` del sitio por defecto a `8000`, copia el contenido del repositorio en `/usr/share/nginx/html` y arranca Nginx con `CMD ["nginx", "-g", "daemon off;"]`.
- `docker-compose.yaml`: servicio `app-web` construido desde el contexto actual, contenedor `impulso365-landing`, puerto publicado `127.0.0.1:8003:8000` (host → contenedor) y política `restart: unless-stopped`.

El puerto está atado a `127.0.0.1`, de modo que el contenedor no queda expuesto a la red: solo es accesible de forma local y, en producción, a través de Caddy (ver la sección siguiente).

Tras modificar `index.html`, `styles.css` o `main.js`, vuelve a construir la imagen para publicar los cambios:

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

Abre <http://localhost:8000> en el navegador. Todas las rutas del sitio son relativas, por lo que funciona desde la raíz del repositorio sin ajustes adicionales. El formulario de contacto mantiene el envío deshabilitado también en local, igual que en producción.

## Producción (Caddy)

En producción la landing se publica con Docker Compose y el acceso público lo resuelve Caddy, que actúa como reverse proxy hacia el puerto `8003` del contenedor (el puerto interno `8000` de Nginx), es decir `127.0.0.1:8003`.

Caddy se encarga del dominio, los certificados TLS y la redirección de HTTP a HTTPS; el contenedor Nginx queda detrás, sin exposición directa a internet.

Ejemplo de `Caddyfile`:

```
impulso365.dev {
    reverse_proxy 127.0.0.1:8003
}
```

Caddy emite y renueva los certificados automáticamente. Tras actualizar la landing en el servidor, `docker compose up -d --build` vuelve a publicar la versión nueva sin necesidad de tocar la configuración de Caddy.