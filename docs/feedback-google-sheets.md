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
