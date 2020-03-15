<template>
  <q-layout id="q-app" view="hHh lpR fFf" class="bg-grey-10">
    <q-header class="text-black bg-grey-2">
      <div class="column">
        <div class="col-auto row q-py-md">
          <q-btn :size="standardBtnSize" flat round @click="coordo = true" icon="menu" aria-label="Menu coordo"/>
          <div :class="'col row items-center justify-start av-gbtn' + (ecouteBalance ? '2' : ' shadow-5')" v-ripple @click="saisieP()">
            <div :class="'col av-label' + (ecouteBalance ? '2' : '')">Poids brut</div>
            <div class="col-auto column items-center justify-between">
              <div :class="'av-poids' + (ecouteBalance ? '2' : '')">{{format(poidsBalance)}}</div>
              <div v-if="ecouteBalance || poidsBalance == 0" class="av-box1 self-center"></div>
              <q-btn v-else class="av-box2" size="1rem" color="deep-orange" label="Effacer" @click.stop="poidsBalance = 0"/>
            </div>
          </div>
          <div class="col row items-center justify-start av-gbtn shadow-5" v-ripple @click="saisieC()">
            <div class="col-auto column items-center justify-between">
              <div class="av-poids">{{format(poidsContenant)}}</div>
              <div v-if="poidsContenant == 0" class="av-box1 self-center"></div>
              <q-btn v-else class="av-box2" size="1rem" color="deep-orange" label="Effacer" @click.stop="poidsContenant = 0"/>
            </div>
            <div class="col av-label">Contenant</div>
          </div>
        </div>

        <div class="col-auto row justify-between items-start">
          <div class="col column">
            <div class="col-auto row items-center justify-around av-lettres">
              <div class="av-lettre" v-for="lettre in alphabet1" v-bind:key="lettre" @click="choixLettre(lettre)">
                <span class="av-lettre2" v-ripple >{{lettre}}</span>
              </div>
            </div>
            <div class="col-auto row items-center justify-around label1">
              <div class="av-lettre" v-for="lettre in alphabet2" v-bind:key="lettre" @click="choixLettre(lettre)">
                <span class="av-lettre2" v-ripple >{{lettre}}</span>
              </div>
            </div>
          </div>
          <div class="col-auto column items-center justify-between av-codeCourt1">
            <div class="av-codeCourt"><span class="av-lettre2">{{codeCourt}}</span></div>
            <div v-if="codeCourt === ''" class="av-box1"></div>
            <q-btn v-else class="av-box2" size="1rem" color="deep-orange" label="Effacer" @click.stop="effaceCode()"/>
          </div>
        </div>

      </div>
    </q-header>

    <q-drawer v-model="panneauGauche" overlay :width="400" bordered content-class="bg-grey-1">
      <div class="absolute" style="top:0;right:-2rem">
        <q-btn v-if="panneauGauche" :size="standardBtnSize" dense round unelevated color="accent" icon="chevron_left" @click="panneauGauche = false"/>
      </div>
      <q-list>
        <q-item clickable v-ripple @click="panneauGauche = false" class="column">
          <div class="col-auto text-h6 bold">Version de l'application : {{ version }}</div>
          <div v-if="this.articles.length == 0" class="col-auto">Pas d'article</div>
          <div v-else class="col-auto">{{this.articles.length}} articles</div>
          <div v-if="!ecouteBalance" class="col-auto text-negative">Balance déconnectée, saisie manuelle du poids</div>
          <div v-if="ecouteBalance && erreurBalance" class="col-auto text-negative">{{erreurBalance}}<br>
            <span class="text-deep-orange-8 text-bold">Tenter de reconnecter après avoir vérifier les branchements et que la balance est allumée</span>
          </div>
        </q-item>
        <q-separator />
        <q-item v-if="!enserie" clickable v-ripple @click="enserie = true;panneauGauche = false">
          <q-item-section avatar><q-icon class="menuButton" :name="'reorder'"/></q-item-section>
          <q-item-section class="menuText">Impression en série</q-item-section>
        </q-item>
        <q-item v-else clickable v-ripple @click="finSerie();panneauGauche = false">
          <q-item-section avatar><q-icon class="menuButton" :name="'pause'"/></q-item-section>
          <q-item-section class="menuText">Fin du mode impression en série</q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="!ecouteBalance" clickable v-ripple @click="reconnecterBalance();panneauGauche = false">
          <q-item-section avatar><q-icon class="menuButton" :name="'check'"/></q-item-section>
          <q-item-section class="menuText">Reconnecter la balance</q-item-section>
        </q-item>
        <q-item v-else clickable v-ripple @click="deconnecterBalance();panneauGauche = false">
          <q-item-section avatar><q-icon class="menuButton" :name="'close'"/></q-item-section>
          <q-item-section class="menuText">Deconnecter la balance</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="negative" v-ripple @click="exitApp = true">
          <q-item-section avatar><q-icon class="menuButton" :name="'exit_to_app'"/></q-item-section>
          <q-item-section class="menuText">Quitter l'application</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="av-container">
      <div v-if="poidsBalance === 0" class="av-msg  shadow-5">{{ m1 }}</div>
      <div v-if="poidsBalance !== 0 && poidsContenant === 0 && codeCourt.length === 0" class="av-msg shadow-5">{{ m2 }}</div>
      <div v-if="poidsBalance !== 0 && codeCourt.length === 0" class="av-msg shadow-5">{{ m3 }}</div>
      <div v-if="codeCourt.length !== 0 && this.selArticles.length == 0" class="av-msg shadow-5">{{ m4 }}</div>

      <div v-if="this.selArticles.length !== 0" class="row justify-around">
        <carte-article v-for="article in selArticles" :key="article.id" :article="article" @clic-article="clicArticle(article)"></carte-article>
      </div>
    </q-page-container>

    <q-dialog v-model="exitApp" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="exit_to_app" color="negative" text-color="white"/>
          <span class="q-ml-sm dialogText">Voulez-vous vraiment quitter l'application ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn size="2.5rem" class="dialogText" flat label="Non, je la garde active" color="primary" v-close-popup
            @click="exitApp = false; panneauGauche = false"/>
          <q-btn size="2.5rem" class="dialogText" flat label="Oui, je l'arrête" color="negative" v-close-popup
            @click="quit()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alerte">
      <q-card>
        <q-card-section>
          <div class="text-h6">Erreur</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ texteAlerte }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn size="2.5rem" flat label="J'ai lu" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alerteC" persistent>
      <q-card>
        <q-card-section class="q-ml-sm dialogText">
            Le poids du contenant "vide" ne peut pas être supérieur au poids du contenant "rempli"
        </q-card-section>
        <q-card-actions align="right">
          <q-btn size="2.5rem" flat label="J'ai lu" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sanspoids" persistent>
      <q-card>
        <q-card-section class="q-ml-sm dialogText">
            Pas d'article sur la balance, pas détiquette !
        </q-card-section>
        <q-card-actions align="right">
          <q-btn size="2.5rem" flat label="J'ai lu" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="coordo" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm dialogText">Fonctions réservées aux coordonateurs. L'êtes-vous ?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn size="2.5rem" class="dialogText" flat label="Non" color="negative" v-close-popup
            @click="coordo = false"/>
          <q-btn size="2.5rem" class="dialogText" flat label="Oui, je suis coordonateur" color="primary" v-close-popup
            @click="coordo = false;panneauGauche = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="saisiecont" persistent>
      <pave-numerique :valeur="0" @saisie-ok="saisiecontok"></pave-numerique>
    </q-dialog>

    <q-dialog v-model="saisiepoids" persistent>
      <pave-numerique :valeur="0" @saisie-ok="saisiepoidsok"></pave-numerique>
    </q-dialog>

    <q-dialog v-model="saisiepieces" persistent>
      <pave-numerique :valeur="nbpieces" :unites="true" @saisie-ok="saisieunitesok"></pave-numerique>
    </q-dialog>

  </q-layout>
