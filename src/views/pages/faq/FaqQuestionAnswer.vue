<template>
  <div v-if="options" class="mb-3">
    <div class="mt-3 d-flex align-items-center justify-content-between">
      <div>
        <h4 class="mb-0">
          {{ $t('faq.questions') }}
        </h4>
      </div>
      <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="mr-1"
          @click="$emit('add')"
      >
        {{ $t('faq.addNewQuestion') }}
      </b-button>
    </div>
    <!-- collapse -->
    <app-collapse
      id="faq-payment-qna"
      accordion
      type="margin"
      class="mt-2"
    >

      <app-collapse-item
        v-for="( data,index) in options"
        :key="index"
        :title="data.question"
      >
        <div class="d-flex justify-content-between">
          {{ data.answer }}
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1 btn-icon"
              @click="$emit('edit', data)"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
        </div>
      </app-collapse-item>

    </app-collapse>
    <!--/ collapse -->
  </div>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    AppCollapseItem,
    AppCollapse,
    BButton
  },
  directives: {
    Ripple,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
