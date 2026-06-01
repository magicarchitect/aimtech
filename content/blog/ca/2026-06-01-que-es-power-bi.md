---
title: "Què és Power BI i per a què serveix? Guia 2026 per a empreses"
description: "Què és Power BI, com funciona per dins i quins problemes resol en una empresa: de la dada dispersa a l'informe que s'actualitza sol. Sense tecnicismes."
date: 2026-06-01
author: "Mike Pérez"
tags: ["power-bi", "guia"]
icon: "chart"
draft: false
slug: "que-es-power-bi"
translationKey: "que-es-power-bi"
---

Gairebé tothom ha vist un quadre de comandament de Power BI en una reunió: gràfics que es filtren en fer clic, un mapa que s'acoloreix sol, un parell de números grans que canvien segons el mes que triïs. El que molta gent no té clar és **què és Power BI exactament**, què fa per dins i, sobretot, quin problema resol que un full d'Excel no resolgui ja. Contestem-ho sense fum.

## Què és Power BI, en una frase

Power BI és l'eina de Microsoft per **connectar dades de diferents llocs, organitzar-les i convertir-les en informes interactius** que s'actualitzen quan canvien les dades d'origen. No és "un Excel més bonic": és una capa que es col·loca a sobre de les teves dades —vinguin d'un Excel, una base de dades, un ERP o una API— i et deixa explotar-les sense tornar a copiar i enganxar cada mes.

La versió d'escriptori, **Power BI Desktop, és gratuïta**. Allà construeixes l'informe. Després, si vols compartir-lo amb el teu equip i que es refresqui automàticament, el publiques al núvol (Power BI Service), que ja requereix llicència. Més avall ho aclarim.

## Com funciona Power BI per dins

Entendre Power BI és entendre que un informe passa per tres fases. Saltar-se qualsevol d'elles és la raó habitual per la qual un quadre de comandament "no quadra".

