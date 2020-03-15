<template>
    <div class="pave column items-center">
        <div class="col poids">{{ '' + poids + (!unites ? 'g' : (poids > 1 ? ' pièces' : ' pièce'))}}</div>
        <div class="col row items-center">
            <div class="chiffre shadow-5" @click="clic(1)">1</div>
            <div class="chiffre shadow-5" @click="clic(2)">2</div>
            <div class="chiffre shadow-5" @click="clic(3)">3</div>
        </div>
        <div class="col row items-center">
            <div class="chiffre shadow-5" @click="clic(4)">4</div>
            <div class="chiffre shadow-5" @click="clic(5)">5</div>
            <div class="chiffre shadow-5" @click="clic(6)">6</div>
        </div>
        <div class="col row items-center">
            <div class="chiffre shadow-5" @click="clic(7)">7</div>
            <div class="chiffre shadow-5" @click="clic(8)">8</div>
            <div class="chiffre shadow-5" @click="clic(9)">9</div>
        </div>
        <div class="col row items-center">
            <div class="chiffre eff" @click="clic('bs')">Eff.</div>
            <div class="chiffre shadow-5" @click="clic(0)">0</div>
            <div class="chiffre ok" @click="clic('ok')">OK</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PaveNumerique',
  props: ['valeur', 'unites'],
  data () {
    return {
        poids: this.valeur
    }
  },
  methods: {
      clic(n) {
        if (n === 'ok') {
            this.$emit('saisie-ok', this.poids)
            return
        }
        if (n === 'bs') {
            this.poids = Math.floor(this.poids / 10)
            return
        }
        let max = this.unites ? 10 : 10000
        if (this.poids < max) {
            this.poids = (this.poids * 10) + n
        }
      }
  }
}
</script>

<style lang="sass">
@import '../css/app.sass'
$largeWidth: 16rem
$veryLargeFontSize: 3.5rem;

.pave
    padding: 0.2rem
    background-color: white

.poids
    margin: 1rem
    font-size: $veryLargeFontSize
    font-weight: bold
    border-radius: 0.5rem
    border-width: 0.2rem
    border-color: $grey-6
    border-style: solid
    background-color: white
    width: $largeWidth
    height: 1.5 * $veryLargeFontSize
    text-align: center

.chiffre
    font-size: $veryLargeFontSize
    border-radius: 1rem
    background-color: $vertprofond
    width: 1.5 * $veryLargeFontSize
    height: 1.5 * $veryLargeFontSize
    text-align: center
    color: white
    font-style: normal
    margin: 1rem
    cursor: pointer

.ok
    background-color: $rougeprofond

.eff
    background-color: $grey-3
    color: $rougeprofond

</style>
