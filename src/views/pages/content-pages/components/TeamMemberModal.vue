<template>
  <!-- add/edit team member question modal -->
  <b-modal id="modal-add-team-member"
           ref="team-member-modal"
           size="lg"
           class="p-3"
           :visible="isAddTeamMemberModalActive"
           @change="(val) => $emit('update:is-add-team-member-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? $t('aboutUs.editEmployee') : $t('aboutUs.addEmployee') }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="edit-institution d-flex flex-column justify-content-between">
      <!-- team member image -->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('aboutUs.employeePhoto') }}
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
                        :on-crop="addImage" :x="410" :y="457"/>
        </div>
      </b-col>
      <b-card>
        <b-tabs>
          <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
            <!-- Form: Description -->
            <b-form-group :label="$t('users.name')"
                          label-for="firstName_ka">
              <b-form-input id="firstName_ka" v-model="firstName_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('users.surname')"
                          label-for="lastName_ka">
              <b-form-input id="lastName_ka" v-model="lastName_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('aboutUs.position')"
                          label-for="position_ka">
              <b-form-input id="position_ka" v-model="position_ka"
                            placeholder=""/>
            </b-form-group>
          </b-tab>
          <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
            <!-- Form: Description -->
            <b-form-group :label="$t('users.name')"
                          label-for="firstName_en">
              <b-form-input id="firstName_en" v-model="firstName_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('users.surname')"
                          label-for="lastName_en">
              <b-form-input id="lastName_en" v-model="lastName_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('aboutUs.position')"
                          label-for="position_en">
              <b-form-input id="position_en" v-model="position_en"
                            placeholder=""/>
            </b-form-group>
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
      <b-button
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
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import ImageUpload from "@/views/apps/products/components/ImageUpload";

export default {
  name: "TeamMemberModal",
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
  },
  directives: {
    Ripple,
  },
  props: {
    member: {
      type: Object,
      default: () => null,
    },
    isAddTeamMemberModalActive: {
      type: Boolean
    },
    isEditing: {
      type: Boolean
    },
  },
  data() {
    return {
      firstName_ka: '',
      firstName_en: '',
      lastName_ka: '',
      lastName_en: '',
      position_ka: '',
      position_en: '',
      image: '',
      actionActive: true,
    }
  },
  watch: {
    isAddTeamMemberModalActive: function (newVal) {
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
    emitUpdateEvent() {
      this.actionActive = false
      let payload = {
        id: this.member.id,
        image: this.image.name,
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
        image: this.image.name,
        translations: this.getPayloadTranslations()
      }
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
    fillData() {
      let teamMember_ka = this.member.translations?.find(el => el.languageCode === 'ka')
      let teamMember_en = this.member.translations?.find(el => el.languageCode === 'en')
      this.firstName_ka = teamMember_ka ? teamMember_ka.firstName : ''
      this.lastName_ka = teamMember_ka ? teamMember_ka.lastName : ''
      this.position_ka = teamMember_ka ? teamMember_ka.position : ''
      this.firstName_en = teamMember_en ? teamMember_en.firstName : ''
      this.lastName_en = teamMember_en ? teamMember_en.lastName : ''
      this.position_en = teamMember_en ? teamMember_en.position : ''
      this.image = {
        name: this.member.image
      }
    },
    getPayloadTranslations() {
      return [
        {
          languageCode: 'ka',
          firstName: this.firstName_ka,
          lastName: this.lastName_ka,
          position: this.position_ka
        },
        {
          languageCode: 'en',
          firstName: this.firstName_en,
          lastName: this.lastName_en,
          position: this.position_en
        },
      ]
    },
    clearData() {
      this.firstName_ka = ''
      this.lastName_ka = ''
      this.position_ka = ''
      this.firstName_en = ''
      this.lastName_en = ''
      this.position_en = ''
      this.image = ''
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
          this.$emit('delete', this.member.id)
        }
      })
    },
    hideModal() {
      this.$refs['team-member-modal'].hide()
    },
  }
}
</script>

<style scoped>

</style>
