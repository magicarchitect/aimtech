---
title: "Modelado de datos en Power BI: relaciones, jerarquías y esquema en estrella"
description: "El esquema en estrella es la diferencia entre un Power BI que vuela y uno que da números raros. Te explicamos hechos, dimensiones y relaciones sin jerga."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "modelado"]
icon: "chart"
draft: false
slug: "modelado-datos-power-bi-esquema-estrella"
translationKey: "modelado-datos-power-bi-esquema-estrella"
---

La mayoría de los problemas de Power BI que parecen "de DAX" o "de visualización" son en realidad problemas de **modelado**. Un modelo mal montado da totales que no cuadran, filtros que no filtran y refrescos lentos. Un modelo bien montado hace que todo lo demás sea fácil. Y el patrón que lo hace bien tiene nombre: **esquema en estrella**.

## Hechos y dimensiones: las dos clases de tabla

En un modelo sano, tus tablas son de dos tipos:

- **Tablas de hechos** (*fact*): registran lo que pasa, fila a fila. Ventas, pedidos, llamadas, incidencias. Tienen los números que vas a sumar (importe, cantidad) y las claves que enlazan con el resto.
- **Tablas de dimensiones** (*dim*): describen el contexto. Clientes, productos, calendario, regiones, empleados. Son las que usas para *filtrar* y *agrupar*: "ventas **por** producto", "incidencias **por** mes".

## El esquema en estrella

El **esquema en estrella** coloca una tabla de hechos en el centro y las dimensiones alrededor, cada una conectada al centro con una relación **uno-a-muchos** (una fila de dimensión → muchas filas de hechos). Dibujado, parece una estrella. Y es como Power BI quiere trabajar: su motor (VertiPaq) está optimizado precisamente para este patrón.

<figure class="svg-figure">
<svg viewBox="0 0 760 300" role="img" aria-labelledby="fig-est-t fig-est-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-est-t">Esquema en estrella</title>
<desc id="fig-est-d">Una tabla de hechos (Ventas) en el centro conectada a cuatro dimensiones alrededor: Fechas, Clientes, Productos y Tiendas.</desc>
<line x1="380" y1="150" x2="380" y2="92" class="d-line"/>
<line x1="380" y1="150" x2="224" y2="150" class="d-line"/>
<line x1="380" y1="150" x2="536" y2="150" class="d-line"/>
<line x1="380" y1="150" x2="380" y2="208" class="d-line"/>
<g>
<rect x="312" y="46" width="136" height="46" rx="8" class="d-card-sub"/><rect x="312" y="46" width="136" height="4" rx="2" class="d-accent"/>
<text x="380" y="74" text-anchor="middle" font-size="13" class="d-title">Fechas</text>
</g>
<g>
<rect x="88" y="127" width="136" height="46" rx="8" class="d-card-sub"/><rect x="88" y="127" width="136" height="4" rx="2" class="d-accent"/>
<text x="156" y="155" text-anchor="middle" font-size="13" class="d-title">Clientes</text>
</g>
<g>
<rect x="536" y="127" width="136" height="46" rx="8" class="d-card-sub"/><rect x="536" y="127" width="136" height="4" rx="2" class="d-accent"/>
<text x="604" y="155" text-anchor="middle" font-size="13" class="d-title">Productos</text>
</g>
<g>
<rect x="312" y="208" width="136" height="46" rx="8" class="d-card-sub"/><rect x="312" y="208" width="136" height="4" rx="2" class="d-accent"/>
<text x="380" y="236" text-anchor="middle" font-size="13" class="d-title">Tiendas</text>
</g>
<rect x="318" y="122" width="124" height="56" rx="8" class="d-surface"/>
<rect x="318" y="122" width="124" height="56" rx="8" class="d-accent-soft"/>
<rect x="318" y="122" width="124" height="5" rx="2.5" class="d-accent"/>
<text x="380" y="148" text-anchor="middle" font-size="14" class="d-ink">Ventas</text>
<text x="380" y="166" text-anchor="middle" font-size="9" class="d-label">hechos</text>
</svg>
<figcaption>El esquema en estrella: una tabla de <b>hechos</b> (Ventas) en el centro y las <b>dimensiones</b> alrededor, cada una con una relación uno-a-muchos. Power BI rinde mejor así.</figcaption>
</figure>

Lo contrario —meter todo en una sola tabla plana gigante, o encadenar tablas en copo de nieve con relaciones en cascada— es lo que produce lentitud y resultados raros.

## La tabla de calendario: el detalle que casi todos olvidan

Si quieres comparar "este mes vs el anterior", "acumulado del año" o "mismo periodo del año pasado", necesitas una **tabla de calendario** propia (una dimensión de fechas) relacionada con tus hechos. Sin ella, la *time intelligence* de DAX no funciona bien. Es de las primeras cosas que se montan en un modelo serio.

## Jerarquías

Las **jerarquías** agrupan niveles que se recorren de arriba abajo: Año → Trimestre → Mes → Día, o País → Región → Ciudad. Permiten al usuario hacer *drill-down* en un gráfico —de año a mes con un clic— sin que tengas que montar un visual por nivel.

## Por qué esto importa para el negocio

Un modelo en estrella no es purismo técnico: es lo que hace que el informe sea **fiable y rápido**. Cuando el modelo está bien, las medidas DAX salen cortas y correctas, los filtros se propagan como esperas y el refresco no se eterniza. Cuando está mal, acabas parcheando con fórmulas imposibles para tapar un diseño que no aguanta.

Por eso en la [formación en Power BI de Aimtech](/power-bi/) el modelado va **antes** que el DAX: relaciones, esquema en estrella y calendario en el itinerario de cero a intermedio, y modelado complejo en el Avanzado. Con el modelo claro, [la duda de medida vs columna calculada](/blog/dax-medidas-vs-columnas-calculadas/) casi se resuelve sola. Presencial en Barcelona, en remoto o in-company, para empresas, entidades y AAPP.
