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
