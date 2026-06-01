---
title: "DAX para principiantes: medidas vs columnas calculadas"
description: "La duda que frena a todo el que empieza con DAX: ¿medida o columna calculada? Te explicamos la diferencia, cuándo usar cada una y el error que pagan caro."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "dax"]
icon: "chart"
draft: false
slug: "dax-medidas-vs-columnas-calculadas"
translationKey: "dax-medidas-vs-columnas-calculadas"
---

Casi todo el que empieza con DAX se atasca en la misma bifurcación: para calcular algo, ¿creo una **medida** o una **columna calculada**? Las dos usan la misma fórmula muchas veces, así que parecen intercambiables. No lo son, y elegir mal te penaliza en rendimiento y en resultados raros. Vamos a aclararlo.

## La diferencia de fondo: cuándo se calcula cada una

- Una **columna calculada** se calcula **fila a fila, al refrescar los datos**, y el resultado se guarda en el modelo (ocupa memoria). Es como añadir una columna más a la tabla.
- Una **medida** se calcula **en el momento de la consulta**, según lo que haya en el informe en ese instante: los filtros, la fila de la tabla, el segmento seleccionado. No se guarda: se recalcula sobre la marcha.

Esa palabra —**contexto**— es la clave. Una columna calculada solo "ve" su propia fila. Una medida "ve" el contexto de filtro del informe: el mes seleccionado, la región del gráfico, el segmentador activo.

<figure class="svg-figure">
<svg viewBox="0 0 760 244" role="img" aria-labelledby="fig-dax-t fig-dax-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-dax-t">Columna calculada frente a medida</title>
<desc id="fig-dax-d">La columna calculada se calcula fila a fila al refrescar y se guarda en el modelo; la medida se recalcula al consultar, según el filtro, y no ocupa memoria.</desc>

<g>
<rect x="16" y="28" width="352" height="196" rx="12" class="d-card"/>
<text x="40" y="62" font-size="14" class="d-title">Columna calculada</text>
<text x="40" y="83" font-size="11" class="d-txt-i">fila a fila · al refrescar · se guarda</text>
<rect x="40" y="104" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="104" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="114" r="2.6" class="d-accent"/>
<rect x="40" y="130" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="130" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="140" r="2.6" class="d-accent"/>
<rect x="40" y="156" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="156" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="166" r="2.6" class="d-accent"/>
<text x="244" y="198" font-size="9" class="d-label">guardada en el modelo</text>
</g>

<g>
<rect x="392" y="28" width="352" height="196" rx="12" class="d-card"/>
<text x="416" y="62" font-size="14" class="d-title">Medida</text>
<text x="416" y="83" font-size="11" class="d-txt-i">al consultar · según el filtro</text>
<rect x="416" y="102" width="132" height="26" rx="13" class="d-accent-soft"/>
<circle cx="433" cy="115" r="3" class="d-accent"/>
<text x="446" y="119" font-size="10" class="d-dim">filtro: junio</text>
<line x1="430" y1="150" x2="430" y2="172" class="d-stroke-mute"/>
<path d="M430 174 L425 165 L435 165 Z" class="d-mute"/>
<text x="470" y="182" font-size="38" class="d-kpi">1.248</text>
<text x="416" y="206" font-size="9" class="d-label">se recalcula · no ocupa memoria</text>
</g>
</svg>
<figcaption>La <b>columna calculada</b> se calcula fila a fila al refrescar y se guarda en el modelo; la <b>medida</b> se recalcula al consultar, según el filtro, y no ocupa memoria.</figcaption>
</figure>

## La regla práctica

- **Usa una medida** para todo lo que sea **agregación**: sumas, promedios, porcentajes, ratios, totales que cambian según el filtro. *Ventas totales*, *margen %*, *ticket medio* → medidas, siempre.
- **Usa una columna calculada** cuando necesitas un **atributo por fila** que luego usarás para **filtrar, agrupar o relacionar**: clasificar cada venta en un rango ("alta/media/baja"), extraer el año de una fecha para una jerarquía, marcar si una fila cumple una condición.

Dicho corto: **si va a un eje, un filtro o una segmentación, suele ser columna. Si va a un valor que se agrega, es medida.**

> El contexto de filtro es lo que separa "sé escribir DAX" de "sé modelar en Power BI".

## El error que se paga caro

El error típico del principiante es resolverlo todo con columnas calculadas porque "se ven en la tabla y es más intuitivo". Funciona en una tabla pequeña y revienta en una grande: cada columna calculada hincha el modelo, ralentiza el refresco y, peor aún, da números que no responden a los filtros del usuario. Las sumas que deberían cambiar al seleccionar un mes se quedan congeladas.

La buena noticia: en cuanto entiendes el contexto de filtro, el 90% de tus cálculos de negocio salen siendo medidas, tu modelo queda ligero y los informes responden solos a lo que el usuario toca.

## Para que se quede

El contexto de filtro es el concepto que separa "sé escribir fórmulas DAX" de "sé modelar en Power BI". No se aprende leyendo: se aprende construyendo medidas sobre un modelo real y viendo cómo reaccionan a los filtros. Antes de DAX conviene tener el modelo bien montado —de eso va [el modelado en esquema en estrella](/blog/modelado-datos-power-bi-esquema-estrella/)—, porque un DAX limpio empieza por un modelo limpio.

<aside class="post-key">
<h4>Claves</h4>
<ul>
<li><strong>Medida</strong> → para agregar (sumas, %, ratios). Se recalcula según el filtro del informe.</li>
<li><strong>Columna calculada</strong> → para atributos por fila que vas a filtrar, agrupar o relacionar. Se guarda en el modelo.</li>
<li>Si va a un eje, filtro o segmentación, suele ser columna; si se agrega, es medida.</li>
<li>Resolverlo todo con columnas calculadas hincha el modelo y congela los totales.</li>
</ul>
</aside>

Esto es justo lo que trabajamos en la [formación en Power BI de Aimtech](/power-bi/): el itinerario Avanzado entra a fondo en DAX, contextos y medidas serias, con retos que resuelves tú. Presencial en Barcelona, en remoto en directo o in-company, para empresas, entidades y AAPP.