</template>

<script>
const fs = require('fs')
const csv = require('csv-parser')

import { config } from './app/config'
import { formatPoids, removeDiacritics, codeCourtDeId, poidsPiece } from './app/global'
import { Balance } from './app/portbalance'
import { etiquette } from './app/zpl'

const lgn = 32

function decore (data) {
    const n = parseInt(data.id, 10)
    data.codeCourt = codeCourtDeId(n, data.nom)
    if (data.nom.startsWith('[' + data.codeCourt + ']')) data.nom = data.nom.substring(4)
    let [nom2, p] = poidsPiece(data.unite, data.nom)
    data.poidsPiece = p
    data.nom = nom2
    data.bio = data.nom.toUpperCase().indexOf('BIO') !== -1

    data.prixN = parseFloat(data.prix)
    if (Number.isNaN(data.prixN)) { data.prixN = 0 }

    let nom = ['', '']
    let j = 0
    let nx = data.nom.trim().split(' ')
    nx.splice(0, 0, '[' + data.codeCourt + ']')
    for (let i = 0; i < nx.length && j < 2; i++) {
        let m = nx[i]
        if (nom[j].length + m.length + 1 < lgn) {
            if (nom[j].length) {
                nom[j] = nom[j] + ' ' + m
            } else {
                nom[j] = m
            }
        } else {
            j++
            if (j < 2) {
                nom[j] = m
            }
        }
    }
    data.nom1 = nom[0]
    data.nom2 = nom[1]
}

