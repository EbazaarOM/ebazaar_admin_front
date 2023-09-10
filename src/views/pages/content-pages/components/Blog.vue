<template>
  <div>
    <horizontal-navbar :arrow-visible="true" @go-back="goBack"/>
    <b-col
        cols="12"
        class="mt-50 mb-2 d-flex justify-content-between align-items-center"
    >
      <h3>{{ blogId ? blogTitle : $t('blog.addNew') }}</h3>
      <div>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  :disabled="!isValid || !actionActive"
                  variant="primary"
                  class="mr-1"
                  @click="addUpdateBlog"
        >
          {{ $t('global.save') }}
        </b-button>
        <b-button v-if="blogId"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="danger"
                  class="mr-1"
                  @click="confirmText"
        >
          {{ $t('global.delete') }}
        </b-button>
      </div>

    </b-col>
    <b-card
        class="blog-edit-wrapper"
    >
      <b-card
          class="profile-header mb-2"
          body-class="p-0"
      >

        <div class="d-flex align-items-center justify-content-start mb-1">
          <b-col md="3">
            <b-form-group class=""
                          label-for="userType"
>
              <v-select
                  id="published"
                  v-model="isPublished"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="publishBlogOptions"
                  class="w-100"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
              <label v-if="wasPublished">{{ $t('global.date') }}: {{ new Date(publishDate).toLocaleString() }}</label>

            </b-form-group>
          </b-col>
        </div>
      </b-card>
      <!-- form -->
      <validation-observer ref="refFormObserver">
        <b-form class="mt-2">
          <b-row>
            <b-col md="12" class="mb-2">
              <b-tabs>
                <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
                  <p><small class="text-danger">{{ $t('blog.titleAndSlagMandatory') }}</small></p>

                  <div class="m-0 d-flex justify-content-between">
                    <b-col md="4" class="p-0">

                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required"
>
                        <b-form-group
                            :label="$t('blog.blogTitle') + '*'"
                            label-for="faq-title_ka"
                            class="mb-2"
                        >
                          <b-form-input
                              id="faq-title_ka"
                              v-model="blogInfo.title_ka"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                              @input="debounceSearch_ka"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <b-col md="4">
                      <b-form-group
                          :label="$t('global.sharingTitle')"
                          label-for="faq-title_ka"
                          class="mb-2"
                      >
                        <b-form-input
                            id="share-title_ka"
                            v-model="blogInfo.share_title_ka"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="4" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required"
>
                        <b-form-group
                            :label="$t('global.slag') + '*'"
                            label-for="slug_ka"
                            class="mb-2"
                        >
                          <b-form-input
                              id="slug_ka"
                              v-model="blogInfo.slug_ka"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </div>
                  <div class="m-0 d-flex justify-content-between">
                    <b-col md="6" class="p-0 pr-1">
                      <b-form-group
                          :label="$t('global.shortDescription')"
                          label-for="short-description_ka"
                          class="mb-2"
                      >
                        <b-form-textarea
                            id="short-description_ka"
                            v-model="blogInfo.short_description_ka"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="6" class="p-0 pl-1">
                      <b-form-group
                          :label="$t('global.sharingDescription')"
                          label-for="share-description_ka"
                          class="mb-2"
                      >
                        <b-form-textarea
                            id="share-description_ka"
                            v-model="blogInfo.share_description_ka"
                        />
                      </b-form-group>
                    </b-col>
                  </div>

                  <!-- Form: Description -->
                  <text-editor v-if="blogInfo.description_ka !== null" :editor="blogInfo.description_ka" @update="updateValue_ka"/>
                </b-tab>
                <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                  <p><small class="text-danger">{{ $t('blog.titleAndSlagMandatory') }}</small></p>
                  <div class="m-0 d-flex justify-content-between">
                    <b-col md="4" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required"
