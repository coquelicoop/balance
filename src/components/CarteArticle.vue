<template>
  <div class="carteArticle shadow-5 row items-center" @click="$emit('clic-article')">
    <div class="col-4"><img class="image" :src="'data:image/jpeg;base64,' + article.image"></div>
    <div class="col-8 droite column">
      <div class="col row justify-around items-start haut">
        <div class="col codecourt"><span class="codecourt2">{{ article.codeCourt }}</span></div>
        <div class="col prix" v-if="article.poidsPiece === -1">{{ article.prix }}€ le Kg</div>
        <div class="col prix" v-else>{{ article.prix }}€ piéce</div>
        <div v-if="article.bio" class="col"><img class="iconeAB" src="../assets/logoAB.jpg"></div>
      </div>
      <div class="col nomproduit">{{ article.nom }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarteArticle',
  props: ['article'],
  data () {
    return {
    }
  }
}
</script>

<style lang="sass">
@import '../css/app.sass'
$largeur: 15rem;

/* hauteur de l''image à gauche
$hauteuri: $largeur * 4 / 12;

/* hauteur de la carte
$hauteurc: $hauteuri * 1.5;

/* hauteur droite-haut
$hauteurdh: 2.5rem

/* hauteur nom produit
$hauteurp: $hauteurc - $hauteurdh

/* font-size nom du produit
$fsnp: $hauteurp / 3

.carteArticle
  color: black
  width: $largeur
  height: $hauteurc
  margin: 0.2rem
  padding: 0
  border-radius: 0.5rem
  background-color: white
  cursor: pointer
  overflow: hidden

.image
  border-radius: 0.5rem
  width: $hauteuri
  height: $hauteuri
  margin: 0.1rem

.droite
  height: $hauteurc !important
  padding: 0.3rem
  overflow: hidden

.haut
  max-height: $hauteurdh !important

.codecourt
  font-size: $hauteurdh - 0.2rem
  line-height: $hauteurdh - 0.2rem
  font-weight: bold
  padding-right: 0.8rem
  max-height: $hauteurdh !important
  overflow: hidden
  color: red

.codecourt2
  position: relative
  top: -0.3rem

.prix
  font-size: 0.7rem
  line-height: 0.7rem
  text-align: center
  max-height: $hauteurdh !important
  overflow: hidden

.iconeAB
  width: 1.5rem
  height: 1.5rem

.nomproduit
  text-align: center
  font-size: $fsnp
  line-height: $fsnp
  font-weight: bold
  margin-top: -0.3rem
  max-width: $largeur - $hauteuri

</style>