function mtimeArticles () {
    let stats = fs.statSync(config.articles)
    return stats ? stats.mtime.toString() : ''
}

// CSV : id nom code-barre prix unite image
function lectureArticles(cb) {
    let mtime = mtimeArticles()
    if (!mtime) {
        cb(Error('Fichier ' + config.articles + ' inaccessible'))
        return
    }
    const articles = []
    const rs = fs.createReadStream(config.articles)
    rs.on('error', (e) => {
        cb(e.message)
    })
    try {
        rs.pipe(csv({ separator: ';' }))
        .on('data', (data) => {
            decore(data)
            articles.push(data)
        })
        .on('end', () => {
            cb(null, articles, mtime)
        })
        rs.on('error', (e) => {
            cb(e.message)
        })
    } catch (e) {
        cb(e.message)
    }
}

/* eslint-disable no-unused-vars */
import CarteArticle from './components/CarteArticle.vue'
import PaveNumerique from './components/PaveNumerique.vue'

// Time out du clavier numérique. Se ferme et renvoie 0 au delà de ce temps
const toCN = config.timeoutClavierNumerique || 20000

// delai de pooling du changement du fichier articles
const poolingArticles = config.poolingArticles || 10000

// delai maximal de réaction du coordonateur sur son panneau
const toCoordo = config.timeoutCoordo || 10000

