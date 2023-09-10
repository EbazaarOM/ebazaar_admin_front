<template>
  <div>
    <b-row class="d-flex justify-content-between align-items-center">
      <h3 class="p-2">{{ $t('banners.title') }}</h3>

      <div class="d-flex justify-content-between align-items-center">
        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="updateBanners()"
        >
          {{ $t('global.save') }}
        </b-button>
      </div>
    </b-row>
    <b-row>
      <!-- image1 -->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('banners.firstBanner') }}
          </h4>
          <template v-if="banner_first.image1">
            <p class="mt-1 mb-1">
              {{ $t('uploadImage.uploadedPicture') }}
            </p>
            <div class="image-wrapper">
              <div class="">
                <img class="mw-100" :src="staticEnvValue + `/` + banner_first.image1.name"/>
              </div>
            </div>
          </template>
          <image-upload key="image"
                        id="image"
                        ref="image"
                        store="app-content"
                        url="cropImage"
                        module="contentStoreModule"
                        :on-crop="addImage1" :x="637" :y="720"/>
        </div>
      </b-col>

      <!-- image1 Mobile -->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('banners.firstBannerMobile') }}
          </h4>
          <template v-if="banner_first.image1Mobile">
            <p class="mt-1 mb-1">
              {{ $t('uploadImage.uploadedPicture') }}
            </p>
            <div class="image-wrapper">
              <div class="">
                <img class="mw-100" :src="staticEnvValue + `/` + banner_first.image1Mobile.name"/>
              </div>
            </div>
          </template>
          <image-upload key="cover_image"
                        id="cover_image"
                        ref="cover_image"
                        store="app-content"
                        url="cropImage"
                        module="contentStoreModule"
                        :on-crop="addImage1Mobile" :x="650" :y="558"/>
        </div>
      </b-col>

      <!-- image2 -->
      <b-col
          cols="12"
          class="mb-2"
      >
        <div class="border rounded p-2">
          <h4 class="mb-1">
            {{ $t('banners.secondBanner') }}
          </h4>
          <template v-if="banner_second.image2">
            <p class="mt-1 mb-1">
              {{ $t('uploadImage.uploadedPicture') }}
            </p>
            <div class="image-wrapper">
              <div class="">
                <img class="mw-100" :src="staticEnvValue + `/` + banner_second.image2.name"/>
              </div>
            </div>
          </template>
          <image-upload id="share_image"
                        store="app-content"
                        url="cropImage"
                        module="contentStoreModule"
                        :on-crop="addImage2" :x="900" :y="720"/>
        </div>
      </b-col>
    </b-row>

    <b-tabs>
      <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
        <!-- Form: Description -->
        <div class="d-flex justify-content-between">
          <b-col md="6">
            <p>{{ $t('banners.firstBannerInformation') }}</p>
            <b-form-group :label="$t('global.title')"
                          label-for="title1_ka">
              <b-form-input id="title1_ka" v-model="banner_first.title1_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link1_ka">
              <b-form-input id="link1_ka" v-model="banner_first.link1_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.shortDescription')"
                          label-for="description1_ka">
              <b-form-textarea id="description1_ka" v-model="banner_first.shortDescription1_ka"
                            placeholder=""/>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <p>{{ $t('banners.secondBannerInformation') }}</p>
            <b-form-group :label="$t('global.title')"
                          label-for="title2_ka">
              <b-form-input id="title2_ka" v-model="banner_second.title2_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link2_ka">
              <b-form-input id="link2_ka" v-model="banner_second.link2_ka"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.shortDescription')"
                          label-for="description2_ka">
              <b-form-textarea id="description2_ka" v-model="banner_second.shortDescription2_ka"
                            placeholder=""/>
            </b-form-group>
          </b-col>
        </div>

      </b-tab>
      <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
        <!-- Form: Description -->
        <div class="d-flex justify-content-between">
          <b-col md="6">
            <p>{{ $t('banners.firstBanner') }}</p>
            <b-form-group :label="$t('global.title')"
                          label-for="title1_en">
              <b-form-input id="title1_en" v-model="banner_first.title1_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link1_en">
              <b-form-input id="link1_en" v-model="banner_first.link1_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.shortDescription')"
                          label-for="description1_en">
              <b-form-textarea id="description1_en" v-model="banner_first.shortDescription1_en"
                            placeholder=""/>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <p>{{ $t('banners.firstBannerInformation') }}</p>
            <b-form-group :label="$t('global.title')"
                          label-for="title2_en">
              <b-form-input id="title2_en" v-model="banner_second.title2_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.link')"
                          label-for="link2_en">
              <b-form-input id="link2_en" v-model="banner_second.link2_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group :label="$t('global.shortDescription')"
                          label-for="description2_en">
              <b-form-textarea id="description2_en" v-model="banner_second.shortDescription2_en"
                            placeholder=""/>
            </b-form-group>
          </b-col>
        </div>
      </b-tab>
    </b-tabs>
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
  BFormTextarea,
  BLink,
  BButton,
  BTabs,
  BTab,
  BCardBody,
  BCardTitle
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import ImageUpload from "@/views/apps/products/components/ImageUpload";

