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
