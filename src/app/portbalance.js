/*
Pour demander le poids courant envoyer: STX(2) $ ETX(3)
On reçoit: STX(2) !  space space space 0 . 1 7 6 CR(13) ETX(3)
Si poids 0, on a ) au lieu de !
*/

import { remote } from 'electron'

// Le require de serialport DOIT être fait dans le process principal
const SerialPort = remote.require('serialport')
const Delimiter = remote.require('@serialport/parser-delimiter')

const delaiDemandePoids = 500 // en ms.
const delaiDetectionOff = 1000 //
const delaiRelanceEcoute = 3000
const options = { lock: false, baudRate: 9600, autoOpen: false }
const delimiteurFin = '\r\x03'
const requetePoids = '$'

function u8ToStr (myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr)
}

function ch(c) {
    if (c === 2) return '\\s'
    if (c === 3) return '\\e'
    if (c === 13) return '\\r'
    if (c === 32) return '^'
    return String.fromCharCode(c)
}

function toDec (str) {
    const v = []
    for (let n = 0, l = str.length; n < l; n++) {
        v.push(ch(str.charCodeAt(n)))
    }
    return v.join(' ')
}

function _flush(p, b) {
    return new Promise((resolve, reject) => {
            p.flush(e1 => {
            if (e1) {
                const err = 'Fermeture impossible (flush) de ' + b + ' : ' + e1.message
                console.log(err)
                reject()
            } else {
                resolve()
            }
        })
    })
}

function _close(p, b) {
    return new Promise((resolve, reject) => {
            p.close(e1 => {
            if (e1) {
                const err = 'Fermeture impossible (flush) de ' + b + ' : ' + e1.message
                console.log(err)
                reject()
            } else {
                resolve()
            }
        })
    })
}

export class Balance {
    /*
    callback : invoqué sur changement d'état quand le port est écouté
        arg1 : écoute (true / false)
        arg2 : err : null si ok
        arg3 : nouveau poids en grammes
    */

    constructor (nom, cb) {
        this.callback = cb
        this.nomBalance = nom
        this.poids = 0
        this.port = null
        this.timer = null
        this.ecoute = true
    }

    _demandePoids () { // PRIVATE
        /*
        Texte à envoyer à la balance: $
        Data reçue en réponse : STX 41 32 32 32 48 46 48 48 48 CR ETX
        */
        if (!this.timer) {
            this.timer = setTimeout(() => {
                this._erreur(Error('La balance ' + this.nomBalance + ' ne répond plus'))
            }, delaiDetectionOff)
        }
        // console.log('Demamde poids')
        this.port.write(requetePoids, err => {
            if (err) {
                this._erreur(err)
            }
        })
    }

    async _close () { // PRIVATE
        if (!this.port || !this.port.isOpen) return
        try {
            await _flush(this.port, this.nomBalance)
            await _close(this.port, this.nomBalance)
        } catch (e) { }
    }

    async _erreur (err) { // PRIVATE
        if (!err || !err.message) {
            err = Error('inconnu')
        }
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        const erreur = 'Erreur sur ' + this.nomBalance + ' : ' + err.message
        console.log(erreur)
        if (this.callback) {
            this.callback(this.ecoute, erreur)
        }
        await this._close()
        if (this.ecoute) {
            setTimeout(async () => {
                if (this.ecoute) {
                    console.log('Tentative de reconnexion de ' + this.nomBalance)
                    await this.debutEcoute()
                }
            }, delaiRelanceEcoute)
        }
    }

    clearTimer () {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

    async debutEcoute () {
        this.poids = -1
        this.ecoute = true
        this.clearTimer()
        await this._close()
        this.port = new SerialPort(this.nomBalance, options)
        this.parser = this.port.pipe(new Delimiter({ delimiter: delimiteurFin }))
        this.port.on('error', (err) => { this._erreur(err) })
        this.parser.on('data', (data) => { this._onData(data) })
        // this.port.on('data', (data) => { this._onData(data) })
        this.port.open(err => {
            if (err) {
                this._erreur(err)
            } else {
                console.log('Port ' + this.nomBalance + ': ouvert')
                this._demandePoids()
            }
        })
    }

    _onData (data) {
        this.clearTimer()
        const s = u8ToStr(data)
        // console.log('<' + toDec(s) + '>')
        const p = Number.parseFloat(s.substring(2)) * 1000
        if (!isNaN(p)) {
            if (p !== this.poids) {
                this.poids = p
                // console.log('< ' + p + ' >')
                this.callback(this.ecoute, null, this.poids)
            }
        } else {
            console.log('Port ' + this.nomBalance + ': poids <' + toDec(s) + '>')
        }
        setTimeout(() => {
            if (this.ecoute) {
                this._demandePoids()
            }
        }, delaiDemandePoids)
    }

    async finEcoute () {
        this.clearTimer()
        this.ecoute = false
        this.callback(false)
        await this._close()
    }
}
