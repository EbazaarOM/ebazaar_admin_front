<template>
  <div>
    <horizontal-navbar/>
    <b-row>
      <!-- title -->
      <b-col
          cols="12"
          class="mt-50 mb-3 d-flex justify-content-between"
      >
        <h2>{{ $t('websiteInfo.title') }}</h2>
      </b-col>

      <!-- analytics -->
      <b-col
          cols="12"
          class="mb-3 p-0 d-flex justify-content-between flex-wrap "
      >
        <b-col md="12" class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="w-100">{{ $t('websiteInfo.analytics') }}</h4>
          <b-button :disabled="!actionActive.analytics"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateAnalytics"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('websiteInfo.headerCode')"
              label-for="header_codes"
              class="mb-2"
          >
            <b-form-textarea
                id="header_codes"
                v-model="analytics.headerCodes"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('websiteInfo.bodyCode')"
              label-for="body_codes"
              class="mb-2"
          >
            <b-form-textarea
                id="body_codes"
                v-model="analytics.bodyCodes"
            />
          </b-form-group>
        </b-col>
      </b-col>

      <!-- phone -->
      <b-col
          cols="12"
          class="mb-3 p-0 d-flex justify-content-between flex-wrap "
      >
        <b-col md="12" class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="w-100">{{ $t('websiteInfo.headerPhoneNumber') }}</h4>
          <b-button :disabled="!actionActive.phoneNumber"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateHeaderPhone"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('users.phoneNumber')"
              label-for="phone"
              class="mb-2"
          >
            <b-form-input
                id="phone"
                v-model="phoneNumber"
            />
          </b-form-group>
        </b-col>
      </b-col>

      <!-- share info -->
      <b-col
          cols="12"
          class="mb-3 p-0 d-flex justify-content-between flex-wrap "
      >
        <b-col md="12" class="d-flex justify-content-between align-items-center">
          <h4 class="w-100">{{ $t('websiteInfo.sharingInformation') }}</h4>
          <b-button :disabled="!actionActive.openGraph"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateOpenGraph"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="12" class="mb-2">
          <b-tabs>
            <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">

              <div class="m-0 d-flex justify-content-between">
                <b-col md="6" class="p-0">
                  <b-form-group
                      :label="$t('global.sharingTitle')"
                      label-for="share-title_ka"
                      class="mb-2"
                  >
                    <b-form-input
                        id="share-title_ka"
                        v-model="ogObj.shareTitle_ka"
                    />
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group
                      :label="$t('websiteInfo.keywords')"
                      label-for="keywords_ka"
                      class="mb-2"
                  >
                    <b-form-input
                        id="keywords_ka"
                        v-model="ogObj.keywords_ka"
                    />
                  </b-form-group>
                </b-col>
              </div>
              <div class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-group
                      :label="$t('global.sharingDescription')"
                      label-for="share-description_ka"
                      class="mb-2"
                  >
                    <b-form-textarea
                        id="share-description_ka"
                        v-model="ogObj.shareDescription_ka"
                    />
                  </b-form-group>
                </b-col>
              </div>
            </b-tab>
            <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
              <div class="m-0 d-flex justify-content-between">
                <b-col md="6" class="p-0">
                  <b-form-group
                      :label="$t('global.sharingTitle')"
                      label-for="share-title_en"
                      class="mb-2"
                  >
                    <b-form-input
                        id="share-title_en"
                        v-model="ogObj.shareTitle_en"
                    />
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group
                      :label="$t('websiteInfo.keywords')"
                      label-for="keywords_en"
                      class="mb-2"
                  >
                    <b-form-input
                        id="keywords_en"
                        v-model="ogObj.keywords_en"
                    />
                  </b-form-group>
                </b-col>
              </div>
              <div class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-group
                      :label="$t('global.sharingDescription')"
                      label-for="share-description_en"
                      class="mb-2"
                  >
                    <b-form-textarea
                        id="share-description_en"
                        v-model="ogObj.shareDescription_en"
                    />
                  </b-form-group>
                </b-col>
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
        <b-col
            cols="12"
            class="mb-2"
        >
          <div class="border rounded p-2">
            <h4 class="mb-1">
              {{ $t('websiteInfo.sharingPicture') }}
            </h4>
            <template v-if="ogObj.shareImage">
              <p class="mt-1 mb-1">
                {{ $t('uploadImage.uploadedPicture') }}
              </p>
              <div class="image-wrapper">
                <div class="">
                  <img class="mw-100" :src="staticEnvValue + `/` + ogObj.shareImage.name"/>
                </div>
              </div>
            </template>
            <image-upload id="share_image"
                          store="app-content"
                          url="cropImage"
                          module="contentStoreModule"
                          :on-crop="addShareImage" :x="1200" :y="628"/>
          </div>
        </b-col>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* eslint-disable */
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import {
  BCard,
  BForm,
  BRow,
  BCol,
  BTab,
  BTabs,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BButton,
  BListGroupItem,
  BListGroup,
} from 'bootstrap-vue'
import ContactUsItem from "@/views/pages/content-pages/components/ContactUsItem";
import Ripple from "vue-ripple-directive";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted, ref} from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent";


