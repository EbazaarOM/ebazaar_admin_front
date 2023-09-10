<template>
  <!-- add/edit team vacancy question modal -->
  <b-modal id="modal-add-vacancy"
           ref="vacancy-modal"
           size="lg"
           class="p-3"
           :visible="isVacancyModalActive"
           @change="(val) => $emit('update:is-vacancy-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? $t('career.edit') : $t('career.addNew') }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <validation-observer ref="refFormObserver">
      <b-form class="edit-institution d-flex flex-column justify-content-between">

        <b-row>
          <b-col md="6">
            <validation-provider v-slot="{ errors, valid, dirty }"
                                 name="Valid from"
                                 rules="required">
              <b-form-group
                  label-for="userType">
                <label>{{ $t('global.dateFrom')  }} *</label>
                <b-form-datepicker id="date_from" v-model="validFrom"
                                   :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                                   reset-button/>
              </b-form-group>
            </validation-provider>
          </b-col>

          <b-col md="6">
            <validation-provider v-slot="{ errors, valid, dirty }"
                                 name="Valid from"
                                 rules="required">
              <b-form-group
                  label-for="userType">
                <label>{{ $t('global.dateTo') }} *</label>
                <b-form-datepicker id="date_until" v-model="validUntil"
                                   :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                                   reset-button></b-form-datepicker>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>

        <b-card>
          <b-tabs>
            <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
              <!-- Form: Description -->
              <b-form-group :label="$t('global.title')"
                            label-for="firstName_ka">
                <b-form-input id="firstName_ka" v-model="title_ka"
                              placeholder=""/>
              </b-form-group>
              <label for="description_ka">{{ $t('global.description') }}</label>
              <text-editor id="description_ka" v-if="description_ka !== null" :editor="description_ka" @update="updateDescriptionValue_ka"/>
            </b-tab>
            <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
              <!-- Form: Description -->
              <b-form-group :label="$t('global.title')"
                            label-for="firstName_en">
                <b-form-input id="firstName_en" v-model="title_en"
                              placeholder=""/>
              </b-form-group>
              <label for="description_en">{{ $t('global.description') }}</label>
              <text-editor id="description_en" v-if="description_en !== null" :editor="description_en" @update="updateDescriptionValue_en"/>
            </b-tab>
          </b-tabs>

        </b-card>
      </b-form>
    </validation-observer>

    <div class="mt-1 d-flex justify-content-between align-items-center">
      <b-button v-if="!isEditing" :disabled="!isValid || !actionActive" variant="primary" class="save-changes mb-3" @click="emitAddEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('global.add') }}</span>
      </b-button>

      <b-button v-else variant="primary" :disabled="!isValid" class="save-changes mb-3" @click="emitUpdateEvent">
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
  BFormDatepicker,
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  name: "VacancyModal",
  components: {
    TextEditor,
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
    BFormDatepicker,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    vacancy: {
      type: Object,
      default: () => null,
    },
    isVacancyModalActive: {
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
      description_ka: '',
      description_en: '',
      validFrom: '',
      validUntil: '',
      actionActive: true,
    }
  },
  watch: {
    isEditing: function () {
      if (this.isEditing) {

      }
    },
    isVacancyModalActive: function (newVal) {
      if (!newVal) {
        this.clearData();
      } else if (this.isEditing) {
        this.fillData();
      }
    }
  },
  computed: {
    isValid() {
      return this.validFrom !== ''
          && this.validUntil !== ''
    },
  },
  methods: {

    updateDescriptionValue_ka(description) {
      this.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.description_en = description
    },

    emitUpdateEvent() {
      this.actionActive = false
      let payload = {
        id: this.vacancy.id,
        validFrom: new Date(this.validFrom).toISOString(),
        validTill: new Date(this.validUntil).toISOString(),
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
        validFrom: new Date(this.validFrom).toISOString(),
        validTill: new Date(this.validUntil).toISOString(),
        translations: this.getPayloadTranslations()
      }
      this.$emit('add', payload)
      setTimeout(() => {
        this.actionActive = true
      }, 1000)
    },
    fillData() {
      let content_ka = this.vacancy.translations?.find(el => el.languageCode === 'ka')
      let content_en = this.vacancy.translations?.find(el => el.languageCode === 'en')
      this.title_ka = content_ka ? content_ka.title : ''
      this.description_ka = content_ka ? content_ka.description : ''
      this.title_en = content_en ? content_en.title : ''
      this.description_en = content_en ? content_en.description : ''
      this.validFrom = this.vacancy.validFrom
      this.validUntil = this.vacancy.validTill
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
      this.description_ka = ''
      this.title_en = ''
      this.description_en = ''
      this.validFrom = ''
      this.validUntil = ''
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
          this.$emit('delete', this.vacancy.id)
        }
      })
    },
    hideModal() {
      this.$refs['vacancy-modal'].hide()
    },
  }
}
</script>

<style scoped>

</style>
