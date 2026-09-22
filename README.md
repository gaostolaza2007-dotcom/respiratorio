# RespiraLab · Proyecto para Antigravity

Demostración interactiva en español del sistema respiratorio y su relación con el cerebro. Incluye animaciones, diagramas SVG editables, evidencia científica, una experiencia opcional y un recorrido para exponer en aproximadamente 6:40.

## Abrir en Antigravity

1. Extrae **todo** el ZIP. No trabajes desde dentro del archivo comprimido.
2. Abre la carpeta **RespiraLab** como carpeta local en Antigravity. Es la carpeta donde está este README y `package.json`.
3. Para continuar con su agente, puedes pedirle:

   > Lee README.md, CONTEXTO.md y GUIA.md. Este es un proyecto existente: conserva sus funciones y sus elementos editables. Inícialo para que pueda revisarlo; espera mis indicaciones antes de cambiar el contenido.

Antigravity admite trabajar con carpetas locales; este paquete usa ese flujo estándar, no un formato propietario de importación. Consulta la [guía oficial de Google](https://codelabs.developers.google.com/getting-started-agy-ide). El paquete no se ha probado dentro de una instalación de Antigravity.

## Verlo sin instalar nada

Abre **portable/RespiraLab.html** con un navegador moderno. La copia ya viene generada e incorpora sus estilos, dibujos y programación. Funciona sin internet; únicamente los enlaces a las fuentes necesitan conexión.

## Ejecutar el código editable

Necesitas Node.js 18 o posterior. En la terminal de Antigravity, situada en la carpeta RespiraLab, ejecuta:

```sh
npm run dev
```

Abre **http://127.0.0.1:5173**. Para detenerlo, pulsa **Ctrl+C**. No hace falta `npm install`: no hay dependencias que descargar. También puedes iniciarlo directamente con `node server.mjs`.

El navegador no se recarga automáticamente: guarda tus cambios y recarga la página. Los cambios hechos desde «Editar textos» viven en memoria y se conservan descargando una copia; no modifican los archivos fuente.

## Qué editar

| Archivo | Contenido |
|---|---|
| `index.html` | Textos, estructura, bibliografía y diagramas SVG con elementos separados. |
| `styles.css` | Colores, tipografía, tamaños y disposición. |
| `model.js` | Modelo respiratorio ilustrativo y comparación de tensión percibida. |
| `app.js` | Animaciones, controles, edición y modo exposición. |
| `GUIA.md` | Guion, tiempos, preparación y uso durante la clase. |
| `CONTEXTO.md` | Alcance del proyecto y límites científicos que conviene preservar. |

Para actualizar la copia sin conexión tras cambiar el código:

```sh
npm run build
```

Esto regenera **portable/RespiraLab.html**. No edites esa copia como archivo principal: una nueva compilación reemplaza su contenido. Guarda las copias personalizadas con otro nombre.

Para comprobar el modelo y la integridad del HTML portátil:

```sh
npm test
```

Las pruebas no sustituyen el ensayo visual en el computador y proyector de la exposición.

## Antes de presentar

- Completa nombres y reflexiones auténticas del equipo en «Presentar».
- Descarga la copia personalizada si editaste desde la interfaz.
- Ensaya el recorrido y comprueba el archivo en el computador que llevarás.

No se incluyen el libro PDF ni la presentación original del profesor. El proyecto contiene sus referencias y una guía basada en los requisitos revisados. No requiere cuentas, claves API ni servicios externos para funcionar.