>
                        <b-form-group
                            :label="$t('blog.blogTitle') + '*'"
                            label-for="faq-title_en"
                            class="mb-2"
                        >
                          <b-form-input
                              id="faq-title_en"
                              v-model="blogInfo.title_en"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                              @input="debounceSearch_en"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col md="4">
                      <b-form-group
                          :label="$t('global.sharingTitle')"
                          label-for="faq-title_en"
                          class="mb-2"
                      >
                        <b-form-input
                            id="share-title_en"
                            v-model="blogInfo.share_title_en"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="4" class="p-0">
                      <validation-provider v-slot="{ errors, valid, dirty }"
                                           name="Commercial Name"
                                           rules="required"
>
                        <b-form-group
                            :label="$t('global.slag') + '*'"
                            label-for="slug_en"
                            class="mb-2"
                        >
                          <b-form-input
                              id="slug_en"
                              v-model="blogInfo.slug_en"
                              :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </div>

                  <div class="m-0 d-flex justify-content-between">
                    <b-col md="6" class="p-0 pr-1">
                      <b-form-group
                          :label="$t('global.shortDescription')"
                          label-for="short-description_en"
                          class="mb-2"
                      >
                        <b-form-textarea
                            id="short-description_en"
                            v-model="blogInfo.short_description_en"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col md="6" class="p-0 pl-1">
                      <b-form-group
                          :label="$t('global.sharingDescription')"
                          label-for="share-description_en"
                          class="mb-2"
                      >
                        <b-form-textarea
                            id="share-description_en"
                            v-model="blogInfo.share_description_en"
                        />
                      </b-form-group>
                    </b-col>
                  </div>
                  <!-- Form: Description -->
                  <text-editor v-if="blogInfo.description_en !== null" :editor="blogInfo.description_en" @update="updateValue_en"/>

                </b-tab>
              </b-tabs>
            </b-col>
            <!-- outer image-->
            <b-col
                cols="12"
                class="mb-2"
            >
              <div class="border rounded p-2">
                <h4 class="mb-1">
                  {{ $t('blog.homepagePicture') }}
                </h4>
                <template v-if="image.name">
                  <p class="mt-1 mb-1">
                    {{ $t('uploadImage.uploadedPicture') }}:
                  </p>
                  <div class="image-wrapper">
                    <div class="">
                      <img class="mw-100" :src="staticEnvValue + `/` + image.name">
                    </div>
                  </div>
                </template>
                <image-upload id="image"
                              key="image"
                              ref="image"
                              store="app-content"
                              url="cropImage"
                              module="contentStoreModule"
                              :required="true"
                              :on-crop="addOuterImage" :x="765" :y="447"
/>
              </div>
            </b-col>

            <!-- cover image-->
            <b-col
                cols="12"
                class="mb-2"
            >
              <div class="border rounded p-2">
                <h4 class="mb-1">
                  {{ $t('blog.coverPhoto') }}
                </h4>
                <template v-if="coverImage.name">
                  <p class="mt-1 mb-1">
                    {{ $t('uploadImage.uploadedPicture') }}:
                  </p>
                  <div class="image-wrapper">
                    <div class="">
                      <img class="mw-100" :src="staticEnvValue + `/` + coverImage.name">
                    </div>
                  </div>
                </template>
                <image-upload id="cover_image"
                              key="cover_image"
                              ref="cover_image"
                              store="app-content"
                              url="cropImage"
                              module="contentStoreModule"
                              :on-crop="addCoverImage" :x="1560" :y="318"
/>
              </div>
            </b-col>

            <!-- share image-->
            <b-col
                cols="12"
                class="mb-2"
            >
              <div class="border rounded p-2">
                <h4 class="mb-1">
                  {{ $t('blog.sharingPhoto') }}
                </h4>
                <template v-if="shareImage.name">
                  <p class="mt-1 mb-1">
                    {{ $t('uploadImage.uploadedPicture') }}:
                  </p>
                  <div class="image-wrapper">
                    <div class="">
                      <img class="mw-100" :src="staticEnvValue + `/` + shareImage.name">
                    </div>
                  </div>
                </template>
                <image-upload id="share_image"
                              store="app-content"
                              url="cropImage"
                              module="contentStoreModule"
                              :on-crop="addShareImage" :x="1200" :y="628"
