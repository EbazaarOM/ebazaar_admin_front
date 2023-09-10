<template>
  <div>
    <horizontal-navbar :arrow-visible="true" @go-back="goBack"/>
    <b-col
        cols="12"
        class="mt-50 mb-2 d-flex justify-content-between align-items-center"
    >
      <h3>{{ notificationId ? $t('notification.edit') : $t('notification.add') }}</h3>
      <div>
        <b-button :disabled="!actionActive"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="mr-1"
                  @click="addNotification"
        >
          {{ notificationId ? $t('global.save') : $t('global.add') }}
        </b-button>
        <b-button v-if="notificationId"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="danger"
                  class="mr-1"
                  @click="confirmText"
        >
          {{ $t('global.delete') }}
        </b-button>
      </div>

    </b-col>
    <b-card>
      <b-row class="mb-2">
        <b-col v-if="false" md="6">
          <b-form-group
              label-for="userType">
            <label>{{ $t('global.link') }}</label>
            <b-form-input id="url" v-model="notificationLink" reset-button></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              label-for="userType">
            <label>{{ $t('notification.details') }}</label>
            <b-form-input id="additionalDetail" v-model="notificationDetail" reset-button></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col md="8">
          <b-tabs>
            <b-tab :title="$t('notification.text_ka')" active>
              <div v-if="false" class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-group
                      :label="$t('global.title')"
                      label-for="share-title_ka"
                      class="mb-2"
                  >
                    <b-form-input
                        class="mb-1"
                        id="faq-header_ka"
                        v-model="notificationInfo.header_ka"
                    />
                  </b-form-group>
                </b-col>
              </div>
              <div class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-textarea v-model="notificationInfo.body_ka"/>
                </b-col>
              </div>
            </b-tab>
            <b-tab :title="$t('notification.text_en')">
              <div v-if="false" class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-group
                      :label="$t('global.title')"
                      label-for="share-title_en"
                      class="mb-2"
                  >
                    <b-form-input
                        class="mb-1"
                        id="faq-header_en"
                        v-model="notificationInfo.header_en"
                    />
                  </b-form-group>
                </b-col>
              </div>
              <div class="m-0 d-flex justify-content-between">
                <b-col md="12" class="p-0">
                  <b-form-textarea v-model="notificationInfo.body_en"/>
                </b-col>
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BTab,
  BTabs,
  BFormGroup,
  BFormDatepicker,
  BFormTextarea,
  BButton,
  BRow,
  BCol,
  BFormInput
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import router from "@/router";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import {onUnmounted, ref} from "@vue/composition-api";
import {useInputImageRenderer} from "@core/comp-functions/forms/form-utils";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import UserListTable from "@/views/apps/user/users-list/UserListTable";
import Ripple from "vue-ripple-directive";

export default {
  name: "AddNotification",
  components: {
    UserListTable,
    HorizontalNavbar,
    BCard,
    BTab,
    BTabs,
    BFormGroup,
    BFormDatepicker,
    BFormTextarea,
    BButton,
    BRow,
    BCol,
    BFormInput,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      actionActive: true,
      notificationInfo: {
        body_ka: '',
        body_en: '',
        header_ka: '',
        header_en: '',
      },
      notificationId: '',
      notificationDate: '',
      notificationLink: '',
      notificationDetail: '',
    }
  },
  created() {
    this.notificationId = this.$route.params.id
  },
  methods: {
    fetchNotification() {
      store.dispatch('app-user/fetchNotification', {id: this.notificationId})
          .then((response) => {
            this.notificationDate = response.data.notificationDate
            this.userList = response.data.userList
            let notification_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let notification_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.notificationInfo.body_ka = notification_ka ? notification_ka.body : ''
            this.notificationInfo.body_en = notification_en ? notification_en.body : ''
          })
    },
    addNotification() {
      this.actionActive = false
      let payload = {
        url: this.notificationLink,
        additionalDetail: this.notificationDetail,
        translations: [
          {
            languageCode: 'ka',
            body: this.notificationInfo.body_ka,
            header: this.notificationInfo.header_ka,
          },
          {
            languageCode: 'en',
            body: this.notificationInfo.body_en,
            header: this.notificationInfo.header_en,
          },
        ]
      }
      store.dispatch('app-user/addNotification', payload)
          .then((response) => {
            this.toast('წარმატებით დაემატა')
            this.goBack()
          })
          .catch(() => {
            this.actionActive = true
          })
    },
    deleteNotification() {
      return store.dispatch('app-user/deleteNotification', {id: this.notificationId})
          .then(() => {
            this.toast('შეტყობინება წარმატებით წაიშალა')
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
          this.deleteNotification();
        }
      })
    },
    goBack() {
      router.push({name: 'notifications'})
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
    const USER_APP_STORE_MODULE_NAME = 'app-user';

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
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

<style scoped>
</style>
