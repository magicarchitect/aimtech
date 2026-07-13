# Caso desarrollado 4: Chatbot documental para consultar normativa interna

## H1

Chatbot documental para consultar normativa interna

## Subtítulo

Cómo ayudar a un equipo a consultar documentación aprobada sin perderse entre PDFs, carpetas y versiones.

## Problema

Muchas organizaciones tienen conocimiento interno, pero está repartido en documentos largos, manuales, procedimientos, normativa, PDFs y carpetas que no siempre son fáciles de consultar.

El problema no es solo encontrar un archivo. Es encontrar la respuesta correcta, saber de dónde sale y confiar en que está basada en una fuente válida.

Síntomas habituales:

- preguntas repetidas a las mismas personas;
- documentación que existe pero nadie encuentra;
- respuestas distintas según quién conteste;
- búsquedas lentas;
- dudas sobre versiones;
- exceso de dependencia de expertos internos.

## Proceso afectado

Soporte interno, cumplimiento, operaciones, RRHH, atención a usuarios, gestión documental, formación interna o consulta de normativa.

## Cómo lo resolvería Aimtech

### 1. Seleccionar fuentes válidas

No se debe conectar un chatbot a “toda la carpeta compartida” sin criterio. Aimtech empezaría definiendo:

- qué documentos son oficiales;
- qué versiones están vigentes;
- qué documentos quedan excluidos;
- quién valida el contenido;
- qué temas puede responder el sistema.

### 2. Preparar la documentación

Los documentos se limpian, estructuran y fragmentan para que el sistema pueda recuperar información útil.

Esto puede incluir:

- eliminar duplicados;
- separar versiones;
- normalizar títulos;
- convertir PDFs escaneados;
- extraer secciones;
- añadir metadatos.

### 3. Construir recuperación con fuentes

Aimtech usaría un enfoque RAG: el sistema no responde solo desde memoria del modelo, sino recuperando fragmentos relevantes de documentación.

Una respuesta útil debería incluir:

- respuesta clara;
- fuente consultada;
- fragmento o referencia;
- nivel de confianza;
- aviso si no hay base suficiente.

### 4. Definir límites y escalado

Hay preguntas que no debe responder automáticamente. Para esos casos se define escalado:

- “no tengo suficiente información”;
- “consulta con responsable”;
- “esto requiere validación legal/técnica”;
- “documento no encontrado”.

### 5. Medir uso y mejorar

Una vez en marcha, se revisan preguntas frecuentes, respuestas fallidas y documentos que faltan.

Un chatbot documental no es una estatua. Es un sistema vivo.

## Herramientas usadas

Según entorno:

- almacenamiento documental;
- OCR si hace falta;
- embeddings/vector database;
- RAG;
- API de modelo IA;
- interfaz web/chat;
- logs y revisión humana.

## Resultado cualitativo

El equipo encuentra respuestas más rápido y con trazabilidad. Los expertos internos reciben menos preguntas repetidas y pueden concentrarse en casos que realmente requieren criterio.

## Aprendizajes

- La calidad del chatbot depende de la calidad documental.
- Citar fuentes es clave para confianza.
- Hay que diseñar límites explícitos.
- No todo debe responderse automáticamente.

## Siguiente paso recomendado

Empezar por un dominio documental acotado: un manual, normativa interna, base de conocimiento o conjunto de procedimientos con dueño claro.

**CTA:** Chatbot de documentos para empresas

---
