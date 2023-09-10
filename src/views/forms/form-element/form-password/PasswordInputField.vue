<template>
  <div>
    <b-form class="reset-password">

      <!-- Password -->
      <b-form-group v-if="current">
        <div class="d-flex justify-content-between">
          <label for="current-password">{{ $t('password.currentPassword') }}</label>
        </div>
        <validation-provider
            #default="{ errors }"
            name="Password"
            vid="password"
            rules="required">
          <b-input-group
              class="input-group-merge"
              :class="errors.length > 0 ? 'is-invalid' : null">
            <b-form-input
                id="current-password"
                v-model="current_password"
                :state="validate_password(current_password)"
                class="form-control-merge"
                :type="passwordFieldType"
                name="login-password"/>
            <b-input-group-append is-text>
              <feather-icon
                  class="cursor-pointer"
                  :icon="passwordToggleIcon"
                  @click="togglePasswordVisibility"/>
            </b-input-group-append>
          </b-input-group>
          <small v-if="validate_password(current_password) !== null & !validate_password(current_password)"
                 class="text-danger">
           {{ $t('password.passwordValidation') }}
          </small>
        </validation-provider>
      </b-form-group>

      <!-- New Password -->
      <b-form-group>
        <div class="d-flex justify-content-between">
          <label for="new-password">{{ $t('password.newPassword') }}</label>
        </div>
        <validation-provider
            #default="{ errors }"
            name="Password"
            vid="password"
            rules="required">
          <b-input-group
              class="input-group-merge"
              :class="errors.length > 0 ? 'is-invalid' : null">
            <b-form-input
                id="new-password"
                v-model="password"
                :state="validate_password(password)"
                class="form-control-merge"
                :type="passwordFieldType"
                name="login-password"/>
            <b-input-group-append is-text>
              <feather-icon
                  class="cursor-pointer"
                  :icon="passwordToggleIcon"
                  @click="togglePasswordVisibility"/>
            </b-input-group-append>
          </b-input-group>
          <small v-if="validate_password(password) !== null && !validate_password(password)" class="text-danger">
            {{ $t('password.passwordValidation') }}
          </small>
        </validation-provider>
      </b-form-group>

      <!-- New Password -->
      <b-form-group class="mb-0">
        <div class="d-flex justify-content-between mb-0">
          <label for="confirm-password">{{ $t('password.repeatPassword') }}</label>
        </div>
        <validation-provider
            #default="{ errors }"
            name="Password"
            vid="password"
            rules="required">
          <b-input-group
              class="input-group-merge"
              :class="errors.length > 0 ? 'is-invalid' : null">
            <b-form-input
                id="confirm-password"
                v-model="confirm_password"
                :state="validate_confirm_password"
                class="form-control-merge"
                :type="passwordFieldType"
                name="login-password"/>
            <b-input-group-append is-text>
              <feather-icon
                  class="cursor-pointer"
                  :icon="passwordToggleIcon"
                  @click="togglePasswordVisibility"/>
            </b-input-group-append>
          </b-input-group>
        </validation-provider>
      </b-form-group>

      <!-- Confirm Password -->
      <validation-provider name="Confirm Password" rules="required|confirmed:password">
        <b-form-group label-for="confirm_password">
          <b-form-input id="confirm_password" v-show="false"
                        v-model="confirm_password"
                        type="password"
                        :state="validate_confirm_password"
                        trim/>
          <b-form-invalid-feedback for="confirmPassword">
            {{ $t('password.passwordsNotMatch') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </b-form>

    <div class="mt-3 d-flex justify-content-between align-items-center">
      <b-button variant="primary" class="save-changes mb-3"
                :disabled="!is_valid"
                @click="$emit('change', {current: current_password, password: password, confirm_password: confirm_password})">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('header.changePassword') }}</span>
      </b-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {ValidationObserver, ValidationProvider} from "vee-validate";
import {togglePasswordVisibility} from '@core/mixins/ui/forms'
import {required, email} from '@validations'
import {
  BAlert,
  BButton,
  BCardTitle,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BLink,
  BRow,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import store from "@/store";

export default {
  name: "PasswordInputField",
  mixins: [togglePasswordVisibility],
  components: {
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
    BFormInvalidFeedback,
    ValidationProvider,
    ValidationObserver,
  },
  props: ['current', 'title'],
  data() {
    return {
      status: '',
      passwordFieldType: 'password',
      current_password: '',
      password: '',
      confirm_password: '',

      // validation rules
      required,
    }
  },

  methods: {
    validate_password(password) {
      if (password.length === 0) return null
      return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$').test(password)
    },
  },

  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },

    validate_confirm_password() {
      if (this.confirm_password.length === 0) return null
      return this.confirm_password === this.password
    },

    is_valid() {
      if (this.current) return this.validate_password(this.current_password) && this.validate_password(this.password) && this.validate_confirm_password;
      return this.validate_password(this.password) && this.validate_confirm_password;
    },
  },
}
</script>

<style scoped>

</style>
