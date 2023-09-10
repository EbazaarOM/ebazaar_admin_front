<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Left Text-->
      <b-col
          lg="8"
          class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
              fluid
              :src="imgUrl"
              alt="Forgot password V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Forgot password-->
      <b-col
          lg="4"
          class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
            sm="8"
            md="6"
            lg="12"
            class="px-xl-2 mx-auto"
        >
          <b-card-title class="mb-1">
            დაგავიწყდა პაროლი? 🔒
          </b-card-title>
          <b-card-text class="mb-2">
            შეიყვანე მომხმარებლის სახელი
          </b-card-text>

          <!-- form -->
          <validation-observer ref="simpleRules">
            <b-form
                class="auth-forgot-password-form mt-2"
                @submit.prevent="validationForm"
            >
              <b-form-group
                  label="მომხმარებლის სახელი"
                  label-for="forgot-password-email"
              >
                <validation-provider
                    #default="{ errors }"
                    name="Email"
                    rules="required"
                >
                  <b-form-input
                      id="forgot-password-email"
                      v-model="username"
                      :disabled="codeVisible"
                      :state="errors.length > 0 ? false:null"
                      name="forgot-password-email"
                      placeholder=""
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group v-if="codeVisible"
                            label="კოდი"
                            label-for="requested-code"
              >
                <validation-provider
                    #default="{ errors }"
                    name="Email"
                    rules="required"
                >
                  <b-input-group>
                    <b-form-input
                        id="requested-code"
                        v-model="requestedCode"
                        :state="errors.length > 0 ? false:null"
                        name="requested-code"
                        placeholder=""
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                          class="cursor-pointer"
                          icon="RefreshCcwIcon"
                          @click="requestCode"/>
                    </b-input-group-append>
                  </b-input-group>
                  <small>მიღებული კოდი ვალიდურია 3 წუთის განმავლობაში</small>
                </validation-provider>
              </b-form-group>

              <b-button v-if="!codeVisible"
                        type="submit"
                        variant="primary"
                        block
                        @click="requestCode"
              >
                <span>კოდის გაგზავნა</span>
              </b-button>

              <b-button v-else
                        type="submit"
                        variant="primary"
                        block
                        @click="confirmCode"
              >
                <span>კოდის ვალიდაცია</span>
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <b-link :to="{name:'auth-login'}">
              <feather-icon icon="ChevronLeftIcon"/>
              ავტორიზაციის გვერდზე დაბრუნება
            </b-link>
          </p>
        </b-col>
      </b-col>
      <!-- /Forgot password-->
    </b-row>

    <b-modal id="reset-password-modal"
             ref="reset-password-modal"
             size="md"
             class="p-3 pb-1"
             hide-header
             hide-footer
             centered>

      <div class="modal-custom-header d-flex align-items-center justify-content-between">
        <h4>პაროლის შეცვლა</h4>

        <b-button variant="flat-secondary" class="mr-1 btn-icon" size="lg" @click="hideResetPasswordModal">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>

      <password-input-field :current="false" @change="resetPassword"></password-input-field>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable global-require */
/* eslint-disable */

import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {
  BRow,
  BCol,
  BLink,
  BCardTitle,
  BCardText,
  BImg,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BInputGroup,
  BInputGroupAppend,
  BAlert,
  BProgress,
} from 'bootstrap-vue'
import {required, email} from '@validations'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import authModule from "@/store/auth";
import {onUnmounted} from "@vue/composition-api";
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";

export default {
  components: {
    PasswordInputField,
    BRow,
    BCol,
    BLink,
    BImg,
    BForm,
    BButton,
    BFormGroup,
    BInputGroup,
    BFormInput,
    BCardTitle,
    BCardText,
    BAlert,
    BProgress,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      username: '',
      requestedCode: '',
      codeVisible: false,
      token: '',
      dismissSecs: 180,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      sideImg: require('@/assets/images/pages/forgot-password-v2.svg'),
      // validation
      required,
      email,
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/forgot-password-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
        }
      })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    requestCode() {
      this.$store.dispatch('auth/requestCode', {
        identifier: this.username
      }).then((response) => {
        if (response.data.success) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'თქვენ მიიღებთ კოდს მითითებულ ტელეფონის ნომერზე.',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
          this.showDismissibleAlert = true
          this.codeVisible = true
        }
      })
    },
    confirmCode() {
      this.$store.dispatch('auth/confirmCode', {
        identifier: this.username,
        code: this.requestedCode
      }).then((response) => {
        if (response.data.success) {
          this.token = response.data.token
          this.showResetPasswordModal();
        }
      })
    },
    resetPassword(payload) {
      console.log(payload)
      this.$store.dispatch('auth/resetPassword', {
        identifier: this.username,
        token: this.token,
        newPassword: payload.password,
        confirmNewPassword: payload.confirm_password,
      }).then(() => {
        this.hideResetPasswordModal();
        this.$swal({
          icon: 'success',
          title: 'პაროლი წარმატებით შეიცვალა!',
          text: ``,
          customClass: {
            confirmButton: 'btn btn-success',
          },
        }).then(() => {
          this.$router.push({name: 'auth-login'})
        })
      })
    },
    showResetPasswordModal() {
      this.$refs['reset-password-modal'].show();
    },
    hideResetPasswordModal() {
      this.$refs['reset-password-modal'].hide();
    },
  },

  setup() {

    const AUTH_MODULE_NAME = 'auth';

    // Register module
    if (!store.hasModule(AUTH_MODULE_NAME)) store.registerModule(AUTH_MODULE_NAME, authModule);

    // UnRegister on leave
    // onUnmounted(() => {
    //   if (store.hasModule(AUTH_MODULE_NAME)) store.unregisterModule(AUTH_MODULE_NAME)
    // })
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
