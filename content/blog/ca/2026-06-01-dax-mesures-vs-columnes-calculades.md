---
title: "DAX per a principiants: mesures vs columnes calculades"
description: "El dubte que frena tothom que comença amb DAX: mesura o columna calculada? T'expliquem la diferència, quan fer servir cadascuna i l'error que es paga car."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "dax"]
icon: "chart"
draft: false
slug: "dax-mesures-vs-columnes-calculades"
translationKey: "dax-medidas-vs-columnas-calculadas"
---

Gairebé tothom que comença amb DAX s'encalla a la mateixa bifurcació: per calcular alguna cosa, creo una **mesura** o una **columna calculada**? Totes dues fan servir la mateixa fórmula moltes vegades, així que semblen intercanviables. No ho són, i triar malament et penalitza en rendiment i en resultats estranys. Aclarim-ho.

## La diferència de fons: quan es calcula cadascuna

- Una **columna calculada** es calcula **fila a fila, en refrescar les dades**, i el resultat es desa al model (ocupa memòria). És com afegir una columna més a la taula.
- Una **mesura** es calcula **en el moment de la consulta**, segons el que hi hagi a l'informe en aquell instant: els filtres, la fila de la taula, el segment seleccionat. No es desa: es recalcula sobre la marxa.

Aquesta paraula —**context**— és la clau. Una columna calculada només "veu" la seva pròpia fila. Una mesura "veu" el context de filtre de l'informe: el mes seleccionat, la regió del gràfic, el segmentador actiu.

<figure class="svg-figure">
<svg viewBox="0 0 760 244" role="img" aria-labelledby="fig-dax-t fig-dax-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-dax-t">Columna calculada davant de mesura</title>
<desc id="fig-dax-d">La columna calculada es calcula fila a fila en refrescar i es desa al model; la mesura es recalcula en consultar, segons el filtre, i no ocupa memòria.</desc>

<g>
<rect x="16" y="28" width="352" height="196" rx="12" class="d-card"/>
<text x="40" y="62" font-size="14" class="d-title">Columna calculada</text>
<text x="40" y="83" font-size="11" class="d-txt-i">fila a fila · en refrescar · es desa</text>
<rect x="40" y="104" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="104" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="114" r="2.6" class="d-accent"/>
<rect x="40" y="130" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="130" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="140" r="2.6" class="d-accent"/>
<rect x="40" y="156" width="196" height="20" rx="3" class="d-card-sub"/>
<rect x="244" y="156" width="84" height="20" rx="3" class="d-accent-soft"/>
<circle cx="286" cy="166" r="2.6" class="d-accent"/>
<text x="244" y="198" font-size="9" class="d-label">guardada al model</text>
</g>

<g>
<rect x="392" y="28" width="352" height="196" rx="12" class="d-card"/>
<text x="416" y="62" font-size="14" class="d-title">Mesura</text>
<text x="416" y="83" font-size="11" class="d-txt-i">en consultar · segons el filtre</text>
<rect x="416" y="102" width="132" height="26" rx="13" class="d-accent-soft"/>
<circle cx="433" cy="115" r="3" class="d-accent"/>
<text x="446" y="119" font-size="10" class="d-dim">filtre: juny</text>
<line x1="430" y1="150" x2="430" y2="172" class="d-stroke-mute"/>
<path d="M430 174 L425 165 L435 165 Z" class="d-mute"/>
<text x="470" y="182" font-size="38" class="d-kpi">1.248</text>
<text x="416" y="206" font-size="9" class="d-label">es recalcula · no ocupa memòria</text>
</g>
</svg>
<figcaption>La <b>columna calculada</b> es calcula fila a fila en refrescar i es desa al model; la <b>mesura</b> es recalcula en consultar, segons el filtre, i no ocupa memòria.</figcaption>
</figure>

## La regla pràctica

- **Fes servir una mesura** per a tot el que sigui **agregació**: sumes, mitjanes, percentatges, ràtios, totals que canvien segons el filtre. *Vendes totals*, *marge %*, *tiquet mitjà* → mesures, sempre.
- **Fes servir una columna calculada** quan necessites un **atribut per fila** que després faràs servir per **filtrar, agrupar o relacionar**: classificar cada venda en un rang ("alta/mitjana/baixa"), extreure l'any d'una data per a una jerarquia, marcar si una fila compleix una condició.

Dit curt: **si va a un eix, un filtre o una segmentació, sol ser columna. Si va a un valor que s'agrega, és mesura.**

> El context de filtre és el que separa «sé escriure DAX» de «sé modelar a Power BI».

## L'error que es paga car

L'error típic del principiant és resoldre-ho tot amb columnes calculades perquè "es veuen a la taula i és més intuïtiu". Funciona en una taula petita i peta en una de gran: cada columna calculada infla el model, alenteix el refresc i, pitjor encara, dona números que no responen als filtres de l'usuari. Les sumes que haurien de canviar en seleccionar un mes es queden congelades.

La bona notícia: quan entens el context de filtre, el 90% dels teus càlculs de negoci surten sent mesures, el teu model queda lleuger i els informes responen sols al que l'usuari toca.

## Perquè es quedi

El context de filtre és el concepte que separa "sé escriure fórmules DAX" de "sé modelar a Power BI". No s'aprèn llegint: s'aprèn construint mesures sobre un model real i veient com reaccionen als filtres. Abans del DAX convé tenir el model ben muntat —d'això va [el modelatge en esquema en estrella](/ca/blog/modelatge-dades-power-bi-esquema-estrella/)—, perquè un DAX net comença per un model net.

<aside class="post-key">
<h4>Claus</h4>
<ul>
<li><strong>Mesura</strong> → per agregar (sumes, %, ràtios). Es recalcula segons el filtre de l'informe.</li>
<li><strong>Columna calculada</strong> → per a atributs per fila que filtraràs, agruparàs o relacionaràs. Es desa al model.</li>
<li>Si va a un eix, filtre o segmentació, sol ser columna; si s'agrega, és mesura.</li>
<li>Resoldre-ho tot amb columnes calculades infla el model i congela els totals.</li>
</ul>
</aside>

Això és just el que treballem a la [formació en Power BI d'Aimtech](/ca/power-bi/): l'itinerari Avançat entra a fons al DAX, contextos i mesures serioses, amb reptes que resols tu. Presencial a Barcelona, en remot en directe o in-company, per a empreses, entitats i AAPP.
