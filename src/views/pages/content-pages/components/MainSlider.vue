<template>
  <div>
    <b-row class="mb-3 align-items-center">
      <b-col cols="6">
        <h3 class="m-0 p-0">{{ $t('slider.title') }}</h3>
      </b-col>
      <b-col
          cols="6"
          class="d-flex justify-content-end"
      >
        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="openAddSlideModal"
        >
          {{ $t('slider.addSlideTitle') }}
        </b-button>
      </b-col>
    </b-row>
    <div>
      <b-row>
        <b-col
            v-for="slide in slides"
            :key="slide.id"
            md="4"
        >
          <b-card
              tag="article"
              no-body
          >
<!--            <b-link :to="{ name: 'slide', params: { id: slide.id } }">-->
              <b-img
                  :src="staticEnvValue + `/` + slide.image"
                  :alt="slide.image.slice(5)"
                  class="card-img-top"
              />
<!--            </b-link>-->
            <b-card-body>
              <b-card-title>
                {{ slide.title.slice(0, 100) }} <span v-if="slide.title.length > 100">...</span>
              </b-card-title>
              <b-card-text class="slide-content-truncate">
                <b-link :href="slide.link" target="_blank">{{slide.link}}</b-link>
<!--                <b-link :href="slide.link"/>-->
<!--                {{ slide.link }}-->
              </b-card-text>
              <hr>
              <div class="d-flex justify-content-between align-items-center">
                <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="mr-1"
                    @click="openEditSlideModal(slide.id)"
                >
                  {{ $t('global.edit') }}
                </b-button>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <main-slider-modal :is-add-slide-modal-active.sync="modalVisible" :is-editing="isEditing"
                       :slide="modalSlide" @add="addSlide" @update="updateSlide" @delete="deleteSlide"/>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BRow,
  BCol,
  BCard,
  BFormInput,
  BCardText,
  BCardTitle,
  BMedia,
  BAvatar,
  BMediaAside,
  BMediaBody,
  BImg,
  BCardBody,
  BLink,
  BBadge,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BButton,
  BPagination,
} from 'bootstrap-vue'
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import ContentWithSidebar from "@core/layouts/components/content-with-sidebar/ContentWithSidebar";
import MainSliderModal from "@/views/pages/content-pages/components/MainSliderModal";
import Ripple from "vue-ripple-directive";

export default {
  name: "MainSlider",
  components: {
    MainSliderModal,
    HorizontalNavbar,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BCardText,
    BCardBody,
    BCardTitle,
    BLink,
    BBadge,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    BImg,
    BButton,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      slides: [],
      modalSlide: {},
      modalVisible: false,
      isEditing: false,
      staticEnvValue: ''
    }
  },

  mounted() {
    this.fetchSlides();
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  methods: {
    fetchSlides() {
      return store.dispatch('app-content/fetchSlides')
          .then((response) => {
            this.slides = response.data.data
          })
    },
    fetchSlide(payload) {
      return store.dispatch('app-content/fetchSlides', payload)
          .then((response) => {
            this.modalSlide = response.data
          })
    },
    openEditSlideModal(slide_id) {
      this.fetchSlide({id: slide_id}).then(() => {
        this.modalVisible = true;
        this.isEditing = true
      })
    },
    openAddSlideModal() {
      this.modalVisible = true;
      this.modalSlide = null;
      this.isEditing = false
    },
    addSlide(payload) {
      return store.dispatch('app-content/addSlide', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('სლაიდი წარმატებით დაემატა')
            this.fetchSlides();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateSlide(payload) {
      return store.dispatch('app-content/updateSlide', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('სლაიდი წარმატებით შეიცვალა')
            this.fetchSlides();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteSlide(id) {
      return store.dispatch('app-content/deleteSlide', {id: id})
          .then((response) => {
            this.modalVisible = false;
            this.toast('სლაიდი წარმატებით წაიშალა')
            this.fetchSlides();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
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
    // onUnmounted(() => {
    //   if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    // });
  },
}
</script>

<style scoped>

</style>