export default {
  name: 'App',

  components: { CarteArticle, PaveNumerique },

  mounted() {
    console.log('mounted: ' + config.balance)
    this.detectionArticles(config.articles)
    this.balance = new Balance(config.balance, this.poidsRecu)
    this.reconnecterBalance()
  },

  data () {
    return {
      version: config.version,
      m1: config.message1 || 'Poser les articles sur la balance',
      m2: config.message2 || 'Si les articles sont dans votre "contenant" personnel, appuyer en haut à droite sur "Contenant".\nSi votre contenant n\'a pas été pesé, voir l\'accueil.',
      m3: config.message3 || 'Appuyer sur les deux lettres du code du produit, ou si vous ne les avez pas notées, sur les deux premières lettres de son nom.',
      m4: config.message4 || 'Pas d\'article ayant ce code où commençant par ces lettres.',
      mtime: '',
      largeBtnSize: '2rem',
      standardBtnSize: '1.5rem',
      coordo: false,
      panneauGauche: false,
      saisiecont: false,
      saisiepoids: false,
      saisiepieces: false,
      alerte: false,
      alerteC: false,
      sanspoids: false,
      exitApp: false,
      articles: [],
      selArticles: [],
      texteAlerte: '',
      erreurBalance: '',
      ecouteBalance: false,
      poidsBalance: 0,
      poidsContenant: 0,
      nbpieces: 0,
      codeCourt: '',
      alphabet1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
      alphabet2: ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      t1: null,
      t2: null,
      t3: null,
      enserie: false
    }
  },

  watch: {
    poidsBalance (apres, avant) {
      if (apres === 0 && avant !== 0) { this.raz() }
    },
    coordo (apres, avant) {
      if (apres && !avant) {
        this.t1 = setTimeout(() => {
          this.coordo = false
          if (this.t1) { clearTimeout(this.t1); this.t1 = null }
        }, toCoordo)
      }
    },
    panneauGauche (apres) {
      if (apres) {
        this.t3 = setTimeout(() => { this.panneauGauche = false; this.t3 = null }, toCoordo)
      } else {
        if (this.t3) { clearTimeout(this.t3); this.t3 = null }
      }
    },
    alerteC (apres) {
      if (apres) {
        this.t3 = setTimeout(() => { this.alerteC = false; this.t3 = null }, toCoordo)
      } else {
        if (this.t3) { clearTimeout(this.t3); this.t3 = null }
      }
    },
    alerte (apres) {
      if (apres) {
        this.t3 = setTimeout(() => { this.alerte = false; this.t3 = null }, toCoordo)
      } else {
        if (this.t3) { clearTimeout(this.t3); this.t3 = null }
      }
    },
    exitApp (apres) {
      if (apres) {
        this.t3 = setTimeout(() => { this.exitApp = false; this.t3 = null }, toCoordo)
      } else {
        if (this.t3) { clearTimeout(this.t3); this.t3 = null }
      }
    },
    sanspoids (apres) {
      if (apres) {
        this.t3 = setTimeout(() => { this.sanspoids = false; this.t3 = null }, toCN)
      } else {
        if (this.t3) { clearTimeout(this.t3); this.t3 = null }
      }
    }
},

  methods: {
    quit () {
      config.quit()
    },

    finSerie () {
      this.enserie = false
      this.raz()
    },

    saisieC() {
      this.saisiecont = true
      this.t2 = setTimeout(() => {
        this.saisiecont = false
        this.poidsContenant = 0
        this.t2 = null
      }, toCN)
    },

    saisieP() {
      if (this.ecouteBalance) { return }
      this.saisiepoids = true
      this.t2 = setTimeout(() => {
        this.saisiepoids = false
        this.poidsBalance = 0
        this.t2 = null
      }, toCN)
    },

    saisieN() {
      this.saisiepieces = true
      this.t2 = setTimeout(() => {
        this.saisiepieces = false
        this.nbpieces = 0
        this.t2 = null
      }, toCN)
    },

    detectionArticles(p) {
      if (!this.codeCourt) {
        let mtime = mtimeArticles()
        if (mtime && mtime !== this.mtime) {
          this.chargementArticles()
        }
      }
      setTimeout(() => {
        this.detectionArticles(p)
      }, poolingArticles)
    },

    effaceCode () {
      this.codeCourt = ''
      this.selArticles = []
    },

    raz() {
      this.poidsBalance = 0
      if (!this.enserie) {
        this.poidsContenant = 0
        this.codeCourt = ''
        this.selArticles = []
      }
      this.panneauGauche = false
      this.saisiecont = false
      this.saisiepoids = false
      this.saisiepieces = false
      this.alerte = false
      this.alerteC = false
      this.coordo = false
    },

    demandePoids() {
      this.balance._demandePoids()
    },

    saisiecontok(p) {
      this.saisiecont = false
      if (this.t2) {
        clearTimeout(this.t2)
        this.t2 = null
      }
      if (p !== -1) {
        if (this.poidsBalance && p >= this.poidsBalance) {
          this.alerteC = true
        } else {
          this.poidsContenant = p
        }
      }
    },

    saisiepoidsok(p) {
      this.saisiepoids = false
      if (this.t2) {
        clearTimeout(this.t2)
        this.t2 = null
      }
      if (p !== -1) {
        if (p < this.poidsContenant) {
          this.poidsContenant = 0
          this.alerteC = true
        } else {
          this.poidsBalance = p
        }
      }
    },

    chargementArticles () {
      lectureArticles((err, articles, mtime) => {
        if (!err) {
          this.articles = articles
        } else {
          this.texteAlerte = 'Le fichier des articles est corrompu ou absent\n' + config.articlesPath + '\n' + err
          this.alerte = true
        }
        this.mtime = mtime
        this.raz()
        this.panneauGauche = false
      })
    },

    async deconnecterBalance () {
      this.raz()
      await this.balance.finEcoute()
    },

    async reconnecterBalance () {
      await this.balance.debutEcoute()
    },

    poidsRecu (ecoute, err, poids) {
      this.ecouteBalance = ecoute
      if (err) {
        this.poidsBalance = 0
        this.erreurBalance = err
      } else {
        this.erreurBalance = false
        this.poidsBalance = ecoute ? poids : 0
        if (this.poidsBalance === 0) {
          this.raz()
        }
      }
    },

    format (p) { return formatPoids(p) },

    choixLettre(l) {
      this.codeCourt = this.codeCourt + l
      if (this.codeCourt.length === 3) {
        this.codeCourt = this.codeCourt.substring(1)
      }
      this.filtre()
    },

    filtre() {
      this.selArticles = []
      if (this.codeCourt.length === 0) {
        return
      }
      if (this.codeCourt.length === 1) {
        for (let i = 0; i < this.articles.length; i++) {
          let art = this.articles[i]
          let nx = removeDiacritics(art.nom.substring(0, 1).toUpperCase())
          if (nx === this.codeCourt) { this.selArticles.push(art) }
        }
        return
      }
      for (let i = 0; i < this.articles.length; i++) {
        let art = this.articles[i]
        if (art.codeCourt === this.codeCourt) {
          this.selArticles.push(art)
        } else {
          let nx = removeDiacritics(art.nom.substring(0, 2).toUpperCase())
          if (this.codeCourt === nx) { this.selArticles.push(art) }
        }
      }
    },

    clicArticle(article) {
      let c1 = article.codeCourt.charAt(0)
      if (this.enserie && c1 < 'W') {
        /*
        Pour étiquettage en série on ne garde en sélection qu'un seul article
        SAUF si c'est un article de code explicite qui commence W X Y Z
        Dans ce cas on garde la liste : ça va être par exemple les différents morceaux de boucherie à la livraison
        */
        this.selArticles = [article]
      }
      if (this.poidsBalance === 0) {
        if (article.poidsPiece === -1 || (article.poidsPiece !== -1 && !this.enserie)) {
          this.sanspoids = true
          return
        }
      }
      if (article.poidsPiece === -1) {
        this.imprimer(article, this.poidsBalance, this.poidsContenant)
      } else {
        if (!this.enserie) {
          this.articleCourant = article
          this.nbpieces = article.poidsPiece > 0 ? Math.round(this.poidsBalance / article.poidsPiece) : 0
          this.saisiepieces = true
        } else {
          this.imprimer(article, 1)
        }
      }
    },

    saisieunitesok(nb) {
      this.saisiepieces = false
      if (this.t2) {
        clearTimeout(this.t2)
        this.t2 = null
      }
      if (nb > 0) {
        this.imprimer(this.articleCourant, nb)
      } else {
        this.raz()
      }
    },

    async imprimer(article, poidsB, poidsC) {
      this.raz()
      try {
        // let e =
        let err = await etiquette(this.ecouteBalance, article, poidsB, poidsC)
        if (err) {
          console.log('ERR : ' + err)
        }
        // console.log(e)
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}
</script>

<style lang="sass">
@import './css/app.sass'
$largeWidth: 16rem
$standardWidth: 10rem


.souligne
  text-decoration: underline

.menuText
  font-size: $largeFontSize

.menuButton
  font-size: 2rem !important

.negative
  color: $negative

.dialogText
  font-size: $largeFontSize !important

$av-poidsfs: 2.8rem
$av-poidsh: 1.1 * $av-poidsfs

.av-poids
  font-size: $av-poidsfs
  text-align: center
  color: white
  font-weight: bold
  line-height: $av-poidsh
  height: $av-poidsh
  width: 13rem
  overflow: hidden

.av-poids2
  font-size: $av-poidsfs
  text-align: center
  color: black
  font-weight: bold
  line-height: $av-poidsh
  height: $av-poidsh
  width: 13rem
  overflow: hidden

$av-labelfs: 3rem
$av-labelh: 1.1 * $av-labelfs

.av-label
  font-size: $av-labelfs
  text-align: center
  color: $vertleger
  line-height: $av-labelh
  height: $av-labelh
  overflow: hidden

.av-label2
  font-size: $av-labelfs
  text-align: center
  color: black
  line-height: $av-labelh
  height: $av-labelh
  overflow: hidden

.av-gbtn
  background-color: $vertprofond
  color: white
  padding: 0.5rem
  margin: 0.5rem
  border-radius: 0.5rem
  border: 0.2rem solid $vertprofond
  cursor: pointer

.av-gbtn2
  color: black
  padding: 0.5rem
  margin: 0.5rem
  border-radius: 0.5rem
  border: 0.2rem solid transparent

.av-box1
  width: 6rem
  height: 2.5rem

.av-box2
  position: relative
  z-index: 2
  height: 2.5rem

.av-lettres
  margin: 0.2rem

$av-lettrefs: 3.5rem;

.av-lettre
  font-size: $av-lettrefs
  border-radius: 1rem
  background-color: $vertprofond
  width: 1 * $av-lettrefs
  height: 1.2 * $av-lettrefs
  text-align: center
  color: white
  font-style: normal
  cursor: pointer

.av-lettre2
  position: relative
  top: -0.2 * $av-lettrefs

.av-codeCourt
  font-size: $av-lettrefs
  background-color: $grey-4
  width: 1.8 * $av-lettrefs !important
  height: 1.2 * $av-lettrefs
  text-align: left
  color: black
  font-style: normal

.av-codeCourt1
  height: 9.5rem
  width: 8rem !important
  padding: 0.5rem

.av-container
  padding: 0.5rem
  color: $grey-1
  text-align: center

.av-msg
  margin: 2rem
  font-size: 2.5rem
  font-style: italic
  border-radius: 1rem
  background-color: $grey-8
  padding: 1rem

</style>
