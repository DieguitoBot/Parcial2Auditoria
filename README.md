# Audita · Parcial 2 de Auditoría

Aplicación de estudio en español, responsive y sin dependencias de ejecución.

- Guía de los temas 7–11: PIMS, responsables/encargados de PII, implementación, ISO/IEC 29100, RGPD, ISO/IEC 27018 e ISO/IEC 29151.
- 30 preguntas con opciones aleatorias y explicaciones.
- Simulacro de 15 preguntas (3 por tema), 20 minutos y nota sobre 20.
- 15 tarjetas de repaso, filtro por tema, revisión de errores y progreso local.
- Fuentes oficiales enlazadas dentro de la aplicación.

## Abrir

Abre `index.html` directamente en tu navegador, o ejecuta:

```sh
python3 -m http.server 8000
```

Visita http://localhost:8000. No requiere instalar paquetes. Las fuentes de Google son opcionales; hay fuentes de respaldo. El progreso se guarda en `localStorage` de ese navegador/origen; no se envía a un servidor. Cambiar de origen (archivo local, localhost o GitHub Pages) crea un progreso independiente. Si el almacenamiento está bloqueado, se puede practicar sin persistencia.

## Edición de estudio

Se adopta provisionalmente **ISO/IEC 27701:2019**, porque el temario no especifica edición. Existe ISO/IEC 27701:2025 con cambios de estructura. Confirmar con los materiales del docente. Las referencias relacionadas son ISO/IEC 29100:2011, 27018:2019 y 29151:2017, sin presentarlas como las ediciones vigentes. Preguntas y casos de elaboración didáctica; no son un banco oficial del examen ni reproducción íntegra de las normas.

## GitHub Pages (opcional)

El sitio es compatible con Pages sin compilación. En el repositorio: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. Subir el código no activa Pages automáticamente.

## Archivos

- `content.js`: temas, preguntas, tarjetas y fuentes.
- `app.js`: navegación, práctica, temporizador, corrección y persistencia.
- `styles.css`: diseño responsive.
- `index.html`: estructura inicial.

## Verificación

```sh
node --check app.js
node --check content.js
node --test tests/study.test.cjs
```
