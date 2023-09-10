<template>
  <b-modal id="add-address"
           ref="add-address"
           :visible="isAddAddressModalActive"
           size="md"
           class="p-3 pb-1"
           hide-header
           hide-footer
           centered
           @change="(val) => $emit('update:is-add-address-modal-active', val)">

    <div class="modal-custom-header d-flex align-items-center justify-content-between">
      <h4>{{ $t('global.add') }} {{$t('address.address')}}</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal()">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>

    <b-form class="reset-password">
      <!-- Region -->
      <validation-provider
          #default="validationContext"
          :name="$t('address.region')"
          rules="required">
        <b-form-group
            :label="$t('address.region')"
            label-for="region">
          <v-select
              v-model="address.region"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="regionsList"
              label="title"
          >
            <template #option="{ title }">
              <span> {{ title }}</span>
            </template>
          </v-select>

          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <!-- City -->
      <validation-provider
          #default="validationContext"
          :name="$t('address.municipality')"
          rules="required">
        <b-form-group
            :label="$t('address.municipality')"
            label-for="municipality">
          <v-select
              v-model="address.city"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="municipalitiesList"
              label="title"
          >
            <template #option="{ title }">
              <span> {{ title }}</span>
            </template>
          </v-select>
          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <!-- Village -->
      <validation-provider
          #default="validationContext"
          :name="$t('address.village')"
          rules="required">
        <b-form-group
            :label="$t('address.village')"
            label-for="city_village">
          <v-select
              :disabled="address.region === '' || address.region === null"
              id="city_village"
              v-model="address.village"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="villagesList"
              label="title"
          >
            <template #option="{ title }">
              <span> {{ title }}</span>
            </template>
          </v-select>
          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <!-- Address -->
      <validation-provider
          #default="validationContext"
          :name="$t('address.address')"
          rules="required">
        <b-form-group
            :label="$t('address.address')"
            label-for="address">
          <b-form-input
              id="address"
              v-model="address.address"

              trim/>

          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </b-form>

    <div class="mt-3 d-flex justify-content-between align-items-center">
      <b-button variant="primary" class="save-changes mb-3"
                :disabled="false"
                @click="addAddress">
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
  name: "AddAddressModal",
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
    regionsList: {
      type: Array
    },
    villagesList: {
      type: Array
    },
    municipalitiesList: {
      type: Array
    },
    isAddAddressModalActive: {
      type: Boolean
    },
  },

  data() {
    return {
      address: {
        region: '',
        city: '',
        village: '',
        address: '',
      },
    }
  },

  watch: {

    villagesList: function (villages) {
      // this.address.village = villages.find(a => a.id == this.editSidebarFields.address.villageId)
    },

    municipalitiesList: function (municipalities) {
      // this.address.cityText = municipalities.find(a => a.id == this.editSidebarFields.address.municipalityId)
      // this.address.city = this.editSidebarFields.address.municipalityId
      // this.cityText = this.address.cityText
    },

    'address.region': function (newVal) {
      // console.log("updated region", newVal, this.address)
      if (newVal) {
        this.$emit('get-municipalities', newVal.id);
        this.$emit('get-villages', {regionId: newVal.id});
      }
    },

    cityText: function (newVal) {
      if (newVal) {
        this.$emit('get-villages', {municipalityId: newVal.id, regionId: newVal.regionId});
      }
    }
  },

  methods: {
    addAddress() {
      let payload = {
        user_id: router.currentRoute.params.id,
        regionId: this.address.region.id,
        municipalityId: this.address.city.id,
        villageId: this.address.village.id,
        address: this.address.address,
      }
      this.$emit('add', payload)
    },

    hideModal() {
      this.$refs['add-address'].hide()
      // $emit('hide', {id: 'add-address'})
    }
  }
}
</script>

<style scoped>

</style>
