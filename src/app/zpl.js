/*
Génération du texte de l'étiquette en langage ZPL
*/

import { config } from './config'
import { formatPoids, editEAN } from './global'
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')

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
    // await exec(cmd)
    const { stdout, stderr } = await exec(cmd)
    if (stderr) {
        console.log('stdout:', stdout)
        console.log('stderr:', stderr)
        return stderr
    } else { return null }
}

const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
/*
pese : true si le poids est pesé, sinon saisi
poidsB : c'est soit le poids, soit le nombre de pièces
*/
export async function etiquette(pese, article, poidsB, poidsC) {
    let type, prix, poidsTare, date, ean
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
    const m = config.marge

    let etiq = `^XA
^CI28
^CF0,0,30
^FO${m + 10},15,0^FD${article.nom1}^FS
^FO${m + 10},45,0^FD${article.nom2}^FS
^CF0,0,20
^FO${m + 10},85,0^FDPrix est.^FS
^FO${m + 100},85,0^FD${type}^FS
^FO${m + 290},85,0^FDPesé le^FS
^CF0,0,28
^FO${m + 10},105,0^FD${prix}€^FS
^FO${m + 100},105,0^FD${poidsTare}^FS
^FO${m + 290},105,0^FD${date}^FS
^FO${m + 85},150^BY3,2,100^BEN,100,Y,N^FD${ean}^FS
^XZ
`
    let p = path.join(config.dir, 'etiquette.zpl')
    await ecrire(p, etiq)
    return print(p, config.imprimante)
}
