<template>
  <!-- add/edit certificate modal -->
  <b-modal id="modal-add-certificate"
           ref="certificate-modal"
           size="lg"
           class="p-3"
           :visible="isAddCertificateModalActive"
           @change="(val) => $emit('update:is-add-certificate-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? 'სერტიფიკატის რედაქტირება' : 'სერტიფიკატის დამატება' }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="edit-institution d-flex flex-column justify-content-between">
      <template v-if="uploadedFileName">
        <p class="m-0 mb-1">
          ატვირთული ფაილი:
          <a :href="`${staticEnvValue}/${uploadedFileName}`" target="_blank">{{ uploadedFileName }}</a>
        </p>
      </template>
      <!-- certificate file -->
      <b-form-group>
        <label><span v-if="isEditing">ახალი</span> ფაილის მიბმა.</label>
        <b-form-file v-model="fileInput" placeholder="ჩასვით ფაილი აქ..." drop-placeholder="ჩააგდეთ ფაილი აქ..."
                     @change="uploadFile"/>
      </b-form-group>
      <!-- certificate name -->
      <b-row>
        <b-col md="6">
          <b-form-group
              label="სერტიფიკატის სათაური ქართულად"
              label-for="certificate-title_ka"
              class="mb-2"
          >
            <b-form-input
                id="certificate-title_ka"
                v-model="title_ka"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              label="სერტიფიკატის სათაური ინგლისურად"
              label-for="certificate-title_en"
              class="mb-2"
          >
            <b-form-input
                id="certificate-title_en"
                v-model="title_en"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <div class="mt-1 d-flex justify-content-between align-items-center">

      <b-button v-if="!isEditing" :disabled="!actionActive" variant="primary" class="save-changes mb-3"
                @click="emitAddEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">დამატება</span>
      </b-button>

      <b-button v-else variant="primary" class="save-changes mb-3" @click="emitUpdateEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">რედაქტირება</span>
      </b-button>
      <!-- Delete Button -->
      <b-button v-if="isEditing"
          @click="emitDeleteEvent()"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="danger"
          class="btn-icon ml-1"
      >
        <feather-icon icon="DeleteIcon"/>
      </b-button>
    </div>
  </b-modal>
  <!-- add/edit Certificate modal -->
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
  BFormFile
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";

export default {
  name: "CertificateModal",
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
    BFormFile,
    BInputGroupPrepend,
    BTabs,
    BTab,
    BImg,
    BButton,
    BModal,
  },
  directives: {
    Ripple,
  },
  props: {
    certificate: {
      type: Object,
      default: () => null,
    },
    isAddCertificateModalActive: {
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
      actionActive: true,
      fileInput: [],
      file: {},
      uploadedFileName: ''
    }
  },
  watch: {
    isAddCertificateModalActive: function (newVal) {
      if (!newVal) {
        this.clearData();
      } else if (this.isEditing) {
        this.fillData();
      }
    },
  },
  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },

  methods: {
    uploadFile(e) {
      return store.dispatch('app-user/uploadFile', {file: e.target.files[0]})
          .then((response) => {
            this.uploadedFileName = response.data.name.key
          })
    },
    emitUpdateEvent() {
      this.actionActive = false
      let payload = {
        id: this.certificate.id,
        file: this.uploadedFileName,
        title_ka: this.title_ka,
        translations: this.getPayloadTranslations()
      }
      this.$emit('update', payload)
      setTimeout(() => {
        this.actionActive = true
      }, 1000)
    },
    emitAddEvent() {
      this.actionActive = false
      let payload = {
        file: this.uploadedFileName,
        title_ka: this.title_ka,
        translations: this.getPayloadTranslations()
      }
      this.$emit('add', payload)
      setTimeout(() => {
        this.actionActive = true
      }, 1000)
    },
    emitDeleteEvent() {
      this.$emit('delete', this.certificate.id)
    },
    fillData() {
      let certificate_ka = this.certificate.translations?.find(el => el.languageCode === 'ka')
      let certificate_en = this.certificate.translations?.find(el => el.languageCode === 'en')
      this.title_ka = certificate_ka ? certificate_ka.title : ''
      this.title_en = certificate_en ? certificate_en.title : ''
      this.uploadedFileName = this.certificate.file
    },
    getPayloadTranslations() {
      return [
        {
          languageCode: 'ka',
          title: this.title_ka,
        },
        {
          languageCode: 'en',
          title: this.title_en,
        },
      ]
    },
    clearData() {
      this.title_ka = ''
      this.title_en = ''
      this.file = ''
    },
    hideModal() {
      this.$refs['certificate-modal'].hide()
    },
  },

  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-users';
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);
  },
}
</script>

<style scoped>

</style>
