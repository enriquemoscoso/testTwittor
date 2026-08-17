# Chat de Héroes

Un cascarón de chat usando jQuery que funciona como Progressive Web App (PWA).

## Ejecutar localmente

El service worker necesita un origen seguro: HTTPS o `localhost`. No abras
`index.html` directamente con el protocolo `file://`.

Por ejemplo, desde la raíz del proyecto:

```powershell
python -m http.server 8080
```

Después visita `http://localhost:8080`. Tras la primera carga, la aplicación se
puede instalar y volver a abrir sin conexión.
