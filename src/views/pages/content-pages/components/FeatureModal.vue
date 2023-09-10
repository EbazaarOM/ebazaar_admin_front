<template>
  <!-- add/edit team member question modal -->
  <b-modal id="modal-add-feature"
           ref="feature-modal"
           size="lg"
           class="p-3"
           :visible="isAddFeatureModalActive"
           @change="(val) => $emit('update:is-add-feature-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? $t('advantages.edit') : $t('advantages.add') }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="edit-institution d-flex flex-column justify-content-between">
      <!-- icon -->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('advantages.advantageIcon') }}
          </h4>
          <template v-if="false && image.name">
            <p class="mt-1 mb-1">
              {{ $t('uploadImage.uploadPictures') }}
            </p>
            <div class="image-wrapper">
              <div class="">
                <img class="mw-100" :src="staticEnvValue + `/` + image.name"/>
              </div>
            </div>
          </template>

          <b-col cols="12">
            <img v-if="image.name" :src="staticEnvValue + `/` + image.name"
                 alt="Sticker Image" class="mr-2 rounded" style="width: 35px; height: 35px;">
            <b-form-file
                accept="image/*"
                style="max-width: 450px"
                size="sm"
                placeholder=""
                drop-placeholder=""
                @change="updateImage($event, image)"
            />
          </b-col>
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
            <text-editor v-if="description_ka !== null"
                         id="feature_description_ka"
                         :editor="description_ka"
                         @update="updateDescriptionValue_ka"/>
          </b-tab>
          <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
            <!-- Form: Description -->
            <b-form-group :label="$t('global.title')"
                          label-for="title_en">
              <b-form-input id="title_en" v-model="title_en"
                            placeholder=""/>
            </b-form-group>
            <text-editor v-if="description_en !== null"
                         id="feature_description_en"
                         :editor="description_en"
                         @update="updateDescriptionValue_en"/>
          </b-tab>
        </b-tabs>

      </b-card>
    </b-form>

    <div class="mt-1 d-flex justify-content-between align-items-center">

      <b-button v-if="!isEditing" :disabled="!actionActive" variant="primary" class="save-changes mb-3"
                @click="emitAddEvent">
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
  BFormTextarea,
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import {onUnmounted, ref} from "@vue/composition-api";
import {useInputImageRenderer} from "@core/comp-functions/forms/form-utils";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import store from "@/store";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  name: "FeatureModal",
  components: {
    TextEditor,
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
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  props: {
    feature: {
      type: Object,
      default: () => null,
    },
    isAddFeatureModalActive: {
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
      description_ka: null,
      description_en: null,
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
    isAddFeatureModalActive: function (newVal) {
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

  methods: {

    updateDescriptionValue_ka(description) {
      this.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.description_en = description
    },
    emitUpdateEvent() {
      let payload = {
        id: this.feature.id,
        image: this.image.name,
        translations: this.getPayloadTranslations()
      }
      this.$emit('update', payload)
    },
    emitAddEvent() {
      let payload = {
        image: this.image.name,
        translations: this.getPayloadTranslations()
      }
      this.actionActive = false
      this.$emit('add', payload)
      setTimeout(() => {
        this.actionActive = true
      }, 1000)
    },
    addImage(name) {
      this.image = {
        name: name
      }
    },
    updateImage(event, sticker) {
      this.actionActive = false
      return store.dispatch('app-content/uploadFile', {file: event.target.files[0]})
          .then(response => {
            this.image['name'] = response.data.name.key
            this.actionActive = true
          })
          .catch(error => {
            this.actionActive = true
          })
    },
    fillData() {
      let feature_ka = this.feature.translations?.find(el => el.languageCode === 'ka')
      let feature_en = this.feature.translations?.find(el => el.languageCode === 'en')
      this.title_ka = feature_ka ? feature_ka.title : ''
      this.description_ka = feature_ka ? feature_ka.description : ''
      this.title_en = feature_en ? feature_en.title : ''
      this.description_en = feature_en ? feature_en.description : ''
      this.image = {
        name: this.feature.image
      }
    },
    getPayloadTranslations() {
      return [
        {
          languageCode: 'ka',
          title: this.title_ka,
          description: this.description_ka ? this.description_ka : '',
        },
        {
          languageCode: 'en',
          title: this.title_en,
          description: this.description_en ? this.description_en : '',
        },
      ]
    },
    clearData() {
      this.title_ka = ''
      this.title_en = ''
      this.description_ka = ''
      this.description_en = ''
      this.image = {}
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
          this.$emit('delete', this.feature.id)
        }
      })
    },
    hideModal() {
      this.$refs['feature-modal'].hide()
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

<style scoped lang="scss">

</style>
