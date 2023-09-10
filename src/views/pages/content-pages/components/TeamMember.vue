<template>
  <b-col
      md="6"
      lg="4"
  >
    <b-card
        :img-src="staticEnvValue + `/` + teamMember.image"
        img-alt="Card image cap"
        img-top
        :title="teamMember.firstName + ' ' + teamMember.lastName"
    >

      <b-card-text>
        {{ teamMember.position }}
      </b-card-text>
      <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-primary"
          @click="$emit('edit', teamMember)"
      >
        {{ $t('global.seeMore') }}
      </b-button>
    </b-card>
  </b-col>
</template>

<script>
import {
  BCard, BCardText, BButton, BCol
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    BCardText,
    BButton,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: ['teamMember'],
  data() {
    return {
      staticEnvValue: ''
    }
  },
  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  }
}
</script>
