<template>
  <b-sidebar id="add-new-user-sidebar"
             :visible="isEditUserSidebarActive"
             bg-variant="white"
             sidebar-class="sidebar-lg"
             shadow
             backdrop
             no-header
             right
             @hidden="resetForm"
             @change="(val) => $emit('update:is-edit-user-sidebar-active', val)">
    <template #default="{ hide }" v-if="editFields">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center
        content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          {{ editFields.editTitle }}
        </h5>

        <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer v-slot="{ errors }"
                           ref="refFormObserver">

        <b-form-checkbox v-if="false && editFields.isFarmer"
                         v-model="isLegalEntity"
                         checked="true" class="p-2 pb-0"
                         name="check-button"
                         switch
                         inline
        >
          <span v-if="!isLegalEntity">{{ $t('users.naturalPerson')}}</span>
          <span v-else>{{$t('users.legalEntity')}}</span>
        </b-form-checkbox>
        <!-- Form -->
        <b-form class="p-2"
                @reset.prevent="resetForm">

          <!-- Preferred Language -->
          <validation-provider v-if="editFields.preferredLanguage"
                               name="Preferred Language"
                               rules="">
            <b-form-group
                :label="$t('users.priorityLanguage')"
                label-for="preferredLanguage">
              <b-form-select v-if="editFields.preferredLanguage"
                             id="preferredLanguage"
                             v-model="preferredLanguage"
                             :options="editFields.preferredLanguage"
              />
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Commercial Name -->
          <validation-provider v-if="isLegalEntity && editFields.juridicalInfo"
                               v-slot="{errors, valid, dirty }"
                               name="Commercial Name"
                               rules="">
            <b-form-group
                :label="$t('users.commercialName')"
                label-for="commercialName">
              <b-form-input
                  id="commercialName"
                  v-model="juridicalInfo.commercialName"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Commercial Name English-->
          <validation-provider v-if="isLegalEntity && editFields.juridicalInfo"
                               v-slot="{ valid, dirty }"
                               name="Commercial Name"
                               rules="">
            <b-form-group
                :label="$t('users.commercialName_en')"
                label-for="commercialName_en">
              <b-form-input
                  id="commercialName_en"
                  v-model="juridicalInfo.commercialName_en"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Juridical String -->
          <validation-provider v-if="isLegalEntity && editFields.juridicalInfo"
                               v-slot="{errors, valid, dirty }"
                               name="Juridical String"
                               rules="required">
            <b-form-group
                :label="$t('users.legalName')"
                label-for="juridicalName">
              <b-form-input
                  id="juridicalName"
                  v-model="juridicalInfo.juridicalName"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Identification Number -->
          <validation-provider v-if="isLegalEntity && editFields.juridicalInfo"
                               v-slot="{errors, valid, dirty }"
                               name="Identification Number"
                               rules="required">
            <b-form-group
                :label="$t('users.companyId')"
                label-for="identificationNumber">
              <b-form-input
                  id="identificationNumber"
                  v-model="juridicalInfo.identificationNumber"
                  :state="dirty ? validate_identification_number : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Juridical type-->
          <validation-provider v-if="isLegalEntity && editFields.juridicalInfo"
                               v-slot="{errors, valid, dirty }"
                               name="Juridical Type"
                               rules="required">
            <b-form-group
                :label="$t('users.legalEntityType')"
                label-for="juridicalType">
              <b-form-select id="juridicalType"
                             v-model="juridicalInfo.juridicalType"
                             :options="juridicalTypeOptions"
                             :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
              >
              </b-form-select>
            </b-form-group>
          </validation-provider>

          <!-- First Name -->
          <div :class="!isLegalEntity ? 'd-flex justify-content-between' : ''">
            <validation-provider v-if="editFields.firstName"
                                 v-slot="{ errors, valid, dirty }"
                                 name="firstName"
                                 class="w-50"
                                 rules="required">
              <b-form-group
                  :label="$t('users.name') + '*'"
                  label-for="first-name"
              >
                <b-form-input
                    id="first-name"
                    v-model="firstName"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    autofocus
                    trim
                    placeholder="John"
                />
              </b-form-group>
            </validation-provider>

            <validation-provider v-if="editFields.firstName"
                                 v-slot="{ errors, valid, dirty }"
                                 name="firstName_en"
                                 class="w-50"
                                 rules="required">

              <b-form-group v-if="!isLegalEntity && editFields.role === 'farmer'"
                            class="ml-1"
                            :label="$t('users.name') + ' ' + $t('global.eng') + ' *'"
                            label-for="first-name_en"
              >
                <b-form-input
                    id="first-name_en"
                    v-model="firstName_en"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    autofocus
                    trim
                    placeholder="John"
                />
              </b-form-group>
            </validation-provider>
          </div>

          <!-- Last Name -->
          <validation-provider v-if="editFields.lastName"
                               v-slot="{ errors, valid, dirty }"
                               :class="!isLegalEntity && editFields.role === 'farmer'? 'd-flex justify-content-between' : ''"
                               name="Last Name"
                               rules="required"
          >
            <b-form-group
                :label="$t('users.lastname') + ' *'"
                label-for="last-name"
            >
              <b-form-input
                  id="last-name"
                  v-model="lastName"
                  autofocus
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim
                  placeholder="Doe"
              />
            </b-form-group>
            <b-form-group v-if="!isLegalEntity && editFields.role === 'farmer'"
                          class="ml-1"
                          :label="$t('users.lastname') + ' ' + $t('global.eng') + ' *'"
                          label-for="last-name_en"
            >
              <b-form-input
                  id="last-name_en"
                  v-model="lastName_en"
                  autofocus
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim
                  placeholder="Doe"
              />
            </b-form-group>
          </validation-provider>

          <!-- User Name -->
          <validation-provider v-if="editFields.userName"
                               v-slot=""
                               name="User Name"
                               rules="required"
          >
            <b-form-group
                :label="$t('users.username')"
                label-for="user-name"
            >
              <b-form-input
                  id="user-name"
                  v-model="userName"
                  autofocus
                  :state="validate_username"
                  trim
                  placeholder="Doe"
              />
            </b-form-group>
          </validation-provider>

          <!-- Identity Number -->
          <validation-provider v-if="editFields.identity"
                               v-slot="{errors, valid, dirty }"
                               name="Identity Number"
                               rules="digits:11">
            <b-form-group
                :label="$t('users.personalId')"
                label-for="identity">
              <b-form-input
                  id="identity"
                  v-model="identity"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider v-if="editFields.email"
                               v-slot="{errors, valid, dirty }"
                               name="Workspace Email"
                               rules="email">
            <b-form-group
                :label="$t('global.email')"
                label-for="email">
              <b-form-input
                  id="email"
                  v-model="email"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Phone Number -->
          <validation-provider v-if="editFields.phoneNumber"
                               v-slot="{errors, valid, dirty }"
                               name="Phone Number"
                               :rules="'required|digits:9'">
            <b-form-group
                :label="$t('users.phoneNumber')"
                label-for="phone_number">
              <b-form-input
                  id="phone_number"
                  v-model="phoneNumber"
                  :state="dirty ? validate_phone_number : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Workspace Phone Number -->
          <validation-provider v-if="editFields.workspacePhoneNumber"
                               name="Workspace Phone Number">
            <b-form-group
                :label="$t('users.extensionNumber')"
                label-for="workspace_phone">
              <b-form-input
                  id="workspace_phone"
                  v-model="workspacePhoneNumber"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Responsible Consul -->
          <validation-provider v-if="editFields.consul && !isConsul"
                               v-slot="{errors, valid, dirty }"
                               name="Responsible Consul"
                               rules="">
            <b-form-group
                :label="$t('users.responsiblePerson')"
                label-for="consul">
              <v-select
                  v-model="responsibleUser"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="consulsList"
                  label="title"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </validation-provider>

          <!-- Region -->
          <validation-provider v-if="editFields.address && regionsList"
                               name="Region"
                               rules="">
            <b-form-group
                :label="$t('address.region')"
                label-for="region">
              <v-select
                  v-model="address.regionText"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="regionsList"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </validation-provider>

          <!-- Municipality -->
          <validation-provider v-if="editFields.address"
                               name="Municipality"
                               rules="">
            <b-form-group
                :label="$t('address.municipality')"
                label-for="municipality">
              <v-select
                  v-model="cityText"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="municipalitiesList"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </validation-provider>

          <!-- Village -->
          <validation-provider v-if="editFields.address"
                               name="Village"
                               rules="">
            <b-form-group
                :label="$t('address.village')"
                label-for="city_village">
              <v-select
                  id="city_village"
                  v-model="address.village"
                  :disabled="address.region === '' || address.region === null"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="villagesList"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </validation-provider>

          <!-- Address -->
          <validation-provider v-if="editFields.address"
                               name="Address"
                               rules="">
            <b-form-group
                :label="$t('address.address')"
                label-for="address">
              <b-form-input
                  id="address"
                  v-model="address.address"

                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- license Number -->
          <validation-provider v-if="editFields.licenseNumber"
                               v-slot="{}"
                               name="license Number"
                               rules="">
            <b-form-group
                :label="$t('users.licenseNumber')"
                label-for="licenseNumber">
              <b-form-input
                  id="licenseNumber"
                  v-model="licenseNumber"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Vehicle Manufacturer -->
          <validation-provider v-if="editFields.vehicle"
                               v-slot="{errors, valid, dirty }"
                               name="Vehicle Manufacturer"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleBrand')"
                label-for="manufacturer">
              <b-form-input
                  id="manufacturer"
                  v-model="vehicle.manufacturer"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Vehicle Model -->
          <validation-provider v-if="editFields.vehicle"
                               v-slot="{errors, valid, dirty }"
                               name="Vehicle Model"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleModel')"
                label-for="model">
              <b-form-input
                  id="model"
                  v-model="vehicle.model"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Vehicle license Plate -->
          <validation-provider v-if="editFields.vehicle"
                               v-slot="{errors, valid, dirty }"
                               name="Vehicle license Plate"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleRegistrationNumber')"
                label-for="licensePlate">
              <b-form-input
                  id="licensePlate"
                  v-model="vehicle.licensePlate"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Bank Account Number -->
          <validation-provider v-if="editFields.bankAccountNumber"
                               v-slot=""
                               class="mt-1"
                               name="bankAccountNumber"
                               :rules="isCash ? '' : ''">
            <b-form-group
                :label="$t('users.bankAccountNumber')"
                label-for="bankAccountNumber">
              <b-form-input
                  id="bankAccountNumber"
                  v-model="bankAccountNumber"
                  :state="validate_bank_account_number"
                  :disabled="isCash"
                  trim/>
            </b-form-group>
            <b-form-checkbox v-model="isCash"
                             checked="true" class="pb-1"
                             name="check-button"
                             switch
                             inline>
              <span v-if="!isCash">{{ $t('global.cash') }}</span>
              <span v-else>{{ $t('global.card') }}</span>
            </b-form-checkbox>

          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                :disabled="isInvalid(errors)"
                type="submit"
                @click.prevent="editUser"
            >
              {{ $t('global.save') }}
            </b-button>
            <b-button
                ref="closeBtn"
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="button"
                variant="outline-secondary"
                @click="hide"
            >
              {{ $t('global.cancel') }}
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
/* eslint-disable */
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormCheckbox,
  BFormSelect,
  BFormFile,
  BFormTextarea
} from 'bootstrap-vue'
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {ref} from '@vue/composition-api'
import {required, alphaNum, email} from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import countries from '@/@fake-db/data/other/countries'
import store from '@/store'
import ToastificationContent from "@core/components/toastification/ToastificationContent";

