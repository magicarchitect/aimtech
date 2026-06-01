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

## La regla práctica

- **Usa una medida** para todo lo que sea **agregación**: sumas, promedios, porcentajes, ratios, totales que cambian según el filtro. *Ventas totales*, *margen %*, *ticket medio* → medidas, siempre.
- **Usa una columna calculada** cuando necesitas un **atributo por fila** que luego usarás para **filtrar, agrupar o relacionar**: clasificar cada venta en un rango ("alta/media/baja"), extraer el año de una fecha para una jerarquía, marcar si una fila cumple una condición.

Dicho corto: **si va a un eje, un filtro o una segmentación, suele ser columna. Si va a un valor que se agrega, es medida.**

## El error que se paga caro

El error típico del principiante es resolverlo todo con columnas calculadas porque "se ven en la tabla y es más intuitivo". Funciona en una tabla pequeña y revienta en una grande: cada columna calculada hincha el modelo, ralentiza el refresco y, peor aún, da números que no responden a los filtros del usuario. Las sumas que deberían cambiar al seleccionar un mes se quedan congeladas.

La buena noticia: en cuanto entiendes el contexto de filtro, el 90% de tus cálculos de negocio salen siendo medidas, tu modelo queda ligero y los informes responden solos a lo que el usuario toca.

## Para que se quede

El contexto de filtro es el concepto que separa "sé escribir fórmulas DAX" de "sé modelar en Power BI". No se aprende leyendo: se aprende construyendo medidas sobre un modelo real y viendo cómo reaccionan a los filtros. Antes de DAX conviene tener el modelo bien montado —de eso va [el modelado en esquema en estrella](/blog/modelado-datos-power-bi-esquema-estrella/)—, porque un DAX limpio empieza por un modelo limpio.

Esto es justo lo que trabajamos en la [formación en Power BI de Aimtech](/power-bi/): el itinerario Avanzado entra a fondo en DAX, contextos y medidas serias, con retos que resuelves tú. Presencial en Barcelona, en remoto en directo o in-company, para empresas, entidades y AAPP.
