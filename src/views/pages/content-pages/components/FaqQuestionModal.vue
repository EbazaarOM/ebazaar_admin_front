<template>
  <!-- add/edit faq question modal -->
  <b-modal id="modal-add-faq-question"
           ref="faq-modal"
           size="lg"
           class="p-3"
           :visible="isAddFaqModalActive"
           @change="(val) => $emit('update:is-add-faq-modal-active', val)"
           hide-header
           hide-footer
           centered>

    <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ isEditing ? $t('faq.editQuestion') : $t('faq.addNewQuestion') }}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="edit-institution d-flex flex-column justify-content-between">

      <b-card>
        <b-tabs>
          <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
            <!-- Form: Description -->
            <b-form-group :label="$t('faq.question') + '*'"
                          label-for="newCategory_ka">
              <b-form-input id="question_ka" v-model="question_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('faq.answer') + '*'"
                          label-for="newCategory_ka">
              <b-form-input id="question_en" v-model="answer_ka"
                            placeholder=""/>
            </b-form-group>
          </b-tab>
          <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
            <!-- Form: Description -->
            <b-form-group :label="$t('faq.question')"
                          label-for="newCategory_en">
              <b-form-input id="answer_ka" v-model="question_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('faq.answer')"
                          label-for="newCategory_en">
              <b-form-input id="answer_en" v-model="answer_en"
                            placeholder=""/>
            </b-form-group>
          </b-tab>
        </b-tabs>

      </b-card>
    </b-form>

    <div class="mt-1 d-flex justify-content-between align-items-center">

      <b-button v-if="!isEditing" :disabled="!actionActive || !isValid" variant="primary" class="save-changes mb-3" @click="emitAddEvent">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('global.add') }}</span>
      </b-button>

      <b-button v-else :disabled="!isValid" variant="primary" class="save-changes mb-3" @click="emitUpdateEvent">
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
  <!-- add/edit faq question modal -->
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

export default {
  name: "FaqQuestionModal",
  components: {
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
    item: {
      type: Object,
      default: () => null,
    },
    isAddFaqModalActive: {
      type: Boolean
    },
    isEditing: {
      type: Boolean
    },
  },
  data() {
    return {
      question_ka: '',
      question_en: '',
      answer_ka: '',
      answer_en: '',
      actionActive: true,
    }
  },
  watch: {
    isEditing: function () {
      if (this.isEditing) {

      }
    },
    isAddFaqModalActive: function (newVal) {
      if (!newVal) {
        this.clearData();
      } else if (this.isEditing) {
        this.fillData();
      }
    }
  },
  computed: {
    isValid() {
      return this.question_ka !== '' && this.answer_ka !== ''
    }
  },

  methods: {
    emitUpdateEvent() {
        let payload = {
          id: this.item.id,
          translations: [
            {
              languageCode: 'ka',
              question: this.question_ka,
              answer: this.answer_ka
            },
            {
              languageCode: 'en',
              question: this.question_en,
              answer: this.answer_en
            },
          ]
        }
        this.$emit('update', payload)
    },
    emitAddEvent() {
      let payload = {
        translations: [
          {
            languageCode: 'ka',
            question: this.question_ka,
            answer: this.answer_ka
          },
          {
            languageCode: 'en',
            question: this.question_en,
            answer: this.answer_en
          },
        ]
      }
      this.actionActive = false
      this.$emit('add', payload)
    },
    fillData() {
      let faq_ka = this.item.translations?.find(el => el.languageCode === 'ka')
      let faq_en = this.item.translations?.find(el => el.languageCode === 'en')
      this.answer_ka = faq_ka ? faq_ka.answer : ''
      this.question_ka = faq_ka ? faq_ka.question : ''
      this.answer_en = faq_en ? faq_en.answer : ''
      this.question_en = faq_en ? faq_en.question : ''
    },
    clearData() {
      this.answer_ka = ''
      this.question_ka = ''
      this.answer_en = ''
      this.question_en = ''
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
          this.$emit('delete', this.item.id)
        }
      })
    },
    hideModal() {
      this.$refs['faq-modal'].hide()
    },
  }
}
</script>

<style scoped>

</style>