export default {
  name: 'UserListEdituser',
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormCheckbox,
    BFormSelect,
    BFormFile,
    BFormTextarea,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },

  directives: {
    Ripple,
  },

  model: {
    prop: 'isEditUserSidebarActive',
    event: 'update:is-edit-user-sidebar-active',
  },

  props: {
    isEditUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    editFields: {
      type: Object
    },
    editSidebarFields: {
      type: Object
    },
    requestPath: {
      type: String
    },
    regionsList: {
      type: Array
    },
    villagesList: {
      type: Array
    },
    municipalitiesList: {
      type: Array
    },
    regionSubpart: {
      type: Array
    },
    consulsList: {
      type: Array
    },
  },

  data() {
    return {
      required,
      alphaNum,
      // email,
      countries,
      firstName: '',
      firstName_en: '',
      lastName: '',
      lastName_en: '',
      userName: '',
      identity: '',
      email: '',
      phoneNumber: '',
      workspacePhoneNumber: '',
      password: '',
      confirmPassword: '',
      isLegalEntity: false,
      preferredLanguage: 'NotSet',
      isCash: false,
      address: {
        id: '',
        region: '',
        regionText: '',
        city: '',
        cityText: '',
        village: '',
        address: '',
      },
      cityText: '',
      juridicalInfo: {
        commercialName: '',
        commercialName_en: '',
        juridicalName: '',
        identificationNumber: '',
        juridicalType: '',
      },
      responsibleUser: '',
      bankAccountNumber: '',
      licenseNumber: '',
      vehicle: {
        manufacturer: '',
        model: '',
        licensePlate: ''
      },
      personalInfo: {
        profileImage: null,
        coverImage: null,
        videoLink: '',
        text: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          }
        ]
      },
      juridicalTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose'), disabled: true},
        {value: 'LimitedPartnership', text: this.$i18n.t('legalEntityTypes.jointAndSeveralLiabilityCompany')},
        {value: 'LimitedLiability', text: this.$i18n.t('legalEntityTypes.limitedLiabilityCompany')},
        {value: 'Cooperative', text: this.$i18n.t('legalEntityTypes.cooperative')},
        {value: 'Individual', text: this.$i18n.t('legalEntityTypes.individualEntrepreneur')},
        {value: 'Small', text: this.$i18n.t('legalEntityTypes.soleProprietorship')},
      ],
    }
  },

  computed: {

    validate_username() {
      if (this.userName.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.@]{6,100}$').test(this.userName)
    },

    validate_identification_number() {
      if (!this.editFields.juridicalInfo) return true
      if (this.juridicalInfo.identificationNumber.length === 0) return null
      return new RegExp('^[0-9]{1,100}$').test(this.juridicalInfo.identificationNumber)
    },

    validate_phone_number() {
      // if (this.phoneNumber.length === 0) return null
      if (this.isLegalEntity) return new RegExp('^[0-9]{9,10}$').test(this.phoneNumber)
      return new RegExp('^[0-9]{9}$').test(this.phoneNumber)
    },

    validate_license_number() {
      if (this.licenseNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.licenseNumber)
    },

    validate_bank_account_number() {
      if (!this.editFields.bankAccountNumber) return true
      if (this.isCash) return true
      if (this.bankAccountNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.bankAccountNumber)
    },

    isConsul() {
      return localStorage.getItem('role') === 'consul'
    },
  },

  methods: {

    isInvalid(errors) {
      for (const [key, value] of Object.entries(errors)) {
        value.length > 0 ? console.log('error', key, value) : ''
        if (value.length > 0) return true
      }
      let isJuridicalInfoValid = this.isLegalEntity ? (this.juridicalInfo.juridicalName !== ''
          && this.juridicalInfo.identificationNumber !== ''
          && this.validate_identification_number
          && this.juridicalInfo.juridicalType !== 'NotSet') : true

      return !(this.validate_username
          && this.validate_bank_account_number
          && this.validate_phone_number
          && isJuridicalInfoValid)
    },

    editUser() {
      let payload = {
        id: this.editSidebarFields.id,
        physicalNames: this.editSidebarFields.role === 'farmer' ? [
          {
            languageCode: "ka",
            firstName: this.firstName,
            lastName: this.lastName
          },
          {
            languageCode: "en",
            firstName: this.firstName_en,
            lastName: this.lastName_en
          },
        ] : [],
        firstName: this.editSidebarFields.role !== 'farmer' ? this.firstName : '',
        lastName: this.editSidebarFields.role !== 'farmer' ? this.lastName : '',
        userName: this.userName,
        identity: this.identity,
        email: this.email,
        phoneNumber: this.phoneNumber,
        workspacePhoneNumber: this.workspacePhoneNumber,
        password: this.password,
        confirmPassword: this.confirmPassword,
        preferredLanguage: this.preferredLanguage,
        responsibleUserId: this.responsibleUser ? this.responsibleUser.id : '',
        userType: this.isLegalEntity ? 'Juridical' : 'Physical',
        address: {
          regionId: this.address.regionText ? this.address.regionText.id : '',
          municipalityId: this.cityText ? this.cityText.id : '',
          villageId: this.address.village ? this.address.village.id : '',
          address: this.address.address,
          id: this.address.id,
        },
        juridicalInfo: this.isLegalEntity ? {
          directorFirstName: this.firstName,
          directorLastName: this.lastName,
          juridicalName: this.juridicalInfo.juridicalName,
          identificationNumber: this.juridicalInfo.identificationNumber,
          juridicalType: this.juridicalInfo.juridicalType,
          juridicalNames: [
            {
              languageCode: "ka",
              commercialName: this.juridicalInfo.commercialName
            },
            {
              languageCode: "en",
              commercialName: this.juridicalInfo.commercialName_en
            },
          ]
        } : {},
        bankAccountNumber: this.bankAccountNumber,
        enableCash: this.isCash,
        licenseNumber: this.licenseNumber,
        vehicle: {
          manufacturer: this.vehicle.manufacturer,
          model: this.vehicle.model,
          licensePlate: this.vehicle.licensePlate
        },
      };

      store.dispatch(this.requestPath, payload)
          .then(() => {
            this.toast(this.firstName + ' ' + this.lastName)
            this.$emit('refetch-data');
            this.$emit('update:is-edit-user-sidebar-active', false);
            this.$refs.closeBtn.click();
          }).catch((error) => {
            alert(error.response.data)
            this.toast('დაფიქსირდა შეცდომა', 'b-toaster-bottom-right', false, 'danger')
          }
      )
    },

    toast(title, toaster = 'b-toaster-bottom-right', append = false, variant = 'success') {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: `${title} ${variant === 'success' ? 'წარმატებით დაემატა' : ''}`,
          icon: 'EditIcon',
          variant: variant,
        },
      })
    },
  },

  watch: {
    editSidebarFields: function (newVal) {
      if (newVal.role === 'farmer') {
        let georgian_names = newVal.physicalNames ? newVal.physicalNames.find(a => a.languageCode === 'ka') : {}
        let english_names = newVal.physicalNames ? newVal.physicalNames.find(a => a.languageCode === 'en') : {}

        this.firstName = newVal.userType === "Juridical" ? newVal.juridicalInfo.directorFirstName : georgian_names ? georgian_names.firstName : ''
        this.firstName_en = english_names ? english_names.firstName : ''
        this.lastName = newVal.userType === "Juridical" ? newVal.juridicalInfo.directorLastName : georgian_names ? georgian_names.lastName : ''
        this.lastName_en = english_names ? english_names.lastName : ''
      } else {
        this.firstName = newVal.firstName;
        this.lastName = newVal.lastName;
      }
      this.userName = newVal.userName;
      this.identity = newVal.identity;
      this.email = newVal.email;
      this.phoneNumber = newVal.phoneNumber;
      this.workspacePhoneNumber = newVal.workspacePhoneNumber;
      this.password = newVal.password;
      this.confirmPassword = newVal.confirmPassword;
      this.isCash = newVal.enableCash;
      this.preferredLanguage = newVal.preferredLanguage;
      this.isLegalEntity = newVal.userType === 'Juridical';
      let commercialNames_en = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'en') : {}
      let commercialNames_ka = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'ka') : {}
      this.juridicalInfo = newVal.juridicalInfo ? {
        directorFirstName: newVal.directorFirstName,
        directorLastName: newVal.directorLastName,
        commercialName: commercialNames_ka ? commercialNames_ka.commercialName : '',
        commercialName_en: commercialNames_en ? commercialNames_en.commercialName : '',
        juridicalName: newVal.juridicalInfo.juridicalName,
        identificationNumber: newVal.juridicalInfo.identificationNumber,
        juridicalType: newVal.juridicalInfo.juridicalType,
      } : {}
      this.bankAccountNumber = newVal.bankAccountNumber;
      this.responsibleUser = this.consulsList.find(a => a.id == newVal.responsibleUserId);
      this.licenseNumber = newVal.licenseNumber;
      this.vehicle = newVal.vehicle ? {
        manufacturer: newVal.vehicle.manufacturer,
        model: newVal.vehicle.model,
        licensePlate: newVal.vehicle.licensePlate
      } : {}
      this.address = newVal.address ? {
        id: newVal.address.id,
        region: newVal.address.regionId,
        address: newVal.address.address,
        regionText: this.regionsList.find(a => a.id == newVal.address.regionId)
      } : {}
      this.personalInfo = newVal.personalInfo ? {
        coverImage: newVal.personalInfo.coverImage === '' ? null : newVal.personalInfo.coverImage,
        profileImage: newVal.personalInfo.profileImage === '' ? null : newVal.personalInfo.profileImage,
        videoLink: newVal.personalInfo.videoLink,
        translations: [
          {
            languageCode: 'ka',
            text: newVal.personalInfo.text,
          }
        ]
      } : {}
    },

    villagesList: function (villages) {
      this.address.village = this.editSidebarFields.address && villages ? villages.find(a => a.id == this.editSidebarFields.address.villageId) : ''
    },

    municipalitiesList: function (municipalities) {
      this.address.cityText = this.editSidebarFields.address && municipalities ? municipalities.find(a => a.id == this.editSidebarFields.address.municipalityId) : ''
      this.address.city = this.editSidebarFields.address ? this.editSidebarFields.address.municipalityId : ''
      this.cityText = this.address.cityText
    },

    'address.regionText': function (newVal) {
      if (newVal && this.isEditUserSidebarActive) {
        this.$emit('get-municipalities', newVal.id);
        this.$emit('get-villages', {regionId: newVal.id});
      }
    },

    cityText: function (newVal) {
      if (newVal && this.isEditUserSidebarActive) {
        this.$emit('get-villages', {municipalityId: newVal.id, regionId: newVal.regionId});
      }
    }
  },

  mounted() {
    this.address.regionText = this.regionsList.find(a => a.id === this.address.regionId)
  },

  setup(props, {emit}) {
    const blankUserData = {
      firstName: '',
      lastName: '',
      userName: '',
      identity: '',
      email: '',
      phoneNumber: '',
      workspacePhoneNumber: '',
      password: '',
      confirmPassword: '',
      address: {
        region: '',
        city: '',
        address: '',
      },
      juridicalInfo: {
        commercialName: '',
        juridicalName: '',
        identificationNumber: '',
        juridicalType: '',
      },
      bankAccountNumber: '',
      licenseNumber: '',
      vehicle: {
        manufacturer: '',
        model: '',
        licensePlate: ''
      },
      personalInfo: {
        coverImage: null,
        profileImage: null,
        text: '',
        videoLink: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          }
        ]
      },
    };

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }

    const {
      refFormObserver,
      // getValidationState,
      resetForm,
    } = formValidation(resetuserData)

    return {
      userData,
      // onSubmit,

      refFormObserver,
      // getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
