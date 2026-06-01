---
title: "Modelatge de dades a Power BI: relacions, jerarquies i esquema en estrella"
description: "L'esquema en estrella és la diferència entre un Power BI que vola i un que dona números estranys. T'expliquem fets, dimensions i relacions sense argot."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "modelatge"]
icon: "chart"
draft: false
slug: "modelatge-dades-power-bi-esquema-estrella"
translationKey: "modelado-datos-power-bi-esquema-estrella"
---

La majoria dels problemes de Power BI que semblen "de DAX" o "de visualització" són en realitat problemes de **modelatge**. Un model mal muntat dona totals que no quadren, filtres que no filtren i refrescos lents. Un model ben muntat fa que tota la resta sigui fàcil. I el patró que ho fa bé té nom: **esquema en estrella**.

## Fets i dimensions: les dues classes de taula

En un model sa, les teves taules són de dos tipus:

- **Taules de fets** (*fact*): registren el que passa, fila a fila. Vendes, comandes, trucades, incidències. Tenen els números que sumaràs (import, quantitat) i les claus que enllacen amb la resta.
- **Taules de dimensions** (*dim*): descriuen el context. Clients, productes, calendari, regions, empleats. Són les que fas servir per *filtrar* i *agrupar*: "vendes **per** producte", "incidències **per** mes".

## L'esquema en estrella

L'**esquema en estrella** col·loca una taula de fets al centre i les dimensions al voltant, cadascuna connectada al centre amb una relació **un-a-molts** (una fila de dimensió → moltes files de fets). Dibuixat, sembla una estrella. I és com Power BI vol treballar: el seu motor (VertiPaq) està optimitzat precisament per a aquest patró.

El contrari —ficar-ho tot en una sola taula plana gegant, o encadenar taules en floc de neu amb relacions en cascada— és el que produeix lentitud i resultats estranys.

## La taula de calendari: el detall que gairebé tothom oblida

Si vols comparar "aquest mes vs l'anterior", "acumulat de l'any" o "mateix període de l'any passat", necessites una **taula de calendari** pròpia (una dimensió de dates) relacionada amb els teus fets. Sense ella, la *time intelligence* de DAX no funciona bé. És de les primeres coses que es munten en un model seriós.

## Jerarquies

Les **jerarquies** agrupen nivells que es recorren de dalt a baix: Any → Trimestre → Mes → Dia, o País → Regió → Ciutat. Permeten a l'usuari fer *drill-down* en un gràfic —d'any a mes amb un clic— sense que hagis de muntar un visual per nivell.

## Per què això importa per al negoci

Un model en estrella no és purisme tècnic: és el que fa que l'informe sigui **fiable i ràpid**. Quan el model està bé, les mesures DAX surten curtes i correctes, els filtres es propaguen com esperes i el refresc no s'eternitza. Quan està malament, acabes apedaçant amb fórmules impossibles per tapar un disseny que no aguanta.

Per això a la [formació en Power BI d'Aimtech](/ca/power-bi/) el modelatge va **abans** que el DAX: relacions, esquema en estrella i calendari a l'itinerari de zero a intermedi, i modelatge complex a l'Avançat. Amb el model clar, [el dubte de mesura vs columna calculada](/ca/blog/dax-mesures-vs-columnes-calculades/) gairebé es resol sol. Presencial a Barcelona, en remot o in-company, per a empreses, entitats i AAPP.
