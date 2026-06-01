---
title: "Power Query: com netejar dades brutes pas a pas"
description: "Abans d'un gràfic bonic hi ha dades brutes per netejar. Power Query ho fa un cop i es repeteix sol a cada refresc. T'expliquem com, sense codi."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "power-query"]
icon: "doc"
draft: false
slug: "power-query-netejar-dades"
translationKey: "power-query-limpiar-datos"
---

El 80% de la feina d'un informe no és el gràfic: és deixar les dades en condicions per poder fer-lo. Dates en tres formats diferents, columnes amb espais, imports que arriben com a text, files buides, dos sistemes que anomenen el mateix client de dues maneres. **Power Query** és l'eina de Power BI per netejar tot això —i la millor part: ho configures un cop i es repeteix sol a cada actualització.

## Què és Power Query (i per què et canvia la vida)

Power Query és l'editor on **transformes les dades abans que entrin al model**. Cada cosa que fas —treure una columna, canviar un tipus, filtrar files— queda registrada com un **pas aplicat**. La pròxima vegada que arribin dades noves amb el mateix format, Power Query repeteix tots els passos automàticament. S'ha acabat netejar l'Excel a mà cada dilluns.

<figure class="svg-figure">
<svg viewBox="0 0 760 212" role="img" aria-labelledby="fig-pq-t fig-pq-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-pq-t">El flux de Power Query</title>
<desc id="fig-pq-d">Les dades brutes passen pels passos aplicats de Power Query i en surten netes; el procés es repeteix sol a cada actualització.</desc>
<g>
<rect x="16" y="30" width="212" height="116" rx="12" class="d-card"/>
<text x="38" y="58" font-size="13" class="d-title">Dades brutes</text>
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
<text x="296" y="78" font-size="10" class="d-num">01</text><text x="316" y="78" font-size="11" class="d-txt">tipus de dada</text>
<text x="296" y="98" font-size="10" class="d-num">02</text><text x="316" y="98" font-size="11" class="d-txt">treure el que sobra</text>
<text x="296" y="118" font-size="10" class="d-num">03</text><text x="316" y="118" font-size="11" class="d-txt">netejar text</text>
<text x="296" y="138" font-size="10" class="d-num">04</text><text x="316" y="138" font-size="11" class="d-txt">combinar / annexar</text>
</g>
<line x1="486" y1="88" x2="528" y2="88" class="d-stroke-mute"/>
<path d="M530 88 L521 83 L521 93 Z" class="d-mute"/>
<g>
<rect x="532" y="30" width="212" height="116" rx="12" class="d-card"/>
<text x="554" y="58" font-size="13" class="d-title">Dades netes</text>
<rect x="554" y="74" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="80" r="2.4" class="d-accent"/>
<rect x="554" y="93" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="99" r="2.4" class="d-accent"/>
<rect x="554" y="112" width="168" height="13" rx="2" class="d-card-sub"/><circle cx="568" cy="118" r="2.4" class="d-accent"/>
</g>
<path d="M380 168 C 300 196, 460 196, 380 168" class="d-dash"/>
<text x="380" y="190" text-anchor="middle" font-size="10" class="d-label">es repeteix en cada actualització</text>
</svg>
<figcaption>Configures la neteja un cop com a <b>passos aplicats</b>; les dades brutes entren i en surten netes, i el procés <b>es repeteix sol</b> a cada actualització.</figcaption>
</figure>

## Els arranjaments que faràs el 90% de les vegades

- **Tipus de dada correctes.** El primer i el més important: que les dates siguin dates, els números números i el text text. Un import que entra com a text no se suma.
- **Treure el que sobra.** Columnes que no faràs servir, files en blanc, capçaleres repetides, totals que venien enganxats a l'origen.
- **Netejar text.** Espais de més, majúscules/minúscules inconsistents, retallar i normalitzar perquè "Barcelona " i "barcelona" siguin el mateix.
- **Dividir i combinar columnes.** Separar "Cognom, Nom" en dos, o ajuntar codi i descripció.
- **Substituir valors i gestionar nuls.** Decidir què passa amb els buits en comptes que trenquin els càlculs.

## Dues operacions que valen or

- **Combinar consultes (merge):** creuar dues taules per una clau comuna, com un BUSCARV però ben fet i repetible. Portar el nom del client a la taula de vendes, per exemple.
- **Annexar consultes (append):** apilar taules amb la mateixa estructura. Dotze fulls mensuals en una sola taula anual, sense copiar i enganxar.

## El canvi de mentalitat

Qui ve d'Excel arregla les dades *a mà, cada vegada*. Power Query t'obliga a un canvi de xip: arregles el **procés un cop** i s'executa sol per sempre. Aquesta és la diferència entre dedicar el dilluns a "preparar l'informe" i obrir-lo ja fet.

Amb les dades netes entres al [modelatge](/ca/blog/modelatge-dades-power-bi-esquema-estrella/) amb bon peu, i d'aquí a les mesures. A la [formació en Power BI d'Aimtech](/ca/power-bi/), Power Query és dels primers blocs de l'itinerari de zero a intermedi, amb dades brutes de debò —no de manual— perquè practiquis el problema real. Presencial a Barcelona, en remot en directe o in-company, per a empreses, entitats i AAPP.
