<template>
  <div class="mt-2 mb-2">
    <b-row class="mb-3 align-items-center justify-content-between">
      <b-col cols="6">
        <h3 class="m-0 p-0">{{ $t('advantages.title') }}</h3>
      </b-col>
      <b-col
          cols="6"
          class="d-flex justify-content-end"
      >
        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="openAddFeatureModal"
        >
          {{ $t('advantages.add') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-for="feature in features"
             :key="feature.id"
             md="4"
             sm="6">
        <feature
            :feature="feature"
            @update="openEditFeatureModal"
            @delete="confirmDelete"
        />
      </b-col>
    </b-row>

    <feature-modal :is-add-feature-modal-active.sync="modalVisible" :is-editing="isEditing"
                   :feature="modalFeature" @add="addFeature" @update="updateFeature" @delete="deleteFeature"/>
  </div>
</template>

<script>
/* eslint-disable */
import {BCol, BRow, BButton} from 'bootstrap-vue'
import Feature from "@/views/pages/content-pages/components/Feature";
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import FeatureModal from "@/views/pages/content-pages/components/FeatureModal";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import Ripple from "vue-ripple-directive";

export default {
  name: "Features",
  components: {FeatureModal, Feature, BCol, BRow, BButton},
  directives: {
    Ripple,
  },
  data() {
    return {
      features: [],
      modalFeature: {},
      modalVisible: false,
      isEditing: false,
    }
  },
  created() {
    this.fetchFeatures();
  },
  methods: {
    fetchFeatures() {
      store.dispatch('app-content/fetchFeatures')
          .then((response) => {
            this.features = response.data.data
          })
    },
    fetchFeature(payload) {
      return store.dispatch('app-content/fetchFeatures', payload)
          .then((response) => {
            this.modalFeature = response.data
          })
    },
    openEditFeatureModal(feature_id) {
      this.fetchFeature({id: feature_id}).then(() => {
        this.modalVisible = true;
        this.isEditing = true
      })
    },
    openAddFeatureModal() {
      this.modalVisible = true;
      this.modalFeature = null;
      this.isEditing = false
    },
    addFeature(payload) {
      return store.dispatch('app-content/addFeature', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('უპირატესობა წარმატებით დაემატა')
            this.fetchFeatures();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateFeature(payload) {
      return store.dispatch('app-content/updateFeature', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('უპირატესობა წარმატებით შეიცვალა')
            this.fetchFeatures();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteFeature(id) {
      return store.dispatch('app-content/deleteFeature', {id: id})
          .then((response) => {
            this.modalVisible = false;
            this.toast('უპირატესობა წარმატებით წაიშალა')
            this.fetchFeatures();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    confirmDelete(id) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          console.log('this slide', this.slide)
          this.deleteFeature(id)
        }
      })
    },
    toast(title, variant = 'success', toaster = 'b-toaster-bottom-right', append = false) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: `${title}`,
          icon: 'EditIcon',
          variant: variant,
        },
      })
    },
  },
  setup() {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    });
  },
}
</script>

