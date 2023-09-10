<template>
  <div>
    <horizontal-navbar @go-back="goBack" :arrow-visible="true"/>

    <!-- form -->
    <validation-observer ref="refFormObserver">
      <b-form class="mt-2 mb-2">
        <b-row>
          <b-col
              cols="12"
              class="mt-50 mb-2 d-flex justify-content-between align-items-center"
          >
            <h3>{{ templatePageId ? pageTitle : $t('global.add')  }}</h3>
            <div>
              <b-button :disabled="!isValid"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="mr-1"
                  @click="addUpdate"
              >
                {{ $t('global.save') }}
              </b-button>
              <b-button v-if="templatePageId"
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        variant="danger"
                        class="mr-1"
                        @click="confirmText"
              >
                {{ $t('global.delete')  }}
              </b-button>
            </div>

          </b-col>

          <b-col md="12">
            <b-card>
              <!-- Header: Description -->
              <div class="d-flex mb-2 align-items-center">

                <b-col cols="12"
                       md="4"
                       class="p-0 mb-md-0">
                  <b-form-group class="mb-0"
                                label-for="userType">
                    <label>{{ $t('templatePages.publishingDate') }}</label>
                    <v-select
                        id="published"
                        v-model="isPublished"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        :options="publishPageOptions"
                        class="w-100"
                        label="title"
                    >
                      <template #option="{ title }">
                        <span> {{ title }}</span>
                      </template>
                    </v-select>
                    <label v-if="wasPublished">{{ $t('global.date')  }}: {{ new Date(publishDate).toLocaleString() }}</label>

                  </b-form-group>
                </b-col>
              </div>

              <!-- Header: Description -->
              <div class="d-flex mb-2 align-items-center">

                <b-col cols="12"
                       md="4"
                       class="p-0 mb-md-0">
                  <b-form-group class="mb-0"
                                label-for="userType">
                    <label>{{ $t('templatePages.typeOfPage')  }}</label>
                    <v-select
                        id="existed_page"
                        v-model="pageType"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        :options="typeOptions"
                        class="w-100"
                        label="title"
                    >
                      <template #option="{ title }">
                        <span> {{ title }}</span>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="12"
                       md="4"
                       class="mb-md-0">
                  <b-form-group class="mb-0"
                                label-for="userType">
                    <label>{{ $t('templatePages.categoryOfPage')  }}</label>
                    <v-select
                        id="category"
                        v-model="category"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        :options="categoriesList"
                        class="w-100"
                        label="title"
                    >
                      <template #option="{ title }">
                        <span> {{ title }}</span>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col v-if="page_exists"
                       cols="12"
                       md="4"
                       class="mr-1 p-0 mb-md-0">
                  <b-form-group
                      :label="$t('templatePages.localLink') "
                      label-for="local_path"
                      class="mb-0"
                  >
                    <b-form-input
                        id="local_path"
                        v-model="localPath"
                    />
                  </b-form-group>
                </b-col>
              </div>

              <b-tabs>
                <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
                  <p><small class="text-danger">{{ $t('templatePages.titleAndSlagMandatory') }}</small></p>
                  <div class="m-0 d-flex justify-content-between">
                    <b-col :md="page_exists ? '6' : '4'" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required">
                        <b-form-group
                            :label="$t('global.pageTitle')"
                            label-for="faq-title_ka"
                            class="mb-2"
                        >
                          <b-form-input
                              id="faq-title_ka"
                              v-model="pageInfo.title_ka"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                              @input="debounceSearch_ka"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col :md="page_exists ? '6' : '4'">
                      <b-form-group
                          :label="$t('global.sharingTitle')"
                          label-for="faq-title_ka"
                          class="mb-2"
                      >
                        <b-form-input
                            id="share-title_ka"
                            v-model="pageInfo.share_title_ka"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col v-if="!page_exists" md="4" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required">
                        <b-form-group
                            :label="$t('global.slag')"
                            label-for="slug_ka"
                            class="mb-2"
                        >
                          <b-form-input
                              id="slug_ka"
                              v-model="pageInfo.slug_ka"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </div>
                  <b-form-group
                      :label="$t('global.sharingDescription')"
                      label-for="share-description_ka"
                      class="mb-2"
                  >
                    <b-form-textarea
                        id="share-description_ka"
                        v-model="pageInfo.share_description_ka"
                    />
                  </b-form-group>
                  <!-- Form: Description -->
                  <text-editor v-if="!page_exists && pageInfo.description_ka !== null"
                               id="page_description_ka"
                               :editor="pageInfo.description_ka"
                               @update="updateDescriptionValue_ka"/>
                </b-tab>
                <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                  <p><small class="text-danger">{{ $t('templatePages.titleAndSlagMandatory') }}</small></p>
                  <div class="m-0 d-flex justify-content-between">
                    <b-col :md="page_exists ? '6' : '4'" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required">
                        <b-form-group
                            :label="$t('global.pageTitle')"
                            label-for="faq-title_en"
                            class="mb-2"
                        >
                          <b-form-input
                              id="faq-title_en"
                              v-model="pageInfo.title_en"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                              @input="debounceSearch_en"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col :md="page_exists ? '6' : '4'">
                      <b-form-group
                          :label="$t('global.sharingTitle')"
                          label-for="faq-title_en"
                          class="mb-2"
                      >
                        <b-form-input
                            id="share-title_en"
                            v-model="pageInfo.share_title_en"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col v-if="!page_exists" md="4" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required">
                        <b-form-group
                            :label="$t('global.slag')"
                            label-for="slug_en"
                            class="mb-2"
                        >
                          <b-form-input
                              id="slug_en"
                              v-model="pageInfo.slug_en"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </div>

                  <b-form-group
                      :label="$t('global.sharingDescription')"
                      label-for="share-description_en"
                      class="mb-2"
                  >
                    <b-form-textarea
                        id="share-description_en"
                        v-model="pageInfo.share_description_en"
                    />
                  </b-form-group>
                  <!-- Form: Description -->
                  <text-editor v-if="!page_exists && pageInfo.description_en !== null"
                               id="page_description_en"
                               :editor="pageInfo.description_en"
                               @update="updateDescriptionValue_en"/>
                </b-tab>
              </b-tabs>

            </b-card>
          </b-col>

          <!-- share image -->
          <b-col
              cols="12"
              class="mb-2"
          >
            <b-card>
              <div>
                <h4 class="mb-1">
                  {{ $t('global.sharingImage') }}
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
                <image-upload id="template_page_image"
                              store="app-content"
                              url="cropImage"
                              module="contentStoreModule"
                              :on-crop="addImage" :x="1200" :y="628"/>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
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
  BFormTextarea,
  BLink,
  BButton,
  BTabs,
  BTab,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {useInputImageRenderer} from '@core/comp-functions/forms/form-utils'