<figure class="svg-figure">
<svg viewBox="0 0 760 250" role="img" aria-labelledby="fig-fases-t fig-fases-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-fases-t">Les tres fases d'un informe a Power BI</title>
<desc id="fig-fases-d">Flux de tres etapes connectades: Power Query neteja les dades, el model les relaciona i l'informe les visualitza.</desc>
<g>
<rect x="10" y="64" width="200" height="150" rx="12" class="d-card"/>
<rect x="26" y="84" width="22" height="18" rx="4" class="d-accent-soft"/>
<text x="37" y="97" font-size="11" text-anchor="middle" class="d-num">01</text>
<text x="56" y="98" font-size="13" class="d-title">Power Query</text>
<rect x="26" y="118" width="168" height="14" rx="3" class="d-card-sub"/>
<rect x="34" y="123" width="78" height="3" rx="1.5" class="d-mute" opacity="0.55"/>
<rect x="120" y="123" width="44" height="3" rx="1.5" class="d-mute" opacity="0.32"/>
<circle cx="186" cy="125" r="2.6" class="d-accent"/>
<rect x="26" y="140" width="168" height="14" rx="3" class="d-card-sub"/>
<rect x="34" y="145" width="78" height="3" rx="1.5" class="d-mute" opacity="0.22"/>
<rect x="120" y="145" width="44" height="3" rx="1.5" class="d-mute" opacity="0.18"/>
<line x1="30" y1="147" x2="190" y2="147" class="d-stroke-mute" opacity="0.7"/>
<rect x="26" y="162" width="168" height="14" rx="3" class="d-card-sub"/>
<rect x="34" y="167" width="78" height="3" rx="1.5" class="d-mute" opacity="0.55"/>
<rect x="120" y="167" width="44" height="3" rx="1.5" class="d-mute" opacity="0.32"/>
<circle cx="186" cy="169" r="2.6" class="d-accent"/>
<rect x="26" y="184" width="168" height="14" rx="3" class="d-card-sub"/>
<rect x="34" y="189" width="78" height="3" rx="1.5" class="d-mute" opacity="0.55"/>
<rect x="120" y="189" width="44" height="3" rx="1.5" class="d-mute" opacity="0.32"/>
<circle cx="186" cy="191" r="2.6" class="d-accent"/>
</g>
<g>
<rect x="280" y="64" width="200" height="150" rx="12" class="d-card"/>
<rect x="296" y="84" width="22" height="18" rx="4" class="d-accent-soft"/>
<text x="307" y="97" font-size="11" text-anchor="middle" class="d-num">02</text>
<text x="326" y="98" font-size="13" class="d-title">Model</text>
<line x1="380" y1="143" x2="320" y2="119" class="d-line"/>
<line x1="380" y1="143" x2="440" y2="119" class="d-line"/>
<line x1="380" y1="158" x2="380" y2="178" class="d-line"/>
<g>
<rect x="298" y="108" width="44" height="22" rx="4" class="d-card-sub"/>
<rect x="298" y="108" width="44" height="4" rx="2" class="d-accent"/>
<rect x="304" y="119" width="24" height="2.5" rx="1" class="d-mute" opacity="0.5"/>
<rect x="304" y="124" width="16" height="2.5" rx="1" class="d-mute" opacity="0.3"/>
</g>
<g>
<rect x="418" y="108" width="44" height="22" rx="4" class="d-card-sub"/>
<rect x="418" y="108" width="44" height="4" rx="2" class="d-accent"/>
<rect x="424" y="119" width="24" height="2.5" rx="1" class="d-mute" opacity="0.5"/>
<rect x="424" y="124" width="16" height="2.5" rx="1" class="d-mute" opacity="0.3"/>
</g>
<g>
<rect x="350" y="128" width="60" height="30" rx="4" class="d-card-sub"/>
<rect x="350" y="128" width="60" height="4" rx="2" class="d-accent"/>
<rect x="358" y="140" width="34" height="2.6" rx="1" class="d-mute" opacity="0.55"/>
<rect x="358" y="146" width="22" height="2.6" rx="1" class="d-mute" opacity="0.32"/>
</g>
<g>
<rect x="356" y="178" width="48" height="22" rx="4" class="d-card-sub"/>
<rect x="356" y="178" width="48" height="4" rx="2" class="d-accent"/>
<rect x="362" y="189" width="26" height="2.5" rx="1" class="d-mute" opacity="0.5"/>
<rect x="362" y="194" width="16" height="2.5" rx="1" class="d-mute" opacity="0.3"/>
</g>
</g>
<g>
<rect x="550" y="64" width="200" height="150" rx="12" class="d-card"/>
<rect x="566" y="84" width="22" height="18" rx="4" class="d-accent-soft"/>
<text x="577" y="97" font-size="11" text-anchor="middle" class="d-num">03</text>
<text x="596" y="98" font-size="13" class="d-title">Informe</text>
<text x="566" y="132" font-size="26" class="d-kpi">84<tspan font-size="14">%</tspan></text>
<text x="567" y="146" font-size="9" class="d-label">ràtio</text>
<polyline points="650,128 666,120 682,124 698,110 714,116 734,104" class="d-accent-s"/>
<rect x="566" y="172" width="24" height="28" rx="2" class="d-accent" opacity="0.5"/>
<rect x="599" y="160" width="24" height="40" rx="2" class="d-accent" opacity="0.65"/>
<rect x="632" y="166" width="24" height="34" rx="2" class="d-accent" opacity="0.8"/>
<rect x="665" y="150" width="24" height="50" rx="2" class="d-accent"/>
<rect x="698" y="158" width="24" height="42" rx="2" class="d-accent" opacity="0.7"/>
</g>
<line x1="214" y1="139" x2="272" y2="139" class="d-stroke-mute"/>
<path d="M274 139 L265 134 L265 144 Z" class="d-mute"/>
<line x1="484" y1="139" x2="542" y2="139" class="d-stroke-mute"/>
<path d="M544 139 L535 134 L535 144 Z" class="d-mute"/>
</svg>
<figcaption>Un informe de Power BI passa sempre per tres fases: <b>Power Query</b> neteja les dades, el <b>model</b> les relaciona i l'<b>informe</b> les explica. Si una falla, els números no quadren.</figcaption>
</figure>

