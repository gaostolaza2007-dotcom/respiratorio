# RespiraLab

Proyecto demostrativo basado en el capítulo 4, «La respiración», de *Neurociencia del cuerpo*, de Nazareth Castellanos (Kairós, 2022).

## Abrir y presentar

1. Guarda **portable/RespiraLab.html** en el computador que llevarás a la exposición. Puedes copiar ese único archivo fuera de su carpeta.
2. Ábrelo con Chrome, Edge o Firefox, haciendo doble clic. Si Windows propone otra aplicación, usa «Abrir con» y elige el navegador.
3. La aplicación incluye sus gráficos y su programación. No necesita instalar paquetes, crear una cuenta ni conectarse a internet. Solo los enlaces a artículos científicos requieren conexión.
4. En **Presentar**, añade a los integrantes y sus reflexiones. Después pulsa **Descargar copia con el equipo** y utiliza esa copia para exponer.
5. Pulsa **Iniciar exposición**. El recorrido sugiere 6 minutos y 40 segundos. Avanza con **Siguiente** o con la flecha derecha. La guía no avanza automáticamente.

**Antes de la clase:** abre la copia final en el computador y proyector que usarán. Comprueba el tamaño de letra, el botón de pantalla completa y el recorrido completo. F11 también permite ampliar el navegador en Windows.

## Las seis secciones

| Sección | Qué permite demostrar |
|---|---|
| Explorar | Diafragma, cambios de volumen y dirección del flujo. Reproduce o detén el ciclo; prueba Inspirar y Espirar. |
| Vías del aire | Compara nariz y boca y sigue el recorrido hasta el intercambio gaseoso. |
| Cerebro | Desarrolla los dos conceptos elegidos: acoplamiento respiratorio y regulación emocional. |
| Experiencia | Realiza una pausa opcional de 1 o 2 minutos y compara tensión percibida; también incluye un ejemplo ficticio. |
| Evidencia | Examina resultados, muestras, argumentos críticos y referencias completas. |
| Presentar | Presentación del texto, dos argumentos de valoración, aplicación cotidiana, conclusión con citas y reflexiones del equipo. |

## Editar sin programar

Pulsa **Editar textos**. Los textos modificables aparecen con un borde punteado. Puedes cambiar títulos, explicaciones, argumentos y conclusión. Cambia de sección durante la edición para modificar sus textos. Para conservarlos, pulsa **Descargar copia editada**. El navegador guardará un nuevo archivo llamado **RespiraLab-personalizado.html**.

Los cambios quedan en memoria hasta descargarlos. Cerrar o recargar sin descargar puede perderlos. No se sobrescribe automáticamente el archivo original. La copia incluye textos, nombres y reflexiones; excluye las valoraciones de tensión y reinicia los controles al abrir.

Los controles y las etiquetas técnicas del modelo se modifican en los archivos editables. Revisen la precisión científica si cambian contenido conceptual.

## Guion y tiempo

| Paso | Tiempo orientativo |
|---|---:|
| Libro, capítulo y equipo | 0:40 |
| Mecánica respiratoria | 0:50 |
| Vías del aire | 0:30 |
| Dos conceptos sobre cerebro y respiración | 0:55 |
| Pausa e interpretación | 1:15 |
| Evidencia y cuestionamientos | 0:50 |
| Valor cotidiano, argumentos de lectura y conclusión | 0:55 |
| Reflexiones personales | 0:45 |
| **Total** | **6:40** |

Las notas de cada paso aparecen en **Notas para explicar este paso**. Usen el reloj como orientación, sin intentar leer todo el contenido de la aplicación. Si el equipo es grande, sustituyan el ejercicio por el ejemplo ficticio y destinen el tiempo liberado a las reflexiones.

## Experiencia opcional

La pauta orientativa usa 4 segundos de inspiración y 6 de espiración, sin retenciones. Cada persona puede mantener su ritmo natural o limitarse a observar. Detenerse y respirar normalmente si aparece incomodidad o mareo.

La actividad compara una percepción subjetiva en dos momentos. No mide pulso, oxígeno ni actividad cerebral. Los resultados pueden bajar, permanecer iguales o subir. No hay grupo de control ni prueba causal. El ejemplo **6 antes / 4 después** está expresamente identificado como ficticio y no representa una persona o medición real.

## Lo que el equipo debe completar

- Nombres y una reflexión real por integrante. La aplicación no inventa experiencias personales.
- Distribución oral del contenido. La guía no presupone un número de integrantes.
- Ensayo con el equipo y proyector que utilizarán.

La rúbrica adjunta suma 70 puntos. El proyecto contempla sus apartados y conserva las reflexiones como espacios que cada integrante debe completar. La modalidad demostrativa se basa en la autorización verbal del profesor que informó el estudiante.

## Material editable

**RespiraLab-Antigravity.zip** contiene el proyecto sin dependencias de terceros. Extrae todo el ZIP y abre la carpeta **RespiraLab** en tu editor. Consulta **README.md** para iniciarlo:

- `index.html`: estructura, textos, referencias y diagramas SVG editables.
- `styles.css`: colores, tipografía, tamaños y adaptación a pantallas.
- `model.js`: ciclo respiratorio simplificado y cálculo de la comparación.
- `app.js`: controles, experiencia, edición, descarga y guía de exposición.
- `build.mjs`: reúne todo en un único archivo portátil.

Quien edite con programación puede modificar esos archivos y ejecutar `npm run build` o `node build.mjs` desde la carpeta del proyecto. El resultado se crea en **portable/RespiraLab.html**. No requiere instalar bibliotecas. Para editar desde la interfaz y descargar una copia autónoma, usa preferentemente el archivo portátil.

Los gráficos son diagramas originales en SVG, con elementos separados. No son capturas ni imágenes planas. El modelo usa curvas ilustrativas sin unidades clínicas, no calcula presiones reales y simplifica las relaciones anatómicas.

## Fuentes

La bibliografía completa permanece disponible dentro de **Evidencia**, incluso sin conexión. Incluye el libro proporcionado, los trabajos originales de [Zelano y colaboradores (2016)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5148230/), [Balban y colaboradores (2023)](https://pubmed.ncbi.nlm.nih.gov/36630953/), [Fincham, Strauss y Cavanagh (2023)](https://doi.org/10.1038/s41598-023-49279-8) y recursos de fisiología del [NHLBI/NIH](https://www.nhlbi.nih.gov/health/lungs/breathing-benefits).
