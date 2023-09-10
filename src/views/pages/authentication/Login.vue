<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8"
             class="left-container d-none d-lg-flex
                   align-items-center justify-content-center p-5">
        <img src="../../../assets/images/icons/ebazaar.svg">
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4"
             class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8"
               md="6"
               lg="12"
               class="px-xl-2 mx-auto">
          <b-card-title class="mb-1 font-weight-bold" title-tag="h2">
            Welcome to eBazaar! 🍅
          </b-card-title>

          <b-alert v-if="false" variant="primary" show>
            <div class="alert-body font-small-2">
              <p>
                <small class="mr-50">
                  <span class="font-weight-bold">Admin:</span>
                  ebazaar@gmail.com | Ebazaar,2021!
                </small>
              </p>
            </div>
          </b-alert>

          <!-- form -->
          <validation-observer
              ref="loginForm"
              #default="{invalid}">
            <b-form
                class="auth-login-form mt-2"
                @submit.prevent="login">
              <!-- email -->
              <b-form-group
                  label="იმეილი/მომხმარებელი"
                  label-for="login-email">
                <validation-provider
                    #default="{ errors }"
                    name="Email"
                    vid="email"
                    rules="required">
                  <b-form-input
                      id="login-email"
                      v-model="userEmail"
                      :state="errors.length > 0 ? false:null"
                      name="login-email"
                      placeholder="john@example.com"/>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">პაროლი</label>
                  <b-link :to="{name:'auth-forgot-password'}">
                    <small>დაგავიწყდა პაროლი?</small>
                  </b-link>
                </div>
                <validation-provider
                    #default="{ errors }"
                    name="Password"
                    vid="password"
                    rules="required">
                  <b-input-group
                      class="input-group-merge"
                      :class="errors.length > 0 ? 'is-invalid':null">
                    <b-form-input
                        id="login-password"
                        v-model="password"
                        :state="errors.length > 0 ? false:null"
                        class="form-control-merge"
                        :type="passwordFieldType"
                        name="login-password"
                        placeholder="Password"/>
                    <b-input-group-append is-text>
                      <feather-icon
                          class="cursor-pointer"
                          :icon="passwordToggleIcon"
                          @click="togglePasswordVisibility"/>
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                  type="submit"
                  variant="primary"
                  block
                  :disabled="invalid">
                შესვლა
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable */

import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BCardTitle,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
} from 'bootstrap-vue'
import {required, email} from '@validations'
import {togglePasswordVisibility} from '@core/mixins/ui/forms'
import store from '@/store/index'
import {getHomeRouteForLoggedInUser} from '@/auth/utils'
import authModule from '../../../store/auth'
import {onUnmounted} from '@vue/composition-api'
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";


export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    PasswordInputField,
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BCardTitle,
    BForm,
    BButton,
    BAlert,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  setup() {

    const AUTH_MODULE_NAME = 'auth';

    // Register module
    if (!store.hasModule(AUTH_MODULE_NAME)) store.registerModule(AUTH_MODULE_NAME, authModule);

    // UnRegister on leave
    // onUnmounted(() => {
    //   if (store.hasModule(AUTH_MODULE_NAME)) store.unregisterModule(AUTH_MODULE_NAME)
    // })
  },
  data() {
    return {
      status: '',
      passwordFieldType: 'password',
      // password: 'Ebazaar,2021!',
      // userEmail: 'ebazaar@gmail.com',
      password: '',
      userEmail: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.$store.dispatch('auth/login', {
            identifier: this.userEmail,
            password: this.password
          }).then((response) => {
            let parsedToken = this.parseJwt(response.data.token.token)
            localStorage.setItem('role', parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            localStorage.setItem('userInfo', JSON.stringify(parsedToken));
            localStorage.setItem('lang', 'ka');
            localStorage.setItem('userData', '{"id":1,"fullName":"John Doe","username":"johndoe","avatar":"/img/13-small.d796bffd.png","email":"admin@demo.com","role":"admin","ability":[{"action":"manage","subject":"all"}],"extras":{"eCommerceCartItemsCount":5}}')
            this.$router.go();
          })
        }
      }).catch(err => {
        alert(err)
      })
    },

    parseJwt(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.auth-wrapper .brand-logo {
  justify-content: center;
  width: 150px;
}

.left-container img {
  max-width: 50%;
}
</style>
