<template>
  <div>
    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col
            cols="12"
            class="mt-50 d-flex justify-content-end"
        >
          <b-button :disabled="!actionActive"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateFaqContent"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('global.pageTitle_ka')"
              label-for="faq-title_ka"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_ka"
                v-model="faqContent.title_ka"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('global.pageTitle_en')"
              label-for="faq-title_en"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_en"
                v-model="faqContent.title_en"
            />
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-card>
            <!-- Header: Description -->
            <div class="d-flex mb-2">
              <feather-icon
                  icon="UserIcon"
                  size="19"
              />
              <h4 class="mb-0 ml-50">
                {{ $t('global.description') }}
              </h4>
            </div>

            <b-tabs>
              <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
                <!-- Form: Description -->
                <text-editor v-if="faqContent.description_ka !== null"
                             id="faq_description_ka"
                             :editor="faqContent.description_ka"
                             @update="updateDescriptionValue_ka"/>
              </b-tab>
              <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                <!-- Form: Description -->
                <text-editor v-if="faqContent.description_en !== null"
                             id="faq_description_en"
                             :editor="faqContent.description_en"
                             @update="updateDescriptionValue_en"/>
              </b-tab>
            </b-tabs>

          </b-card>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->

    <!-- payment tab -->
    <faq-question-answer :options="faqList" @edit="openEditFaqModal" @add="openAddFaqModal"/>
    <!--/ payment tab -->

    <!-- add/edit faq question modal -->
    <faq-question-modal :is-add-faq-modal-active.sync="modalVisible"
                        :item="editFaqItem"
                        :is-editing="isEditing"
                        @add="addFaq"
                        @delete="deleteFaq"
                        @update="updateFaq"/>
    <!-- add/edit faq question modal -->
  </div>
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
import Ripple from 'vue-ripple-directive'
import FaqQuestionAnswer from '../faq/FaqQuestionAnswer.vue'
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted, ref} from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import FaqQuestionModal from "@/views/pages/content-pages/components/FaqQuestionModal";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    FaqQuestionModal,
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
    FaqQuestionAnswer,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      faqSearchQuery: '',
      faqData: {
        categoryObj: {},
        categoryName: 'Category Name'
      },

      faqList: [],
      faqContent: {
        title_en: '',
        title_ka: '',
        description_ka: null,
        description_en: null
      },
      actionActive: false,
      faq: null,
      modalVisible: false,
      isEditing: false,
      editFaqItem: null,
    }
  },
  watch: {},
  mounted() {
    this.fetchFaqContent()
    this.fetchFaqs()
  },
  methods: {
    updateDescriptionValue_ka(description) {
      this.faqContent.description_ka = description
    },
    updateDescriptionValue_en(description) {
      this.faqContent.description_en = description
    },
    fetchFaqContent() {
      this.actionActive = false
      store.dispatch('app-content/fetchFaqContent')
          .then((response) => {
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.faqContent.title_ka = content_ka ? content_ka.title : ''
            this.faqContent.description_ka = content_ka ? content_ka.description : ''
            this.faqContent.title_en = content_en ? content_en.title : ''
            this.faqContent.description_en = content_en ? content_en.description : ''
            this.actionActive = true
          })
    },
    fetchFaqs() {
      store.dispatch('app-content/fetchFaq')
          .then((response) => {
            this.faqList = response.data.data
          })
    },
    fetchFaq(id) {
      return store.dispatch('app-content/fetchFaq', {id: id})
          .then((response) => {
            this.editFaqItem = response.data
          })
    },
    updateFaqContent() {
      this.actionActive = false
      let payload = {
        translations: [
          {
            languageCode: 'ka',
            title: this.faqContent.title_ka,
            description: this.faqContent.description_ka ? this.faqContent.description_ka : ''
          },
          {
            languageCode: 'en',
            title: this.faqContent.title_en,
            description: this.faqContent.description_en ? this.faqContent.description_en : ''
          },
        ]
      }
      store.dispatch('app-content/updateFaqContent', payload)
          .then((response) => {
            this.toast('წარმატებით განახლდა')
            this.fetchFaqContent()
          })
    },
    openEditFaqModal(item) {
      this.fetchFaq(item.id).then(() => {
        this.modalVisible = true;
        this.isEditing = true
      })
    },

    openAddFaqModal() {
      this.modalVisible = true;
      this.editFaqItem = null;
      this.isEditing = false
    },
    addFaq(payload) {
      return store.dispatch('app-content/addFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით დაემატა')
            this.fetchFaqs();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateFaq(payload) {
      return store.dispatch('app-content/updateFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით შეიცვალა')
            this.fetchFaqs();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteFaq(payload) {
      return store.dispatch('app-content/deleteFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით წაიშალა')
            this.fetchFaqs();
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
    onUnmounted(() => {
      if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    });
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-faq.scss';
</style>