/>
              </div>
            </b-col>

            <!-- gallery-->
            <b-col
                cols="12"
                class="mb-2"
            >
              <div class="border rounded p-2">
                <h4 class="mb-1">
                  {{ $t('blog.pictureGallery') }}
                </h4>
                <div class="upload-images-container">
                  <draggable v-model="gallery" ghost-class="ghost">
                    <transition-group type="transition" name="flip-list">
                      <div v-for="(img, index) in gallery" :key="img + index"
                           class="image-wrapper mb-2 justify-content-start"
>
                        <p>#{{ index + 1 }}</p>
                        <div class="">
                          <img :src="staticEnvValue + `/` + img">
                        </div>
                        <div class="">
                          <b-button class="btn-icon" variant="flat-danger" @click="removeGalleryImage(img, true)">
                            <feather-icon size="16" icon="TrashIcon"/>
                          </b-button>
                        </div>
                      </div>
                    </transition-group>
                  </draggable>
                </div>
                <ImageUpload id="gallery_image"
                             store="app-content"
                             url="cropImage"
                             module="contentStoreModule"
                             :on-crop="addGalleryImage" :x="765" :y="447"
/>
                <template v-if="gallery.length">
                  <p class="mt-1 mb-1">
                    {{ $t('uploadImage.uploadedPicture') }}:
                  </p>
                  <div class="upload-images-container">
                    <draggable v-model="newGallery" ghost-class="ghost">
                      <transition-group type="transition" name="flip-list">
                        <div v-for="(img, index) in newGallery" :key="img.name + index"
                             class="image-wrapper justify-content-start mb-1"