import {onUnmounted, ref} from '@vue/composition-api'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import TeamMember from "@/views/pages/content-pages/components/TeamMember";
import TeamMemberModal from "@/views/pages/content-pages/components/TeamMemberModal";
import router from "@/router";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    ImageUpload,
    FormSelectStandard,
    TeamMemberModal,
    TeamMember,
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
    BFormTextarea,
    BFormFile,
    vSelect,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      pageInfo: {
        title_en: '',
        title_ka: '',
        share_title_ka: '',
        share_title_en: '',
        description_ka: null,
        description_en: null,
        share_description_ka: '',
        share_description_en: '',
        slug_ka: '',
        slug_en: '',
      },
      pageTitle: '',
      image: '',
      teamMembers: [],
      templatePageId: '',
      modalTeamMember: {},
      modalVisible: false,
      isEditing: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],         //bold, italic, underline, strikethrough
            [{'list': 'ordered'}, {'list': 'bullet'}],      //ordered list, unordered list
            [{'header': [4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            ['clean'],
            ['link', 'image', 'video'],
          ]
        }
      },
      localPath: '',
      pageType: {},
      typeOptions: [
        {id: 'exists', title: "არსებული გვერდი"},
        {id: 'not_exists', title: "შაბლონური გვერდი"},
      ],
      category: '',
      categoriesList: [
        {id: 'company', title: "კომპანია"},
        {id: 'information', title: "ინფორმაცია"},
      ],
      loader: false,
      isPublished: false,
      wasPublished: false,
      publishDate: '',
      publishPageOptions: [
        {id: true, title: 'გამოქვეყნებული'},
        {id: false, title: 'დამალული'},
      ],
      staticEnvValue: ''
    }
  },
  mounted() {
    this.templatePageId = this.$route.params.id
    if (this.templatePageId) this.fetchTemplatePage(this.templatePageId);
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  computed: {
    page_exists: function () {
      return this.pageType.id === 'exists'
    },
    isValid() {
      return this.pageInfo.title_ka !== ''
          && this.pageInfo.title_en !== ''
          && this.pageInfo.slug_ka !== ''
          && this.pageInfo.slug_en !== ''
    },
  },
  methods: {

    updateDescriptionValue_ka(description) {
      this.pageInfo.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.pageInfo.description_en = description
    },
    fetchTemplatePage(id) {
      store.dispatch('app-content/fetchTemplatePages', {id: id})
          .then((response) => {
            // this.pageInfo = response.data
            this.category = this.categoriesList.find(item => item.id === response.data.pageCategory)
            this.localPath = response.data.localPath;
            this.pageType = response.data.localPath !== ''
                ? this.typeOptions.find(option => option.id === 'exists')
                : this.typeOptions.find(option => option.id === 'not_exists')
            this.publishDate = response.data.publishDate
            this.wasPublished = response.data.publishDate !== null
            this.isPublished = this.publishPageOptions.find(item => item.id === (this.publishDate !== null))
            this.image = {
              name: response.data.shareImage
            }
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            if(this.$route.params.lang === 'en') this.pageTitle = content_en ? content_en.title : ''
            else this.pageTitle = content_ka ? content_ka.title : ''
            this.pageInfo.title_ka = content_ka ? content_ka.title : ''
            this.pageInfo.share_title_ka = content_ka ? content_ka.shareTitle : ''
            this.pageInfo.description_ka = content_ka ? content_ka.description : ''
            this.pageInfo.share_description_ka = content_ka ? content_ka.shareDescription : ''
            this.pageInfo.slug_ka = content_ka ? content_ka.slug : ''

            this.pageInfo.title_en = content_en ? content_en.title : ''
            this.pageInfo.share_title_en = content_en ? content_en.shareTitle : ''
            this.pageInfo.description_en = content_en ? content_en.description : ''
            this.pageInfo.share_description_en = content_en ? content_en.shareDescription : ''
            this.pageInfo.slug_en = content_en ? content_en.slug : ''
          })
    },
    addImage(name) {
      this.image = {
        name: name
      }
    },
    addUpdate() {
      let payload = {
        id: this.templatePageId,
        shareImage: this.image.name,
        localPath: this.page_exists ? this.localPath : '',
        pageCategory: this.category.id,
        publishDate: this.isPublished.id ? new Date().toISOString() : null,
        translations: [
          {
            languageCode: 'ka',
            title: this.pageInfo.title_ka,
            shareTitle: this.pageInfo.share_title_ka,
            description: this.pageInfo.description_ka ? this.pageInfo.description_ka : '',
            shareDescription: this.pageInfo.share_description_ka,
            slug: !this.page_exists ? this.pageInfo.slug_ka : '',
          },
          {
            languageCode: 'en',
            title: this.pageInfo.title_en,
            shareTitle: this.pageInfo.share_title_en,
            description: this.pageInfo.description_en ? this.pageInfo.description_en : '',
            shareDescription: this.pageInfo.share_description_en,
            slug: !this.page_exists ? this.pageInfo.slug_en : '',
          },
        ]
      }
      if (this.templatePageId) this.updateTemplatePage(payload);
      else this.addTemplatePage(payload)
    },
    updateTemplatePage(payload) {
      store.dispatch('app-content/updateTemplatePage', payload)
          .then((response) => {
            this.fetchTemplatePage(this.templatePageId)
            this.toast('წარმატებით განახლდა')
          })
    },
    addTemplatePage(payload) {
      return store.dispatch('app-content/addTemplatePage', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('შაბლონური გვერდი წარმატებით დაემატა')
            this.fetchTemplatePage(response.data.id);
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteTemplatePage() {
      return store.dispatch('app-content/deleteTemplatePage', {id: this.templatePageId})
          .then((response) => {
            // this.modalVisible = false;
            this.toast('შაბლონური გვერდი წარმატებით წაიშალა')
            // this.fetchTeamMembers();
            this.goBack()
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    confirmText(user) {
      this.$swal({
        title: 'დარწმუნებული ხართ რომ გინდათ წაშლა?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ',
        cancelButtonText: 'არა',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.deleteTemplatePage(user);
        }
      })
    },
    goBack() {
      router.push({name: 'template-pages'})
    },
    debounceSearch_ka() {
      this.pageInfo.slug_ka = null
      this.typing = 'You are typing'
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.typing = null
        store.dispatch('app-content/getTemplatePageSlug', {
          text: this.pageInfo.title_ka,
          languageCode: 'ka',
          id: this.templatePageId
        })
            .then(response => {
              this.pageInfo.slug_ka = response.data
            })
      }, 600)
    },
    debounceSearch_en() {
      this.pageInfo.slug_en = null
      this.typing = 'You are typing'
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.typing = null
        store.dispatch('app-content/getTemplatePageSlug', {
          text: this.pageInfo.title_en,
          languageCode: 'en',
          id: this.templatePageId
        })
            .then(response => {
              this.pageInfo.slug_en = response.data
            })
      }, 600)
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
