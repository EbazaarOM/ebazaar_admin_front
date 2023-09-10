<template>
  <b-card class="text-center p-0">
    <b-avatar
        class="mb-1"
        size="45"
        :src="staticEnvValue + '/' + feature.image">
    </b-avatar>
    <div class="truncate">
      <p class="m-0">
        {{ feature.title }}
      </p>
      <p class="m=0">
        <small v-html="feature.description.slice(0, 100)"/>
        <small v-if="feature.description.length > 100">...</small>
      </p>
    </div>
    <hr>
    <div class="d-flex justify-content-center align-items-center">
      <b-button
          @click="$emit('update', feature.id)"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="btn-icon m-0 mr-1"
      >
        <feather-icon icon="EditIcon"/>
      </b-button>
      <b-button
          @click="$emit('delete', feature.id)"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="danger"
          size="sm"
          class="btn-icon m-0"
      >
        <feather-icon icon="DeleteIcon"/>
      </b-button>
    </div>
  </b-card>
</template>

<script>
/* eslint-disable */
import {BCard, BAvatar, BButton} from 'bootstrap-vue'
import FeatureModal from "@/views/pages/content-pages/components/FeatureModal";
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    FeatureModal,
    BCard,
    BAvatar,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      staticEnvValue: ''
    }
  },

  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },

  setup() {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)

    // UnRegister on leave
    // onUnmounted(() => {
    //   if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    // });
  },
}
</script>
