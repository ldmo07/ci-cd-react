# CLAUDE.md

Repo independiente (`github.com/ldmo07/ci-cd-react`), clonado dentro de `CI-CD/` pero ignorado por el repo raíz. Se commitea y pushea desde esta carpeta.

- App: React 18 + Vite (`src/App.jsx`, `src/main.jsx`). El Dockerfile es multi-stage: `npm run build` y luego nginx sirve `dist/`. No hay tests; la verificación es `docker build` + abrir `:8084`.
- `API_URL` en `src/App.jsx` está fija a `http://localhost:8083/personas` (la llama el navegador, no el contenedor), por eso `ci-cd-dotnet` tiene CORS habilitado.
- `Jenkinsfile`: copia de `templates/Jenkinsfile.template` del repo raíz. Solo editar `APP_NAME` (`react-example`), `HOST_PORT` (`8084`), `CONTAINER_PORT` (`80`).
- Push a `main` => Jenkins despliega en ~1–2 min. Un build roto conserva el contenedor anterior.
- `.gitattributes` fuerza LF; CRLF en el `Jenkinsfile` rompe el pipeline.
- No agregar GitHub Actions: solo Jenkins hace CI/CD.
