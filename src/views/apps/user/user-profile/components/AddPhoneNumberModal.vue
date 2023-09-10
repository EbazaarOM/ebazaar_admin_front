<template>
  <b-modal id="add-phone-number"
           ref="add-phone-number"
           :visible="isAddPhoneNumberModalActive"
           size="md"
           class="p-3 pb-1"
           hide-header
           hide-footer
           centered
           @change="(val) => $emit('update:is-add-address-modal-active', val)">

    <div class="modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ $t('global.add') }} {{$t('users.phoneNumber')}}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal()">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="reset-password">
      <!-- Phone Number -->
      <validation-provider
                           v-slot="{errors, valid, dirty }"
                           name="Phone Number"
                           :rules="'required'">
        <b-form-group
            :label="$t('users.phoneNumber')"
            label-for="phone_number">
          <b-form-input
              id="phone_number"
              v-model="phone"
              :state="dirty ? validate_phone_number : null"
              trim/>
        </b-form-group>
      </validation-provider>
    </b-form>

    <div class="mt-3 d-flex justify-content-between align-items-center">
      <b-button variant="primary" class="save-changes mb-3"
                :disabled="!validate_phone_number"
                @click="addPhoneNumber">
        <feather-icon icon="SaveIcon"
                      class="mr-50"/>
        <span class="align-middle">{{ $t('global.add') }}</span>
      </b-button>
    </div>
  </b-modal>
</template>

<script>
/* eslint-disable */
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
} from 'bootstrap-vue'
import vSelect from "vue-select";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import router from "@/router";

export default {
  name: "AddPhoneNumberModal",
  components: {
    BButton,
    vSelect,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    isAddPhoneNumberModalActive: {
      type: Boolean
    },
    isLegalEntity: {
      type: Boolean
    },
  },

  data() {
    return {
      phone: ''
    }
  },

  computed: {
    validate_phone_number() {
      if (this.isLegalEntity) return new RegExp('^[0-9]{9,10}$').test(this.phone)
      return new RegExp('^[0-9]{9}$').test(this.phone)
    },
  },

  methods: {
    addPhoneNumber() {
      this.$emit('add', this.phone)
    },

    hideModal() {
      this.$refs['add-phone-number'].hide()
      // $emit('hide', {id: 'add-address'})
    }
  }
}
</script>

<style scoped>

</style>
