---
title: "Prompt engineering per a empreses: guia pràctica (sense fum)"
description: "Un bon prompt no és màgia: és rol + context + tasca + format, més iteració. Guia pràctica perquè el teu equip escrigui instruccions que funcionen sempre."
date: 2026-06-01
author: "Mike Pérez"
tags: ["ia-aplicada", "prompting"]
icon: "doc"
draft: false
slug: "prompt-engineering-empreses"
translationKey: "prompt-engineering-empresas"
---

"Prompt engineering" sona a disciplina arcana i no ho és. És, bàsicament, aprendre a demanar bé les coses. La diferència entre un equip que treu resultats mediocres de la IA i un que la converteix en una eina fiable gairebé sempre és aquí: en com escriuen la instrucció. Anem al pràctic.

## Què és un prompt (i què no)

Un **prompt** és la instrucció que dones a la IA. Molta gent escriu prompts d'una línia —"resumeix això"— i després es queixa que el resultat és genèric. Normal: a una persona nova tampoc li demanaries una feina donant-li una sola frase i zero context.

Un bon prompt no és més llarg per caprici: és més **complet**. Dona a la IA el que necessita per encertar a la primera.

## L'estructura que funciona: rol + context + tasca + format

La majoria de prompts bons tenen aquestes quatre peces:

- **Rol** — qui vols que sigui: *"Actua com a responsable d'atenció al client d'una empresa de logística."*
- **Context** — la informació del cas: *"Un client es queixa d'un retard de 3 dies en un enviament urgent. És un client habitual."*
- **Tasca** — què vols exactament: *"Redacta una resposta que reconegui el problema, expliqui la solució i conservi la relació."*
- **Format** — com ho vols: *"To proper però professional, màxim 120 paraules, sense prometre compensacions econòmiques."*

Ajunta les quatre i el salt de qualitat respecte a "respon a aquesta queixa" és enorme. La IA deixa d'endevinar.

<figure class="svg-figure">
<svg viewBox="0 0 760 232" role="img" aria-labelledby="fig-pe-t fig-pe-d" xmlns="http://www.w3.org/2000/svg">
<title id="fig-pe-t">L'estructura d'un bon prompt</title>
<desc id="fig-pe-d">Rol, context, tasca i format se sumen al prompt i produeixen una resposta que funciona a la primera.</desc>
<g>
<rect x="24" y="28" width="380" height="40" rx="7" class="d-card-sub"/><rect x="24" y="28" width="4" height="40" rx="2" class="d-accent"/>
<text x="42" y="46" font-size="12" class="d-title">Rol</text><text x="42" y="61" font-size="10" class="d-txt">responsable d'atenció al client</text>
</g>
<g>
<rect x="24" y="76" width="380" height="40" rx="7" class="d-card-sub"/><rect x="24" y="76" width="4" height="40" rx="2" class="d-accent"/>
<text x="42" y="94" font-size="12" class="d-title">Context</text><text x="42" y="109" font-size="10" class="d-txt">queixa per un retard de 3 dies</text>
</g>
<g>
<rect x="24" y="124" width="380" height="40" rx="7" class="d-card-sub"/><rect x="24" y="124" width="4" height="40" rx="2" class="d-accent"/>
<text x="42" y="142" font-size="12" class="d-title">Tasca</text><text x="42" y="157" font-size="10" class="d-txt">redacta una resposta</text>
</g>
<g>
<rect x="24" y="172" width="380" height="40" rx="7" class="d-card-sub"/><rect x="24" y="172" width="4" height="40" rx="2" class="d-accent"/>
<text x="42" y="190" font-size="12" class="d-title">Format</text><text x="42" y="205" font-size="10" class="d-txt">≤120 paraules, to proper</text>
</g>
<line x1="412" y1="120" x2="470" y2="120" class="d-stroke-mute"/>
<path d="M472 120 L463 115 L463 125 Z" class="d-mute"/>
<rect x="492" y="84" width="244" height="72" rx="10" class="d-surface"/>
<rect x="492" y="84" width="244" height="72" rx="10" class="d-accent-soft"/>
<rect x="492" y="84" width="244" height="5" rx="2.5" class="d-accent"/>
<path d="M512 120 l7 7 l13 -15" class="d-accent-s"/>
<text x="544" y="118" font-size="14" class="d-ink">Resposta que funciona</text>
<text x="544" y="137" font-size="10" class="d-label">a la primera</text>
</svg>
<figcaption><b>Rol + context + tasca + format</b>: quatre peces que converteixen "respon a això" en una instrucció que la IA encerta a la primera.</figcaption>
</figure>

## Iterar: el segon esborrany gairebé sempre guanya

El primer resultat poques vegades és el definitiu, i està bé. En lloc de començar de zero, **corregeix sobre el que ja tens**: "més curt", "menys formal", "treu la segona frase", "afegeix una alternativa". Iterar dues o tres vegades és més ràpid que escriure el prompt perfecte a la primera, i ensenya l'equip a dialogar amb l'eina en comptes de tractar-la com una màquina d'una sola pulsació.

## Prompting en equip: de truc personal a actiu d'empresa

Aquí hi ha la part que gairebé ningú fa i que més rendeix: **convertir els bons prompts en plantilles compartides.** Si una persona troba el prompt perfecte per respondre reclamacions, aquest prompt hauria d'estar disponible per a tot l'equip, no morir al seu historial. Una petita biblioteca de prompts per tasca —respostes a clients, resums de reunió, esborranys d'oferta— és el que separa "alguns fan servir IA" de "l'empresa treballa amb IA".

Això és just el que entrenem a la [formació en IA aplicada d'Aimtech](/ca/ia-aplicada/): no receptes que caduquen, sinó el mètode perquè cada persona escrigui els seus propis prompts i l'equip construeixi la seva biblioteca. En grups tancats, presencial a Barcelona, en remot en directe o in-company. I si el que busques és anar més enllà del prompt —que un sistema executi el procés sencer per tu—, això ja és [IA agèntica](/ca/ia-agentica/).
