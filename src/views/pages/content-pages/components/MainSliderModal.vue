<template>
  <!-- add/edit team member question modal -->
  <b-modal id="modal-add-slide"
           ref="slide-modal"
           size="lg"
           class="p-3"
           :visible="isAddSlideModalActive"
           @change="(val) => $emit('update:is-add-slide-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? $t('slider.editSlide') : $t('slider.addSlideTitle') }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="edit-institution d-flex flex-column justify-content-between">
      <!-- outer image-->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('slider.sliderPicture') }}
          </h4>
          <template v-if="image.name">
            <p class="mt-1 mb-1">
              {{ $t('uploadImage.uploadedPicture') }}
            </p>
            <div class="image-wrapper">
              <div class="">
                <img class="mw-100" :src="staticEnvValue + `/` + image.name"/>
              </div>
            </div>
          </template>
          <image-upload id="slider_image"
                        ref="image"
                        store="app-content"
                        url="cropImage"
                        module="contentStoreModule"
                        :required="true"
                        :on-crop="addImage" :x="1920" :y="585"/>
        </div>
      </b-col>
      <b-card>
        <b-tabs>
          <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
            <!-- Form: Description -->
            <b-form-group :label="$t('global.title')"
                          label-for="title_ka">
              <b-form-input id="title_ka" v-model="title_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link_ka">
              <b-form-input id="link_ka" v-model="link_ka"
                            placeholder=""/>
            </b-form-group>
          </b-tab>
          <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
            <!-- Form: Description -->
            <b-form-group :label="$t('global.title')"
                          label-for="title_en">
              <b-form-input id="title_en" v-model="title_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link_en">
              <b-form-input id="link_en" v-model="link_en"
                            placeholder=""/>
            </b-form-group>
          </b-tab>
        </b-tabs>

      </b-card>
    </b-form>

    <div class="mt-1 d-flex justify-content-between align-items-center">

      <b-button v-if="!isEditing" :disabled="!isValid || !actionActive" variant="primary" class="save-changes mb-3" @click="emitAddEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('global.add') }}</span>
      </b-button>

      <b-button v-else variant="primary" class="save-changes mb-3" @click="emitUpdateEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('global.save') }}</span>
      </b-button>
      <!-- Delete Button -->
      <b-button v-if="isEditing"
                @click="openSwal()"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="danger"
                class="btn-icon ml-1"
      >
        <feather-icon icon="DeleteIcon"/>
      </b-button>
    </div>
  </b-modal>
  <!-- add/edit Team Member question modal -->
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BCardBody,
  BForm,
  BFormGroup,
  BInputGroup,
  BFormInput,
  BCardText,
  BInputGroupPrepend,
  BTabs,
  BTab,
  BImg,
  BRow,
  BCol,
  BAvatar,
  BButton,
  BModal,
  BFormFile,
  BLink,
  BMedia,
  BMediaAside,
  BMediaBody,
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import {onUnmounted, ref} from "@vue/composition-api";
import {useInputImageRenderer} from "@core/comp-functions/forms/form-utils";
import ImageUpload from "@/views/apps/products/components/ImageUpload";

export default {
  name: "MainSliderModal",
  components: {
    ImageUpload,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BCardBody,
    BInputGroup,
    BFormInput,
    BCardText,
    BInputGroupPrepend,
    BTabs,
    BTab,
    BImg,
    BButton,
    BModal,
    BFormFile,
    BLink,
    BMedia,
    BMediaAside,
    BMediaBody,
  },
  directives: {
    Ripple,
  },
  props: {
    slide: {
      type: Object,
      default: () => null,
    },
    isAddSlideModalActive: {
      type: Boolean
    },
    isEditing: {
      type: Boolean
    },
  },
  data() {
    return {
      title_ka: '',
      title_en: '',
      link_ka: '',
      link_en: '',
      image: {},
      imageFile: null,
      staticEnvValue: '',
      actionActive: true,
    }
  },
  watch: {
    isEditing: function () {
      if (this.isEditing) {

      }
    },
    isAddSlideModalActive: function (newVal) {
      if (!newVal) {
        this.clearData();
      } else if (this.isEditing) {
        this.fillData();
      }
    }
  },
  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  computed: {
    isValid() {
      return Object.keys(this.image).length
    }
  },

  methods: {
    emitUpdateEvent() {
      let payload = {
        id: this.slide.id,
        image: this.image.name,
        translations: this.getPayloadTranslations()
      }
      this.actionActive = false
      this.$emit('update', payload)
    },
    emitAddEvent() {
      let payload = {
        image: this.image.name,
        translations: this.getPayloadTranslations()
      }
      this.actionActive = false
      this.$emit('add', payload)
    },
    addImage(name) {
      this.image = {
        name: name
      }
    },
    fillData() {
      let slide_ka = this.slide.translations?.find(el => el.languageCode === 'ka')
      let slide_en = this.slide.translations?.find(el => el.languageCode === 'en')
      this.title_ka = slide_ka ? slide_ka.title : ''
      this.link_ka = slide_ka ? slide_ka.link : ''
      this.title_en = slide_en ? slide_en.title : ''
      this.link_en = slide_en ? slide_en.link : ''
      this.image = {
        name: this.slide.image
      }
    },
    getPayloadTranslations() {
      return [
        {
          languageCode: 'ka',
          title: this.title_ka,
          link: this.link_ka,
        },
        {
          languageCode: 'en',
          title: this.title_en,
          link: this.link_en,
        },
      ]
    },
    clearData() {
      this.title_ka = ''
      this.title_en = ''
      this.link_ka = ''
      this.link_en = ''
      this.image = ''
      this.actionActive = true
    },
    openSwal() {
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
          this.$emit('delete', this.slide.id)
        }
      })
    },
    hideModal() {
      this.$refs['slide-modal'].hide()
    },
  },

  setup() {
    const refInputEl = ref(null)
    const refPreviewEl = ref(null)

    const {inputImageRenderer} = useInputImageRenderer(refInputEl, base64 => {
      refPreviewEl.value.src = base64
    })

    return {
      refPreviewEl,
      inputImageRenderer,
    }
  },
}
</script>

<style scoped>

</style>