>
                          <p>#{{ index + 1 }}</p>
                          <div class="">
                            <img :src="staticEnvValue + `/` + img.name">
                          </div>
                          <div class="">
                            <b-button class="btn-icon" variant="flat-danger" @click="removeGalleryImage(img, false)">
                              <feather-icon size="16" icon="TrashIcon"/>
                            </b-button>
                          </div>
                        </div>
                      </transition-group>
                    </draggable>
                  </div>
                </template>
              </div>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <!--/ form -->
    </b-card>
    <b-col
        cols="12"
        class="mt-50 mb-2 d-flex justify-content-between align-items-center"
    >
      <div/>
      <div>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  :disabled="!isValid || !actionActive"
                  variant="primary"
                  class="mr-1"
                  @click="addUpdateBlog"
        >
          {{ blogId ? 'შენახვა' : 'შენახვა' }}
        </b-button>
        <b-button v-if="blogId"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="danger"
                  class="mr-1"
                  @click="confirmText"
        >
          წაშლა
        </b-button>
      </div>

    </b-col>
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
  BFormTextarea
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {useInputImageRenderer} from '@core/comp-functions/forms/form-utils'
import {onUnmounted, ref} from '@vue/composition-api'
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import draggable from 'vuedraggable';
import {ValidationObserver, ValidationProvider} from "vee-validate";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    ImageUpload,
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
    BFormGroup,
    BFormInput,
    BFormFile,
    BTabs,
    BTab,
    BFormTextarea,
    vSelect,
    draggable,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      actionActive: true,
      staticEnvValue: '',
      blogEdit: {},
      blogFile: null,
      blogId: '',
      coverImage: {},
      shareImage: {},
      image: {},
      gallery: [],
      newGallery: [],
      publishDate: '',
      isPublished: false,
      wasPublished: false,
      blogInfo: {
        title_en: '',
        title_ka: '',
        share_title_ka: '',
        share_title_en: '',
        description_ka: null,
        description_en: null,
        short_description_ka: '',
        short_description_en: '',
        share_description_ka: '',
        share_description_en: '',
        slug_ka: '',
        slug_en: '',
      },
      description_ka: '',
      description_en: '',
      typing: '',
      blogTitle: '',
      publishBlogOptions: [
        {id: true, title: this.$i18n.t('global.published')},
        {id: false, title: this.$i18n.t('global.unpublished')},
      ],
      categoryOption: ['Fashion', 'Food', 'Gaming', 'Quote', 'Video'],
      statusOption: ['Published', 'Pending', 'Draft'],
    }
  },
  created() {
    this.blogId = this.$route.params.id
    if (!this.blogId) {
      this.blogInfo.description_ka = '';
      this.blogInfo.description_en = '';
    } else {
      this.fetchBlog(this.blogId)
    }
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  computed: {
    isValid() {
      return this.blogInfo.title_ka !== ''
          && this.blogInfo.title_en !== ''
          && this.blogInfo.slug_ka !== ''
          && this.blogInfo.slug_en !== ''
    },
  },
  methods: {
    updateValue_ka(description) {
      this.description_ka = description
    },
    updateValue_en(description) {
      this.description_en = description
    },
    fetchBlog() {
      store.dispatch('app-content/fetchBlogs', {id: this.blogId})
          .then((response) => {
            this.publishDate = response.data.publishDate
            this.wasPublished = response.data.publishDate !== null
            this.isPublished = this.publishBlogOptions.find(item => item.id === (this.publishDate !== null))
            this.image = {
              name: response.data.image
            }
            this.coverImage = {
              name: response.data.coverImage
            }
            this.shareImage = {
              name: response.data.shareImage
            }
            this.gallery = response.data.gallery
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            if(this.$route.params.lang === 'en') this.blogTitle = content_en ? content_en.title : ''
            else this.blogTitle = content_ka ? content_ka.title : ''
            this.blogInfo.title_ka = content_ka ? content_ka.title : ''
            this.blogInfo.share_title_ka = content_ka ? content_ka.shareTitle : ''
            this.blogInfo.description_ka = content_ka ? content_ka.description : ''
            this.blogInfo.short_description_ka = content_ka ? content_ka.shortDescription : ''
            this.blogInfo.share_description_ka = content_ka ? content_ka.shareDescription : ''
            this.blogInfo.slug_ka = content_ka ? content_ka.slug : ''

            this.blogInfo.title_en = content_en ? content_en.title : ''
            this.blogInfo.share_title_en = content_en ? content_en.shareTitle : ''
            this.blogInfo.description_en = content_en ? content_en.description : ''
            this.blogInfo.short_description_en = content_en ? content_en.shortDescription : ''
            this.blogInfo.share_description_en = content_en ? content_en.shareDescription : ''
            this.blogInfo.slug_en = content_en ? content_en.slug : ''
          })
    },
    addUpdateBlog() {
      this.actionActive = false
      let payload = {
        id: this.blogId,
        image: this.image.name,
        coverImage: this.coverImage.name,
        shareImage: this.shareImage.name,
        gallery: this.gallery.concat(this.newGallery.map(item => item.name)),
        publishDate: this.isPublished.id ? new Date().toISOString() : null,
        translations: [
          {
            languageCode: 'ka',
            title: this.blogInfo.title_ka,
            slug: this.blogInfo.slug_ka,
            description: this.description_ka ? this.description_ka : '',
            shortDescription: this.blogInfo.short_description_ka,
            shareTitle: this.blogInfo.share_title_ka,
            shareDescription: this.blogInfo.share_description_ka
          },
          {
            languageCode: 'en',
            title: this.blogInfo.title_en,
            slug: this.blogInfo.slug_en,
            description: this.description_en ? this.description_en : '',
            shortDescription: this.blogInfo.short_description_en,
            shareTitle: this.blogInfo.share_title_en,
            shareDescription: this.blogInfo.share_description_en
          },
        ]
      }
      let url = this.blogId ? 'updateBlog' : 'addBlog'
      store.dispatch('app-content/' + url, payload)
          .then((response) => {
            this.blogId = response.data.id
            this.newGallery = []
            this.actionActive = true
            this.fetchBlog(this.blogId)
            this.toast('წარმატებით განახლდა')
          })
          .catch(() => {
            this.actionActive = true
          })
    },
    deleteBlog() {
      return store.dispatch('app-content/deleteBlog', {id: this.blogId})
          .then((response) => {
            this.toast('შაბლონური გვერდი წარმატებით წაიშალა')
            this.goBack()
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    confirmText() {
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
          this.deleteBlog();
        }
      })
    },
    addCoverImage(name) {
      this.coverImage = {
        name: name
      }
    },
    addShareImage(name) {
      this.shareImage = {
        name: name
      }
    },
    addGalleryImage(name) {
      this.newGallery.push({
        enabled: true,
        enableShare: true,
        name: name,
      });
    },
    addOuterImage(name) {
      this.image = {
        name: name
      }
    },
    removeGalleryImage(img, isOldGallery) {
      if (isOldGallery) {
        let index = this.gallery.indexOf(img);
        this.gallery.splice(index, 1);
      } else {
        let index = this.newGallery.indexOf(img);
        this.newGallery.splice(index, 1);
      }

    },
    debounceSearch_ka() {
      this.blogInfo.slug_ka = null
      this.typing = 'You are typing'
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.typing = null
        store.dispatch('app-content/getBlogSlug', {text: this.blogInfo.title_ka, languageCode: 'ka', id: this.blogId})
            .then(response => {
              this.blogInfo.slug_ka = response.data
            })
      }, 600)
    },
    debounceSearch_en() {
      this.blogInfo.slug_en = null
      this.typing = 'You are typing'
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.typing = null
        store.dispatch('app-content/getBlogSlug', {text: this.blogInfo.title_en, languageCode: 'en', id: this.blogId})
            .then(response => {
              this.blogInfo.slug_en = response.data
            })
      }, 600)
    },
    goBack() {
      router.push({name: 'blogs'})
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

    const refPreviewEl = ref(null)
    const refInputEl = ref(null)
    const refCoverInputEl = ref(null)
    const previewEl = ref(null)
    let profilePicture = ref(null)
    let coverImage = ref(null)
    let coverImageFile = ref(null)
    let profilePictureFile = ref(null)

    const coverImageRenderer = useInputImageRenderer(refCoverInputEl, (base64, file) => {
      // eslint-disable-next-line no-param-reassign
      // console.log("cover inputImageRenderer", base64, file)
      coverImage.value = base64
      coverImageFile.value = file
    }).inputImageRenderer


    const profileImageRenderer = useInputImageRenderer(refInputEl, (base64, file) => {
      // eslint-disable-next-line no-param-reassign
      // console.log("profile inputImageRenderer", base64, file)
      profilePicture.value = base64
      profilePictureFile.value = file
    }).inputImageRenderer

    const {inputImageRenderer} = useInputImageRenderer(refInputEl, base64 => {
      refPreviewEl.value.src = base64
    })

    return {
      refInputEl,
      refPreviewEl,
      inputImageRenderer,
      profileImageRenderer,
      coverImageRenderer,
      previewEl,
      profilePicture,
      coverImage,
      refCoverInputEl,
      profilePictureFile,
      coverImageFile,
    }
  },
}
</script>

<style lang="scss">

.upload-images-container {
  p {
    margin-bottom: 0.2rem;
    text-align: center;
  }

  .image-wrapper {
    max-width: 100%;
    max-height: 350px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: grab;
  }

  img {
    width: 300px;
    margin: 0 1rem;
    height: auto;
  }
}

.blog-editor {
  .ql-editor {
    max-height: 500px;
    overflow-y: scroll;

    h4 {
      font-size: 24px;
    }

    h5 {
      font-size: 22px;
    }

    h6 {
      font-size: 20px;
    }
  }
}
</style>