### 1. Power Query: la cuina

Abans de pintar un sol gràfic, les dades es carreguen i es netegen a **Power Query**. Aquí és on es corregeixen els codis mal escrits, s'eliminen les files buides, se separen columnes i se'ls dona el tipus correcte (data, número, text). És l'equivalent al *mise en place* d'una cuina: si entra brossa, surt brossa, per molt bonic que sigui el gràfic final. En les dades reals d'una empresa, aquesta fase sol ser el 70 % de la feina.

### 2. El model: com es relacionen les teves taules

Un cop netes, les dades no viuen en una única taula gegant. Viuen en **diverses taules relacionades** —clients, comandes, productes, dates— connectades entre si. Aquest conjunt de relacions és *el model*, i és el que permet que en filtrar per "client" es filtrin alhora les vendes, els productes i el període. Un bon model és invisible per a qui fa servir l'informe i decisiu perquè els números surtin bé.

### 3. L'informe: el que veu qui decideix

A sobre del model es construeix allò visible: gràfics, taules, mapes, targetes amb KPIs i segmentacions per filtrar. És l'única part que veu la direcció, i la que fa que Power BI sembli "fàcil". Ho és —si les dues fases anteriors estan ben fetes.

## Per a què serveix Power BI en una empresa?

A la pràctica, Power BI serveix per deixar de fabricar informes a mà. Alguns usos típics:

- **Quadres de comandament de direcció**: vendes, marges, tresoreria i objectius en una sola pantalla, actualitzats sols.
- **Control de gestió**: tancaments mensuals que abans es muntaven a base de copiar i enganxar a PowerPoint i ara es refresquen amb un botó.
- **Indicadors d'operacions**: producció, logística, incidències, SLA.
- **Sector públic**: indicadors de gestió, transparència i quadres de comandament per a administracions.

El patró comú és sempre el mateix: **un procés repetitiu d'"extreure, creuar, formatar" que passa a fer-se un cop i a repetir-se sol**.

## Power BI Desktop vs Power BI Service

És la confusió més freqüent, així que convé fixar-ho:

- **Power BI Desktop** (gratuït) → on *construeixes* l'informe.
- **Power BI Service** (de pagament, al núvol) → on *publiques, comparteixes i programes l'actualització* per a la resta de l'equip.

Per aprendre, practicar i muntar els teus primers informes no necessites pagar res. La llicència entra quan vols que l'informe sigui un actiu compartit de l'empresa. Ho expliquem a fons a [Power BI és gratuït?](/ca/blog/power-bi-es-gratuit/).

## Quan li convé a la teva empresa… i quan no?

Seria deshonest dir que tota empresa necessita Power BI demà. Si el teu reporting cap en un full, el miren dues persones i no canvia gairebé mai, **Excel continua sent la resposta correcta**. Power BI comença a compensar quan:

- Repeteixes el mateix informe cada setmana o cada mes a mà.
- Creues dades de diverses fonts (vendes + comptabilitat + un CRM, per exemple).
- Diverses persones necessiten la mateixa informació, sempre actualitzada.
- Els teus Excel ja tenen 12 pestanyes, BUSCARV imbricats i triguen a obrir-se.

Si et sona l'últim, probablement el teu equip ja va tocar sostre amb Excel —i aquest és exactament el moment de fer el salt. Ho desglossem a [Power BI vs Excel](/ca/blog/power-bi-vs-excel/).

---

## Per on començar

Power BI no s'aprèn veient vídeos solts: s'aprèn construint un informe real de principi a fi, equivocant-se amb dades brutes i entenent per què un número no quadra. Si vols que el teu equip ho aprengui així, a Aimtech fem [formació en Power BI a mida per a empreses, entitats i AAPP](/ca/power-bi/) —presencial a Barcelona, en remot en directe o in-company—, partint de zero o pujant de nivell a qui ja se'n surt. I si prefereixes delegar-ho, també muntem el quadre de comandament per tu.
