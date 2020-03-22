/*
Génération du texte de l'étiquette en langage ZPL
*/

import { config } from './config'
import { formatPoids, editEAN } from './global'
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')

/*
Le template ZPL peut être donné dans la configuration à la place de celui par défaut :
La marge m est donnée à part dans marge (210 par défaut) pour centrer plus facilement
le texte sur l'étiquette selon sa largeur.

^CI28
^CF0,0,30
^FO${m + 10},15,0^FD${article.nom1}^FS
^FO${m + 10},45,0^FD${article.nom2}^FS
^CF0,0,20
^FO${m + 10},85,0^FDPrix est.^FS
^FO${m + 120},85,0^FD${type}^FS
^CF0,0,28
^FO${m + 10},105,0^FD${prix}€^FS
^FO${m + 120},105,0^FD${poidsTare}^FS
^CF0,0,20
^FO${m + 10},135,0^FDPesé le : ${date}^FS
^FO${m + 65},160^BY3,2,100^BEN,100,Y,N^FD${ean}^FS
^XZ

*/
// eslint-disable-next-line no-template-curly-in-string
const templateDefaut = '^XA\n^CI28\n^CF0,0,30\n^FO${m + 10},15,0^FD${article.nom1}^FS\n^FO${m + 10},45,0^FD${article.nom2}^FS\n^CF0,0,20\n^FO${m + 10},85,0^FDPrix est.^FS\n^FO${m + 100},85,0^FD${type}^FS\n^FO${m + 290},85,0^FDPesé le^FS\n^CF0,0,28\n^FO${m + 10},105,0^FD${prix}€^FS\n^FO${m + 100},105,0^FD${poidsTare}^FS\n^FO${m + 290},105,0^FD${date}^FS\n^FO${m + 85},150^BY3,2,100^BEN,100,Y,N^FD${ean}^FS\n^XZ\n'
// eslint-disable-next-line no-unused-vars
const template = config.zpl || templateDefaut

// Ecriture de data dans un fichier : étiquette à imprimer
async function ecrire(p, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(p, data, 'utf-8', err => {
            if (!err) {
                resolve()
            } else {
                reject(err)
            }
        })
    })
}

/*
Imprimer consiste en deux commandes différentes en Windows et Linux
En Windows : il faut copier le fichier sur le nom de partage sur localhost de l'imprimante
ayant été installée avec le driver texte simple standard générique
En Linux : c'est le lpr -l -P du fichier
Dans les deux cas le fichier a été écrit auparavant sous un path générique dans le répertoire de travail
En test le fichier est recopié en tmp. C'est inutile, juste pour tester qu'on sait soumettre une commande.
Retourne null si OK, sinon stderr.
*/
async function print(p, impr) {
    let cmd
    if (process.platform === 'win32') {
        if (impr) {
            cmd = `COPY "${p}" "\\\\localhost\\${impr}"`
        } else {
            // pour tester en l'absence d'imprimante
            cmd = `COPY "${p}" "C:\\tmp\\etiquette.txt"`
        }
    } else if (process.platform === 'linux') {
        if (impr) {
            cmd = `lpr -l -P "${impr}" "${p}"`
        } else {
            // pour tester en l'absence d'imprimante
            cmd = `cp "${p}" "/tmp/etiquette.txt"`
        }
    } else {
        throw Error('platform non supportée')
    }
    const { stdout, stderr } = await exec(cmd)
    if (stderr) {
        console.log('stdout:', stdout)
        console.log('stderr:', stderr)
        return stderr
    } else { return null }
}

const options = { year: '2-digit', month: '2-digit', day: '2-digit' }
/*
Demande d'impression d'une étiquette
pese : true si le poids est pesé, sinon saisi
article : l'article lui-même
poidsB : c'est soit le poids, soit le nombre de pièces
poidsC : poids du contenant
Le rouleau de papier est centré au milieuu de l'imprimante :
si on écrit depuis 0 en x, on va écrire hors du rouleau à gauche dès qu'il n'a pas la taille maximale.
La "marge à gauche" est laissée paramétrable pour s'adapter à la largeur exacte du papier
voire des imprimantes. 220 paraît une bonne approximation pour être centré
*/
export async function etiquette(pese, article, poidsB, poidsC) {
    // eslint-disable-next-line no-unused-vars
    let type, prix, poidsTare, date, ean, m
    m = config.marge || 220

    let net = poidsC ? poidsB - poidsC : poidsB

    if (article.poidsPiece === -1) {
        type = pese ? 'Poids Net+Tare' : 'Poids SAISI+Tare'
        poidsTare = formatPoids(net) + (poidsC ? '+' + formatPoids(poidsC) : '')
    } else {
        type = 'Nombre de pièces'
        poidsTare = '' + poidsB
    }
    if (!article.prixN) {
        prix = '?'
    } else {
        if (article.poidsPiece === -1) {
            prix = ('' + Math.round(article.prixN * net / 10) / 100).replace('.', ',')
        } else {
            prix = ('' + (article.prixN * net)).replace('.', ',')
        }
    }
    date = new Date().toLocaleDateString('fr-FR', options).replace(/\./g, '/')
    ean = editEAN(article['code-barre'], net)
    // texte de l'étiquette en ZPL : format 50mm x 40mmm
    // eslint-disable-next-line no-eval
    let etiq = eval('`' + template + '`')
    // path du fichier à impimer
    let p = path.join(config.dir, 'etiquette.zpl')
    // écriture du texte en ZPL sur ce fichier
    await ecrire(p, etiq)
    // envoi à l'imprimante selon l'OS
    return print(p, config.imprimante)
}