export default {
  name: "SharingInfo",
  components: {
    ImageUpload,
    ContactUsItem,
    HorizontalNavbar,
    BCard,
    BForm,
    BRow,
    BCol,
    BTab,
    BTabs,
    BButton,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BListGroupItem,
    BListGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      actionActive: {
        openGraph: true,
        analytics: true,
        phoneNumber: true,
      },
      analytics: {
        headerCodes: '',
        bodyCodes: '',
      },
      phoneNumber: '',
      ogObj: {
        shareImage: {},
        shareTitle_ka: '',
        shareTitle_en: '',
        shareDescription_ka: '',
        shareDescription_en: '',
        keywords_ka: '',
        keywords_en: ''
      },
      staticEnvValue: ''
    }
  },

  created() {
    this.fetchAnalytics()
    this.fetchHeaderPhone()
    this.fetchOpenGraph()
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },

  methods: {
    addShareImage(name) {
      this.ogObj.shareImage = {
        name: name
      }
    },
    fetchAnalytics() {
      this.actionActive.analytics = false
      store.dispatch('app-content/fetchAnalytics')
          .then((response) => {
            this.analytics.bodyCodes = response.data.bodyCodes
            this.analytics.headerCodes = response.data.headerCodes
            this.actionActive.analytics = true
          })
    },
    fetchHeaderPhone() {
      this.actionActive.phoneNumber = false
      store.dispatch('app-content/fetchHeaderPhone')
          .then((response) => {
            this.phoneNumber = response.data.phone
            this.actionActive.phoneNumber = true
          })
    },
    fetchOpenGraph() {
      this.actionActive.openGraph = false
      store.dispatch('app-content/fetchOpenGraph')
          .then((response) => {
            this.fillOpenGraphData(response)
          })
    },
    updateAnalytics() {
      this.actionActive.analytics = false
      store.dispatch('app-content/updateAnalytics', this.analytics)
          .then(() => {
            this.fetchAnalytics()
            this.toast('ანალიტიკა წარმატებით განახლდა')
          })
          .catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateHeaderPhone() {
      this.actionActive.phoneNumber = false
      store.dispatch('app-content/updateHeaderPhone', {phone: this.phoneNumber})
          .then(() => {
            this.fetchHeaderPhone()
            this.toast('ნომერი წარმატებით განახლდა')
          })
          .catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateOpenGraph() {
      this.actionActive.openGraph = false
      let payload = {
        shareImage: this.ogObj.shareImage.name,
        translations: [
          {
            languageCode: 'ka',
            keywords: this.ogObj.keywords_ka,
            shareTitle: this.ogObj.shareTitle_ka,
            shareDescription: this.ogObj.shareDescription_ka
          },
          {
            languageCode: 'en',
            keywords: this.ogObj.keywords_en,
            shareTitle: this.ogObj.shareTitle_en,
            shareDescription: this.ogObj.shareDescription_en
          },
        ]
      }
      store.dispatch('app-content/updateOpenGraph', payload)
          .then(() => {
            this.fetchOpenGraph();
            this.toast('გასაზიარებელი ინფორმაცია წარმატებით განახლდა')
          })
          .catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    fillOpenGraphData(response) {
      this.ogObj.shareImage = {
        name: response.data.shareImage
      }
      let content_ka = response.data ? response.data.translations?.find(el => el.languageCode === 'ka') : {}
      let content_en = response.data ? response.data.translations?.find(el => el.languageCode === 'en') : {}
      this.ogObj.shareTitle_ka = content_ka ? content_ka.shareTitle : ''
      this.ogObj.shareDescription_ka = content_ka ? content_ka.shareDescription : ''
      this.ogObj.keywords_ka = content_ka ? content_ka.keywords : ''

      this.ogObj.shareTitle_en = content_en ? content_en.shareTitle : ''
      this.ogObj.shareDescription_en = content_en ? content_en.shareDescription : ''
      this.ogObj.keywords_en = content_en ? content_en.keywords : ''
      this.actionActive.openGraph = true
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

<style scoped>

</style>
