# Système de pesée de Coquelicoop

Le système de pesée comporte deux applications stand-alone :

- une application **Produits*** qui tourne su PC de gestion du réseau local et qui gère un ficier articles.csv qui est utilisé par la ou les balances du réseau local du magasin. Cette application est facultative et le fichiers articles.csv peut être édité / géré par MS-Excel ou LibreOffice Calc.
- une application **Balance** qui tourne sur un PC gérant une balance et une imprimante d'étiquette (plusieurs PCs "balance" peuvent co-exister sur le LAN). Une application Balance lit le fichier ci-dessus et permet de récupérer le poids d'un produit pesé et d'en faire imprimer l'étiquette auto-collante qui sera scannée en caisse.
- une application **importOdoo** qui récupère le fichier des articles depuis Odoo. Il peut :
    - soit ne pas être utilisé : l'application **Produits** dispose d'un bouton pour effectuer cet import à la demade et
    surtout permettre d'en vérifier / modifier les articles ;
    - soit être lancée à l'initialisation du PC serveur, voire être mis dans un cron pour une demande périodique.
    - c'est un choix de gestion du magasin : faut-il ou non répercuter au plus tôt les mises à jour centrales des articles ou au contraire n'effectuerr celà qu'une fois en début de journée (ou sur demande).

Usuellement le PC de gestion a un rôle de serveur de fichiers sur le LAN du magasin mais il est aussi complètement possible que chaque PC gérant une balance ait une copie de ce fichier localement et ne dépende en rien du LAN.

## Plateformes
Les plateformes supportées sont en architecture x64 sous win32 et linux.  
Il est toutefois possible d'effectuer d'autres builds pour d'autres plateformes / architectures.

## Frameworks utilisés
Les applications Produits, importOdoo et Balance sont open-source (sous n'importe quelle license GNU, GPL, MIT, Mozilla ... qui vous convient).

Elles utilisent les socles suivants :
- Node (importOdoo n'utilise que Node)
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

Contact : contact@coquelicoop.fr

## Documentation et distribution
Demander l'URL à contact@coquelicoop.fr

La distribution comporte :
- les fichiers .zip (pour win32 x64) et .tgz (pour Linux x64) à décompresser : les exécutables y figurent.
- la documentation :
    - quelques fichiers d'exemple, configuration icône / image, .desktop pour Linux ...
    - Des manuels en .docx / PDF :
        - Manuel d'Utilisation
        - Manuel d'Installation
        - Manuel de Développement avec quelques informations pour cloner les git de développement et modifier / compléter les applications sans avoir à trop chercher dans tout le code.
