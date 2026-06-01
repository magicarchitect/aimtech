---
title: "Mapas en Power BI: por qué no se ven y cómo activarlos"
description: "¿El mapa de Power BI te sale en blanco o desactivado? Casi siempre es una de dos cosas. Te explicamos por qué pasa y cómo arreglarlo, paso a paso."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "visualizacion"]
icon: "chart"
draft: false
slug: "mapas-power-bi"
translationKey: "mapas-power-bi"
---

Pocas cosas frustran más al empezar con Power BI que arrastrar un campo de ciudades a un mapa... y que no salga nada. O peor: que el icono del mapa aparezca en gris, desactivado. Casi siempre es una de dos causas, y las dos tienen arreglo rápido. Vamos a ello.

## Causa 1: el mapa está desactivado en la organización

Por defecto, en muchos tenants de empresa los **mapas están bloqueados por el administrador**. Es una opción de seguridad: los visuales de mapa envían datos a un servicio externo de Microsoft (Bing) para geolocalizar, y algunas organizaciones lo desactivan hasta valorarlo.

Si el icono de mapa aparece en gris, el arreglo no está en tu informe: está en el **portal de administración de Power BI**, en la configuración del tenant, donde hay que habilitar "Map and filled map visuals". Esto lo hace quien administra Power BI en tu organización (TI), no se resuelve desde Desktop.

## Causa 2: tus datos no tienen categoría geográfica

La otra causa, más habitual: Power BI **no sabe que tu columna es geográfica**. Para él, "Barcelona" o "08001" son texto cualquiera hasta que se lo dices.

El arreglo está en el modelo: seleccionas la columna y, en **Categoría de datos**, le asignas lo que es —Ciudad, País, Provincia/Estado, Código postal, Latitud, Longitud—. Con eso, Power BI ya sabe cómo situarla en el mapa y mejora muchísimo el acierto de la geolocalización.

Un consejo que ahorra dolores: cuanto más preciso el dato, mejor. Una ciudad sola puede ser ambigua (¿qué "Toledo"?); darle también provincia y país, o directamente latitud/longitud, evita que te coloque puntos en el otro hemisferio.

## Qué tipo de mapa usar

Aclarado el "por qué no se ve", queda elegir:

- **Mapa de burbujas** (el básico): puntos cuyo tamaño representa un valor. Bien para "ventas por ciudad".
- **Mapa coroplético** (*filled map*): colorea regiones enteras según un valor. Bien para "paro por provincia".
- **Azure Maps / ArcGIS**: visuales más potentes para análisis geográfico serio (capas, rutas, mapas de calor) cuando el básico se queda corto.

## La lección de fondo

Los mapas son el ejemplo perfecto de algo que en Power BI parece un bug y es **configuración**: o un permiso del tenant, o una categoría de dato sin asignar. Saber distinguir "esto es mi modelo" de "esto es administración" te ahorra horas de pelearte con el sitio equivocado.

En la [formación en Power BI de Aimtech](/power-bi/) los mapas son un bloque propio del itinerario de cero a intermedio —con los dos problemas reales que acabamos de ver—, dentro de una visualización que va más allá del gráfico de barras. Presencial en Barcelona, en remoto en directo o in-company, para empresas, entidades y AAPP.