export default {
  name: "Banners",

  directives: {
    Ripple,
  },
  components: {
    ImageUpload,
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
    BFormTextarea,
    BFormFile,
    BCardBody,
    BCardTitle
  },
  data() {
    return {
      banner_first: {
        image1: "string",
        image1Mobile: "string",
        link1_ka: "string",
        link1_en: "string",
        title1_ka: "string",
        title1_en: "string",
        shortDescription1_ka: "string",
        shortDescription1_en: "string",
      },
      banner_second: {
        image2: "string",
        link2_ka: "string",
        link2_en: "string",
        title2_ka: "string",
        title2_en: "string",
        shortDescription2_ka: "string",
        shortDescription2_en: "string",
      },
      modalBanner: {},
      modalVisible: false,
      isEditing: false,
      staticEnvValue: ''
    }
  },
  mounted() {
    this.fetchBanners();
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  methods: {
    fetchBanners() {
      return store.dispatch('app-content/fetchBanners')
          .then((response) => {
            this.banner_first.image1 = {
              name: response.data.image1
            }
            this.banner_first.image1Mobile = {
              name: response.data.image1Mobile
            }
            this.banner_second.image2 = {
              name: response.data.image2
            }
            let banners_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let banners_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.banner_first.title1_ka = banners_ka ? banners_ka.title1 : ''
            this.banner_first.link1_ka = banners_ka ? banners_ka.link1 : ''
            this.banner_first.shortDescription1_ka = banners_ka ? banners_ka.shortDescription1 : ''
            this.banner_second.title2_ka = banners_ka ? banners_ka.title2 : ''
            this.banner_second.link2_ka = banners_ka ? banners_ka.link2 : ''
            this.banner_second.shortDescription2_ka = banners_ka ? banners_ka.shortDescription2 : ''

            this.banner_first.title1_en = banners_en ? banners_en.title1 : ''
            this.banner_first.link1_en = banners_en ? banners_en.link1 : ''
            this.banner_first.shortDescription1_en = banners_en ? banners_en.shortDescription1 : ''
            this.banner_second.title2_en = banners_en ? banners_en.title2 : ''
            this.banner_second.link2_en = banners_en ? banners_en.link2 : ''
            this.banner_second.shortDescription2_en = banners_en ? banners_en.shortDescription2 : ''
          })
    },
    openEditBannerModal() {
      this.modalVisible = true;
      this.isEditing = true
    },
    updateBanners() {
      let payload = {
        image1: this.banner_first.image1.name,
        image1Mobile: this.banner_first.image1Mobile.name,
        image2: this.banner_second.image2.name,
        translations: [{
          languageCode: 'ka',
          link1: this.banner_first.link1_ka,
          title1: this.banner_first.title1_ka,
          shortDescription1: this.banner_first.shortDescription1_ka,
          title2: this.banner_second.title2_ka,
          link2: this.banner_second.link2_ka,
          shortDescription2: this.banner_second.shortDescription2_ka,
        },
          {
            languageCode: 'en',
            link1: this.banner_first.link1_en,
            title1: this.banner_first.title1_en,
            shortDescription1: this.banner_first.shortDescription1_en,
            title2: this.banner_second.title2_en,
            link2: this.banner_second.link2_en,
            shortDescription2: this.banner_second.shortDescription2_en,
          }
        ]
      }
      return store.dispatch('app-content/updateBanners', payload)
          .then((response) => {
            this.toast('ბანერები წარმატებით შეიცვალა')
            this.fetchBanners();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    addImage1(name) {
      this.banner_first.image1 = {
        name: name
      }
    },
    addImage1Mobile(name) {
      this.banner_first.image1Mobile = {
        name: name
      }
    },
    addImage2(name) {
      this.banner_second.image2 = {
        name: name
      }
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
  }
  ,

  setup() {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)

    // UnRegister on leave
    // onUnmounted(() => {
    //   if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    // });
  }
  ,
}
</script>

<style scoped>

</style>
