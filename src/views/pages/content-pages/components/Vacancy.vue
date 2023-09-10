<template>
  <div>
    <!--    {{vacancy}}-->
    <app-collapse-item
        :title="vacancy.title"
    >
      <div>
        <div class="d-flex justify-content-between align-items-start">
          <h6>
            <small class="text-muted">
              {{ formatDate(vacancy.validFrom) + ' - ' + formatDate(vacancy.validTill) }}
            </small>
          </h6>
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1 btn-icon"
              @click="$emit('edit', vacancy)"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
        </div>

        <div v-html="vacancy.description"/>

      </div>
    </app-collapse-item>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BButton,
} from 'bootstrap-vue'
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem";
import Ripple from "vue-ripple-directive";

export default {
  name: "Vacancy",
  components: {AppCollapseItem, BButton},
  directives: {
    Ripple,
  },
  props: {
    vacancy: {
      type: Object,
      default: () => {
      },
    },
  },

  methods: {
    formatDate(date) {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
      let mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
      let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
      return `${da}/${mo}/${ye}`;
    }
  }
}
</script>

<style scoped>

</style>
