# ci-cd-react

Front React 18 + Vite desplegado automáticamente por Jenkins (ver repo `ci-cd-template`). Lista las personas que devuelve la API de `ci-cd-dotnet` (`http://localhost:8083/personas`).

Puertos: host **8084** → contenedor **80** (nginx sirviendo el build estático).

## Ejecutar local

```bash
docker build -t react-example:test .
docker run -d --rm --name react-example-test -p 8084:80 react-example:test
# abrir http://localhost:8084 (necesita ci-cd-dotnet corriendo en :8083)
docker stop react-example-test
```

## Despliegue

Un push a `main` dispara el job de Jenkins (`pollSCM`, ~1–2 min): build → deploy → smoke check.
