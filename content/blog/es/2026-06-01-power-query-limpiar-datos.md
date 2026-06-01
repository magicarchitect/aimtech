---
title: "Power Query: cómo limpiar datos sucios paso a paso"
description: "Antes de un gráfico bonito hay datos sucios que limpiar. Power Query lo hace una vez y se repite solo en cada refresco. Te explicamos cómo, sin código."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "power-query"]
icon: "doc"
draft: false
slug: "power-query-limpiar-datos"
translationKey: "power-query-limpiar-datos"
---

El 80% del trabajo de un informe no es el gráfico: es dejar los datos en condiciones para poder hacerlo. Fechas en tres formatos distintos, columnas con espacios, importes que llegan como texto, filas vacías, dos sistemas que llaman al mismo cliente de dos maneras. **Power Query** es la herramienta de Power BI para limpiar todo eso —y la mejor parte: lo configuras una vez y se repite solo en cada actualización.

## Qué es Power Query (y por qué cambia tu vida)

Power Query es el editor donde **transformas los datos antes de que entren al modelo**. Cada cosa que haces —quitar una columna, cambiar un tipo, filtrar filas— queda registrada como un **paso aplicado**. La próxima vez que lleguen datos nuevos con el mismo formato, Power Query repite todos los pasos automáticamente. Se acabó limpiar el Excel a mano cada lunes.

<figure class="svg-figure">
<svg viewBox="0 0 760 212" role="img" aria-labelledby="fig-pq-t fig-pq-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-pq-t">El flujo de Power Query</title>
<desc id="fig-pq-d">Los datos sucios pasan por los pasos aplicados de Power Query y salen limpios; el proceso se repite solo en cada actualización.</desc>
<g>
<rect x="16" y="30" width="212" height="116" rx="12" class="d-card"/>
<text x="38" y="58" font-size="13" class="d-title">Datos sucios</text>
<rect x="38" y="74" width="120" height="13" rx="2" class="d-card-sub"/>
<rect x="38" y="93" width="168" height="13" rx="2" class="d-card-sub"/>
<rect x="38" y="112" width="92" height="13" rx="2" class="d-card-sub"/>
<circle cx="196" cy="99" r="4" class="d-accent"/>
</g>
<line x1="228" y1="88" x2="270" y2="88" class="d-stroke-mute"/>
<path d="M272 88 L263 83 L263 93 Z" class="d-mute"/>
<g>
<rect x="274" y="30" width="212" height="116" rx="12" class="d-card"/>
<rect x="274" y="30" width="212" height="116" rx="12" class="d-accent-soft"/>
<text x="296" y="58" font-size="13" class="d-title">Power Query</text>
<text x="296" y="78" font-size="10" class="d-num">01</text><text x="316" y="78" font-size="11" class="d-txt">tipos de dato</text>
<text x="296" y="98" font-size="10" class="d-num">02</text><text x="316" y="98" font-size="11" class="d-txt">quitar lo que sobra</text>
<text x="296" y="118" font-size="10" class="d-num">03</text><text x="316" y="118" font-size="11" class="d-txt">limpiar texto</text>
<text x="296" y="138" font-size="10" class="d-num">04</text><text x="316" y="138" font-size="11" class="d-txt">combinar / anexar</text>
</g>
<line x1="486" y1="88" x2="528" y2="88" class="d-stroke-mute"/>
<path d="M530 88 L521 83 L521 93 Z" class="d-mute"/>
<g>
<rect x="532" y="30" width="212" height="116" rx="12" class="d-card"/>
<text x="554" y="58" font-size="13" class="d-title">Datos limpios</text>
<rect x="554" y="74" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="80" r="2.4" class="d-accent"/>
<rect x="554" y="93" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="99" r="2.4" class="d-accent"/>
<rect x="554" y="112" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="118" r="2.4" class="d-accent"/>
</g>
<path d="M380 168 C 300 196, 460 196, 380 168" class="d-dash"/>
<text x="380" y="190" text-anchor="middle" font-size="10" class="d-label">se repite en cada actualización</text>
</svg>
<figcaption>Configuras la limpieza una vez como <b>pasos aplicados</b>; los datos sucios entran y salen limpios, y el proceso <b>se repite solo</b> en cada actualización.</figcaption>
</figure>

## Los arreglos que harás el 90% de las veces

- **Tipos de dato correctos.** Lo primero y lo más importante: que las fechas sean fechas, los números números y el texto texto. Un importe que entra como texto no se suma.
- **Quitar lo que sobra.** Columnas que no usarás, filas en blanco, cabeceras repetidas, totales que venían pegados en el origen.
- **Limpiar texto.** Espacios de más, mayúsculas/minúsculas inconsistentes, recortar y normalizar para que "Madrid " y "madrid" sean lo mismo.
- **Dividir y combinar columnas.** Separar "Apellido, Nombre" en dos, o juntar código y descripción.
- **Reemplazar valores y gestionar nulos.** Decidir qué pasa con los huecos en vez de que rompan los cálculos.

## Dos operaciones que valen oro

- **Combinar consultas (merge):** cruzar dos tablas por una clave común, como un BUSCARV pero bien hecho y repetible. Traer el nombre del cliente a la tabla de ventas, por ejemplo.
- **Anexar consultas (append):** apilar tablas con la misma estructura. Doce hojas mensuales en una sola tabla anual, sin copiar y pegar.

## El cambio de mentalidad

Quien viene de Excel arregla los datos *a mano, cada vez*. Power Query te obliga a un cambio de chip: arreglas el **proceso una vez** y se ejecuta solo para siempre. Esa es la diferencia entre dedicar el lunes a "preparar el informe" y abrirlo ya hecho.

Con los datos limpios entras al [modelado](/blog/modelado-datos-power-bi-esquema-estrella/) con buen pie, y de ahí a las medidas. En la [formación en Power BI de Aimtech](/power-bi/), Power Query es de los primeros bloques del itinerario de cero a intermedio, con datos sucios de verdad —no de manual— para que practiques el problema real. Presencial en Barcelona, en remoto en directo o in-company, para empresas, entidades y AAPP.
