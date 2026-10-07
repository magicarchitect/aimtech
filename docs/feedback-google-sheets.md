# Encuesta de feedback → Google Sheets

La función `netlify/functions/feedback.js` guarda cada respuesta de
`/feedback/` y `/ca/feedback/` en un Google Sheet (además del email de
aviso). **Una pestaña por formación**, creada automáticamente con
cabecera la primera vez que llega una respuesta de esa formación:

| Pestaña                     | Valor del selector  |
|-----------------------------|---------------------|
| Power BI básico-intermedio  | `powerbi-basico`    |
| Power BI avanzado           | `powerbi-avanzado`  |
| IA aplicada                 | `ia-aplicada`       |
| Fundamentos de SQL          | `sql-fundamentos`   |

Columnas por fila: Fecha (hora de Madrid) · Empresa · Calidad formación ·
Conocimiento instructor · Calidad materiales · Media · Qué mejoraría ·
Nombre · Email · Testimonio · Autoriza publicación · Idioma.

Las respuestas ES y CA van a la misma pestaña (la columna Idioma las
distingue). Los valores se insertan en modo RAW: el texto libre nunca se
interpreta como fórmula.

## Puntuaciones y medias (ES/CA)

Las tres preguntas (calidad, instructor, materiales) permiten **1–5 en pasos
 de 0,5**: 1; 1,5; 2; 2,5; 3; 3,5; 4; 4,5; 5. Se mantiene el mínimo 1.
La interfaz muestra coma decimal y cinco estrellas con zonas de media
estrella; los radios nativos permiten recorrer los nueve valores con las
flechas del teclado. La selección ya no avanza sola: se confirma con
Continuar o Enter para poder corregirla sin prisas.

El frontend usa `Number` y envía números JSON (`3.5`, no `"3,5"`). La función
valida finitud, rango y múltiplos de 0,5; rechaza cuartos, NaN, sufijos,
comas y tipos no numéricos. Conserva compatibilidad con enteros anteriores
y cadenas numéricas canónicas, convirtiéndolas en números completos, nunca
con `parseInt`.

Las columnas C–E se insertan como **números RAW sin redondear**. La columna F
mantiene la media aritmética de las tres preguntas, con la precisión previa
de dos decimales (3,5 + 4,5 + 5 → 4,33). El email muestra los valores con
coma; `◐` identifica media estrella, junto a la puntuación numérica explícita.
Los valores enteros históricos no necesitan migración.

Para análisis posteriores, leer Sheets con `valueRenderOption=UNFORMATTED_VALUE`
y calcular medias sobre números completos C–E (por ejemplo `AVERAGE(C2:C)`),
sin `parseInt`, `floor`, ni redondeo previo de cada respuesta. La media de F
ya tiene redondeo a dos decimales; usar C–E para un agregado de máxima precisión.
No se recalculan testimonios, cifras públicas ni filas históricas en este cambio.
El destino sigue siendo `GSHEETS_SPREADSHEET_ID` de feedback, nunca LEADS.

## Pruebas sin efectos externos

- `npm test`: validación, regresión de enteros, payload RAW y email con
  proveedores sustituidos por dobles de prueba. No requiere credenciales.
- `PLAYWRIGHT_MODULE=/ruta/a/playwright node tests/feedback-browser.cjs`:
  servidor estático local en 8767 por defecto. `FEEDBACK_TEST_URL` permite
  una preview; `FEEDBACK_TEST_REPORT` configura capturas y JSON de resultados.
  Intercepta **todas** las peticiones a feedback y responde desde el doble;
  no escribe en Sheets ni envía emails. ES/CA, escritorio/táctil, hover,
  teclado, foco, serialización decimal y confirmación.

La persistencia real en Google Sheets **no se prueba** sin autorización para
crear y verificar una fila de prueba. Las pruebas verifican el cuerpo real
que la función entrega a la API simulada, no afirman entrega a Google.

## Configuración (una sola vez, ~10 min)

1. **Service account**
   - [console.cloud.google.com](https://console.cloud.google.com) →
     proyecto (vale cualquiera, p. ej. `aimtech-web`).
   - APIs y servicios → Biblioteca → habilitar **Google Sheets API**.
   - IAM y administración → Cuentas de servicio → **Crear cuenta de
     servicio** (nombre: `feedback-aimtech`). Sin roles de proyecto.
   - En la cuenta creada → Claves → Agregar clave → **JSON**. Se descarga
     un archivo con `client_email` y `private_key`.

2. **El spreadsheet**
   - Crear un Google Sheet (p. ej. "Feedback formaciones Aimtech").
   - Compartirlo con el `client_email` del service account como
     **Editor**.
   - Copiar el ID de la URL:
     `https://docs.google.com/spreadsheets/d/`**`<ID>`**`/edit`.

3. **Variables de entorno en Netlify** (Site settings → Environment
   variables):
   - `GSHEETS_SPREADSHEET_ID` → el ID del paso 2.
   - `GSHEETS_CLIENT_EMAIL` → `client_email` del JSON.
   - `GSHEETS_PRIVATE_KEY` → `private_key` del JSON, completa
     (`-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`).
     Netlify acepta el valor multilínea tal cual; los `\n` literales
     también funcionan (la función los normaliza).
   - Redeploy para que las functions tomen los valores.

## Comportamiento ante fallos

- Sheets y email son independientes: si uno falla, el otro sigue y la
  respuesta del alumno no se pierde (el email indica si el guardado en
  Sheets funcionó).
- Solo responde error al alumno si fallan ambos destinos.
- Sin las 3 variables `GSHEETS_*`, la función funciona igual que antes
  (solo email) y no rompe nada.
