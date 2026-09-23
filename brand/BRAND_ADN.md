# QR by JS-Innov.IA — Bible ADN canonique

Statut : **production**  
Dernier alignement : 2026-09-23

## Identité
QR by JS-Innov.IA est un produit utilitaire de l'écosystème JS-Innov.IA. Son interface possède une déclinaison propre sombre violet/cyan, tandis que le logo JS-Innov.IA est verrouillé dans les QR générés.

## Palette runtime
- Fond : HSL `240 10% 4%`
- Cartes : HSL `240 8% 8%`
- Primaire violet : HSL `262 83% 65%`
- Accent cyan : HSL `192 100% 50%`
- Gradient violet : `#A78BFA`
- Cyan : `#22D3EE`
- Indigo : `#818CF8`
- Blanc : `#FFFFFF`

## Typographies
- Corps : Inter
- Titres / accents : Space Grotesk

## Logo verrouillé
`src/lib/brandLogo.js` référence actuellement le master externe :
`https://media.base44.com/images/public/6a0448473bebffcc3578f3b8/202e09753_logo-phoenix-512.png`

Configuration : ratio 0,22 ; forme cercle ; fond transparent ; `locked: true`.

Ce logo ne doit jamais être remplacé, recolorisé ou régénéré automatiquement.

## Règles agents
- Ne pas confondre l'interface QR (violet/cyan) avec la palette du site corporate JS-Innov.IA.
- Le logo verrouillé est un asset, pas un prompt.
- Les couleurs personnalisables d'un QR client ne modifient pas l'ADN de l'application.
- Si le logo externe n'est plus accessible, bloquer la composition de marque plutôt que créer un substitut.
