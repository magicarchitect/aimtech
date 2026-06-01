---
title: "Mapes a Power BI: per què no es veuen i com activar-los"
description: "El mapa de Power BI et surt en blanc o desactivat? Gairebé sempre és una de dues coses. T'expliquem per què passa i com arreglar-ho, pas a pas."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "visualitzacio"]
icon: "chart"
draft: false
slug: "mapes-power-bi"
translationKey: "mapas-power-bi"
---

Poques coses frustren més en començar amb Power BI que arrossegar un camp de ciutats a un mapa... i que no surti res. O pitjor: que la icona del mapa aparegui en gris, desactivada. Gairebé sempre és una de dues causes, i totes dues tenen un arranjament ràpid. Som-hi.

## Causa 1: el mapa està desactivat a l'organització

Per defecte, en molts tenants d'empresa els **mapes estan bloquejats per l'administrador**. És una opció de seguretat: els visuals de mapa envien dades a un servei extern de Microsoft (Bing) per geolocalitzar, i algunes organitzacions ho desactiven fins a valorar-ho.

Si la icona de mapa apareix en gris, l'arranjament no és al teu informe: és al **portal d'administració de Power BI**, a la configuració del tenant, on cal habilitar "Map and filled map visuals". Això ho fa qui administra Power BI a la teva organització (TI), no es resol des de Desktop.

## Causa 2: les teves dades no tenen categoria geogràfica

L'altra causa, més habitual: Power BI **no sap que la teva columna és geogràfica**. Per a ell, "Barcelona" o "08001" són text qualsevol fins que l'hi dius.

L'arranjament és al model: selecciones la columna i, a **Categoria de dades**, li assignes el que és —Ciutat, País, Província/Estat, Codi postal, Latitud, Longitud—. Amb això, Power BI ja sap com situar-la al mapa i millora moltíssim l'encert de la geolocalització.

Un consell que estalvia maldecaps: com més precisa la dada, millor. Una ciutat sola pot ser ambigua; donar-li també província i país, o directament latitud/longitud, evita que et col·loqui punts a l'altre hemisferi.

## Quin tipus de mapa fer servir

Aclarit el "per què no es veu", queda triar:

- **Mapa de bombolles** (el bàsic): punts la mida dels quals representa un valor. Bé per a "vendes per ciutat".
- **Mapa coroplètic** (*filled map*): acoloreix regions senceres segons un valor. Bé per a "atur per província".
- **Azure Maps / ArcGIS**: visuals més potents per a anàlisi geogràfica seriosa (capes, rutes, mapes de calor) quan el bàsic es queda curt.

## La lliçó de fons

Els mapes són l'exemple perfecte d'una cosa que a Power BI sembla un bug i és **configuració**: o un permís del tenant, o una categoria de dada sense assignar. Saber distingir "això és el meu model" de "això és administració" t'estalvia hores de barallar-te amb el lloc equivocat.

A la [formació en Power BI d'Aimtech](/ca/power-bi/) els mapes són un bloc propi de l'itinerari de zero a intermedi —amb els dos problemes reals que acabem de veure—, dins d'una visualització que va més enllà del gràfic de barres. Presencial a Barcelona, en remot en directe o in-company, per a empreses, entitats i AAPP.
