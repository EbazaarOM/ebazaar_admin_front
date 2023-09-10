<template>
  <div class="w-50 d-flex align-items-start justify-content-start">

    <div v-if="certificatesObject" class="certificates-container w-100 p-2">
      <div class="p-1 d-flex align-items-center justify-content-between mb-2">
        <div class="sticker-container pr-5">
          <img :src="staticEnvValue + `/` + certificatesObject.image" alt="Sticker Image"
               style="width: 35px; height: 35px;"
               class="rounded mr-1">
          <span><small>{{ certificatesObject.title }}</small></span>
        </div>
        <b-button v-if="isEditable"
            @click="openAddCertificateModal"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="btn-icon ml-1"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </div>

      <div v-if="files.length" class="w-100 mb-4 upload-files-container">
        <div v-for="(file, index) in certificates" :key="file.title_ka + file.id + index"
               class="border border-light rounded p-1 mb-1 d-flex justify-content-between align-items-center">
          <p class="mb-0 pl-1">
            <a :href="`${staticEnvValue}/${file.file}`" target="_blank">{{ file.title_ka }}</a>
          </p>
          <div v-if="isEditable" class="d-flex align-items-center justify-content-between">
            <!-- Edit Button-->
            <b-button
                @click="openEditCertificateModal(file)"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="warning"
                class="btn-icon ml-1"
            >
              <feather-icon icon="EditIcon"/>
            </b-button>
            <!-- Delete Button -->
            <b-button
                @click="openSwal(file)"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="danger"
                class="btn-icon ml-1"
            >
              <feather-icon icon="DeleteIcon"/>
            </b-button>
          </div>
        </div>
      </div>

    </div>

    <hr/>

    <certificate-modal :is-add-certificate-modal-active.sync="modalVisible" :is-editing="isEditing"
                       :certificate="modalCertificate"
                       @add="addCertificate" @update="updateCertificate" @delete="openSwal"/>
  </div>
</template>

<script>
/* eslint-disable */
import {BFormGroup, BFormFile, BButton} from 'bootstrap-vue';
import store from "@/store";
import {onUnmounted} from "@vue/composition-api";
import userStoreModule from '../../userStoreModule'
import draggable from "vuedraggable";
import CertificateModal from "@/views/pages/content-pages/components/CertificateModal";
import Ripple from "vue-ripple-directive";

export default {
  name: "Certificates",
  components: {
    CertificateModal,
    BFormGroup,
    BButton,
    BFormFile,
    draggable,
  },
  directives: {
    Ripple,
  },
  props: {
    certificatesObject: {
      type: Object,
      default: () => {
      },
    },
    sticker: {
      type: Object,
      default: () => {
      },
    },
    isEditable: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      sticker1: {},
      fileInput: [],
      files: [
        {
          "id": 0,
          "stickerId": 0,
          "file": "string"
        },
      ],
      staticEnvValue: '',
      certificates: [],
      modalVisible: false,
      isEditing: false,
      modalCertificate: null,
    }
  },

  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
    this.certificates = []
    this.certificatesObject && this.certificatesObject.certificates ? this.certificatesObject.certificates.forEach((item) => {
      let copyItem = Object.assign(item)
      copyItem['title_ka'] = item.translations?.find(el => el.languageCode === 'ka').title
      copyItem['title_en'] = item.translations?.find(el => el.languageCode === 'en').title
      copyItem['file'] = item.file
      copyItem['id'] = item.id
      this.certificates.push(copyItem)
      console.log('aq ramdenjer shemodixar?', copyItem)
    }) : []
  },

  watch: {},

  methods: {
    removeFile(file) {
      const index = this.certificates.findIndex(el => el.id === file.id);
      this.certificates.splice(index, 1);
      this.$emit('delete', this.certificates)
    },
    openAddCertificateModal() {
      this.modalVisible = true;
      this.modalCertificate = null;
      this.isEditing = false
    },
    addCertificate(data) {
      let newCertificate = Object.assign(data)
      newCertificate['stickerId'] = this.sticker.id
      newCertificate['image'] = this.sticker.image
      newCertificate['id'] = 0
      newCertificate['title_ka'] = data.title_ka
      this.certificates.push(newCertificate)
      this.modalVisible = false
      this.$emit('add', newCertificate)
    },
    openEditCertificateModal(file) {
      this.modalVisible = true
      this.isEditing = true
      this.modalCertificate = file
    },
    updateCertificate(data) {
      let newCertificate = Object.assign(data)
      newCertificate['stickerId'] = this.sticker.id
      newCertificate['image'] = this.sticker.image
      newCertificate['id'] = data.id
      newCertificate['title_ka'] = data.title_ka
      let oldItemIndex = this.certificates.findIndex(el => el.id === data.id)
      this.certificates.splice(oldItemIndex, 1, newCertificate)
      this.modalVisible = false
      this.$emit('update', newCertificate)
    },
    deleteCertificate() {
    },
    openSwal(file) {
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
          this.isEditing = false;
          let deleteItemIndex = this.certificates.findIndex(el => el.id === file.id)
          this.certificates.splice(deleteItemIndex, 1)
          this.$emit('delete', file)
        }
      })
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
