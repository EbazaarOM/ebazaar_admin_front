<template>
  <div>
    <horizontal-navbar/>
    <h2>{{ $t('termsAndConditions.title') }}</h2>
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
              @click="updateTermsAndConditionsContent"
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
                v-model="title_ka"
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
                v-model="title_en"
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
                <text-editor v-if="description_ka !== null"
                             id="terms_description_ka"
                             :editor="description_ka"
                             @update="updateDescriptionValue_ka"/>
              </b-tab>
              <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                <!-- Form: Description -->
                <text-editor v-if="description_en !== null"
                             id="terms_description_en"
                             :editor="description_en"
                             @update="updateDescriptionValue_en"/>
              </b-tab>
            </b-tabs>

          </b-card>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->
  </div>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BMedia,
  BAvatar,
  BCardText,
  BMediaAside,
  BMediaBody,
  BForm,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BImg,
  BFormFile,
  BLink,
  BButton,
  BTabs,
  BTab,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {onUnmounted, ref} from '@vue/composition-api'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    HorizontalNavbar,
    BCard,
    BMedia,
    BAvatar,
    BCardText,
    BMediaAside,
    BMediaBody,
    BForm,
    BLink,
    BImg,
    BRow,
    BCol,
    BButton,
    BTabs,
    BTab,
    BFormGroup,
    BFormInput,
    BFormFile,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      title_en: '',
      title_ka: '',
      description_ka: null,
      description_en: null,
      isEditing: false,
      actionActive: false,
    }
  },
  mounted() {
    this.fetchTermsAndConditionsContent()
  },
  methods: {
    updateDescriptionValue_ka(description) {
      this.description_ka = description
    },
    updateDescriptionValue_en(description) {
      this.description_en = description
    },
    fetchTermsAndConditionsContent() {
      this.actionActive = false
      store.dispatch('app-content/fetchTermsAndConditionsContent')
          .then((response) => {
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.title_ka = content_ka ? content_ka.title : ''
            this.description_ka = content_ka ? content_ka.description : ''
            this.title_en = content_en ? content_en.title : ''
            this.description_en = content_en ? content_en.description : ''
            this.actionActive = true
          })
    },
    updateTermsAndConditionsContent() {
      this.actionActive = false
      let payload = {
        translations: [
          {
            languageCode: 'ka',
            title: this.title_ka,
            description: this.description_ka ? this.description_ka : ''
          },
          {
            languageCode: 'en',
            title: this.title_en,
            description: this.description_en ? this.description_en : ''
          },
        ]
      }
      store.dispatch('app-content/updateTermsAndConditionsContent', payload)
          .then((response) => {
            this.toast('წარმატებით განახლდა')
            this.fetchTermsAndConditionsContent()
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
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/pages/page-blog.scss';
</style>
