# Système de pesée de Coquelicoop

Le système de pesée comporte deux applications stand-alone :

- une application **Articles*** qui tourne su PC de gestion du réseau local et qui gère un ficier articles.csv qui est utilisé par la ou les balances du réseau local du magasin. Cette application est facultative et le fichiers articles.csv peut être édité / géré par MS-Excel ou LibreOffice Calc.
- une application **Balance** qui tourne sur un PC gérant une balance et une imprimante d'étiquette (plusieurs PCs "balance" peuvent co-exister sur le LAN). Une application Balance lit le fichier ci-dessus et permet de récupérer le poids d'un produit pesé et d'en faire imprimer l'étiquette auto-collante qui sera scannée en caisse.

Usuellement le PC de gestion a un rôle de serveur de fichiers sur le LAN du magasin mais il est aussi complètement possible que chaque PC gérant une balance ait une copie de ce fichier localement et ne dépende en rien du LAN.

## Plateformes
Les plateformes supportées sont en architecture x64 sous win32 et linux.  
Il est toutefois possible d'effectuer d'autres builds pour d'autres plateformes / architectures.

## Frameworks utilisés
Les applications Articles et Balance sont open-source (sous n'importe quelle license GNU, GPL, MIT, Mozilla ... qui vous convient).

Elles utilisent les socles suivants :
- Node
- Electron
- Vue
- Quasar

Le langage est du Javascript ES6 et du CSS (SASS).

En pratique 95% du code est du Quasar, les couches inférieures sont quasiment invisibles, sachant que Quasar c'est du Vue et que les concepts de Vue sont indispensables à connaître.  
Quelques packages de Node sont employées (fs path ...).

Ce sont de *petites* applications : 1500 lignes de code pour Balance (pseudo HTML/CSS inclus).

## Remerciements et contact
Ce système de pesée est directement inspiré de celui de La Cagette (Montpellier) qui a été aimablement communiqué et commenté par Michel BiBikoff.  

Les deux systèmes sont totalement compatibles, voire dans un même magasin :
- même fichier articles.csv, même syntaxe et signification,
- même balance,
- même imprimante d'étiquette (en fait toute imprimante interprétant LE standard du marché ZPL).

## Documentation
Elle figure dans le répertoire doc et comporte :
- quelques fichiers d'exemple, configuration icône / image, .desktop pour Linux ...
- Des manuels en .docx / PDF :
    - Manuel d'Utilisation
    - Manuel d'Installation
    - Manuel de Développement avec quelques informations pour cloner les git de développement et modifier / compléter les applications sans avoir à trop chercher dans tout le code.
