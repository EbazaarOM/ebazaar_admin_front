<template>
  <b-sidebar id="add-new-user-sidebar"
             :visible="isAddNewUserSidebarActive"
             bg-variant="white"
             sidebar-class="sidebar-lg"
             shadow
             backdrop
             no-header
             right
             @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center
        content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          {{ registrationFields.addTitle }}
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
        <div class="d-flex align-items-center justify-content-between">
          <b-form-checkbox v-if="registrationFields.isFarmer"
                           checked="true" class="p-2 pb-0"
                           name="check-button"
                           switch
                           inline
                           v-model="isLegalEntity">
            <span v-if="!isLegalEntity">{{ $t('users.naturalPerson') }} </span>
            <span v-else>{{ $t('users.legalEntity') }} </span>
          </b-form-checkbox>
        </div>

        <!-- Form -->
        <b-form class="p-2"
                @reset.prevent="resetForm">

          <!-- Preferred Language -->
          <validation-provider v-if="registrationFields.preferredLanguage"
                               name="Preferred Language"
                               rules="">
            <b-form-group
                :label="$t('users.priorityLanguage')"
                label-for="preferredLanguage">
              <b-form-select v-if="registrationFields.preferredLanguage"
                             id="preferredLanguage"
                             v-model="preferredLanguage"
                             :options="registrationFields.preferredLanguage"
              />
            </b-form-group>
          </validation-provider>

          <!-- Juridical Info: Commercial Name -->
          <validation-provider v-if="isLegalEntity && registrationFields.juridicalInfo"
                               v-slot="{ valid, dirty }"
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
          <validation-provider v-if="isLegalEntity && registrationFields.juridicalInfo"
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
          <validation-provider v-if="isLegalEntity && registrationFields.juridicalInfo"
                               v-slot="{ valid, dirty }"
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
          <validation-provider v-if="isLegalEntity && registrationFields.juridicalInfo"
                               v-slot="{ valid, dirty }"
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
          <validation-provider v-if="isLegalEntity && registrationFields.juridicalInfo"
                               v-slot="{ valid, dirty }"
                               name="Juridical Type"
                               rules="required">
            <b-form-group
                :label="$t('users.legalEntityType')"
                label-for="juridicalType">
              <b-form-select id="juridicalType"
                             :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                             v-model="juridicalInfo.juridicalType"
                             :options="juridicalTypeOptions"/>
            </b-form-group>
          </validation-provider>

          <!-- First Name -->
          <div :class="!isLegalEntity && role === 'Farmer'? 'd-flex justify-content-between' : ''">
            <validation-provider v-if="registrationFields.firstName"
                                 v-slot="{ errors, valid, dirty }"
                                 name="firstName"
                                 class="w-50"
                                 rules="required">
              <b-form-group
                  :label="isLegalEntity? $t('users.directorFirstname') +' *' : $t('users.name') + ' *'"
                  label-for="first-name">
                <b-form-input
                    id="first-name"
                    v-model="firstName"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder=""
                />
                <b-form-invalid-feedback for="first-name">
                  {{ $t('global.mandatoryField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider v-if="registrationFields.firstName && role === 'Farmer'"
                                 v-slot="{ errors, valid, dirty }"
                                 name="firstName_en"
                                 class="w-50"
                                 rules="required">

              <b-form-group v-if="!isLegalEntity"
                            class="ml-1"
                            :label="isLegalEntity? $t('global.eng') +' *' : $t('users.name') + ' ' + $t('global.eng') + ' *'"
                            label-for="first-name_en">
                <b-form-input
                    id="first-name_en"
                    v-model="firstName_en"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder=""
                />
                <b-form-invalid-feedback for="first-name_en">
                  {{ $t('global.mandatoryField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </div>

          <!-- Last Name -->
          <div :class="!isLegalEntity && role === 'Farmer'? 'd-flex justify-content-between' : ''">
            <validation-provider v-if="registrationFields.lastName"
                                 v-slot="{ errors, valid, dirty }"
                                 name="lastName"
                                 class="w-50"
                                 rules="required"
            >
              <b-form-group
                  :label="isLegalEntity? $t('users.directorLastname') + ' *' : $t('users.lastname') + ' *'"
                  label-for="last-name"
              >
                <b-form-input
                    id="last-name"
                    v-model="lastName"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder=""
                />
                <b-form-invalid-feedback for="last-name">
                  {{ $t('global.mandatoryField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider v-if="registrationFields.lastName && role === 'Farmer'"
                                 v-slot="{ errors, valid, dirty }"
                                 name="lastName_en"
                                 class="w-50"
                                 rules="required"
            >
              <b-form-group v-if="!isLegalEntity"
                            class="ml-1"
                            :label="isLegalEntity? $t('global.eng') + ' *' : $t('users.lastname') + ' ' + $t('global.eng') + ' *'"
                            label-for="last-name_en"
              >
                <b-form-input
                    id="last-name_en"
                    v-model="lastName_en"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder=""
                />
                <b-form-invalid-feedback for="last-name_en">
                  {{ $t('global.mandatoryField') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </div>

          <!-- User Name -->
          <validation-provider v-if="registrationFields.userName"
                               v-slot=""
                               name="username"
                               rules="required"
          >
            <b-form-group
                :label="$t('users.username') + '*'"
                label-for="user-name"
            >
              <b-form-input
                  id="user-name"
                  v-model="userName"
                  autofocus
                  :state="validate_username"
                  trim
                  placeholder="john_doe"
              />
              <b-form-invalid-feedback for="user-name">
                {{ $t('users.usernameLength') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Identity Number -->
          <validation-provider v-if="registrationFields.identity"
                               name="Identity Number"
                               v-slot="{ errors, valid, dirty }"
                               rules="digits:11"
          >
            <b-form-group
                :label="isLegalEntity? $t('users.directorPersonalId') : $t('users.personalId')"
                label-for="identity">
              <b-form-input
                  id="identity"
                  v-model="identity"
                  :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                  trim/>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider v-if="registrationFields.email"
                               name="Workspace Email"
                               v-slot="{ errors, valid, dirty }"
                               :rules="registrationFields.email.required ? 'email' : 'email'">
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
          <validation-provider v-if="registrationFields.phoneNumber"
                               name="Phone Number"
                               v-slot="{ errors, valid, dirty }"
                               :rules="'required'">
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
          <validation-provider v-if="registrationFields.workspacePhoneNumber"
                               name="Workspace Phone Number">
            <b-form-group
                :label="$t('users.extensionNumber')"
                label-for="workspace_phone">
              <b-form-input
                  id="workspace_phone"
                  v-model="workspacePhoneNumber"
                  trim/>
              <span>{{ errors[0] }}</span>
            </b-form-group>
          </validation-provider>

          <!-- Responsible Consul -->
          <validation-provider v-if="registrationFields.consul && !isConsul"
                               #default="validationContext"
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

          <!-- Region -->
          <validation-provider v-if="registrationFields.address"
                               #default="validationContext"
                               name="Region"
                               rules="">
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
          <validation-provider v-if="registrationFields.address"
                               #default="validationContext"
                               name="Municipality"
                               rules="">
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
          <validation-provider v-if="registrationFields.address"
                               #default="validationContext"
                               name="City/Village"
                               rules="">
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
          <validation-provider v-if="registrationFields.address"
                               #default="validationContext"
                               name="Address"
                               rules="">
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

          <!-- Sticker -->
          <validation-provider v-if="false && registrationFields.sticker"
                               name="Sticker"
                               rules="">
            <b-form-group
                label="Sticker"
                label-for="sticker">
              <b-form-select id="sticker"
                             v-model="sticker"
                             :options="stickerOptions">
              </b-form-select>
            </b-form-group>
          </validation-provider>

          <!-- license Number -->
          <validation-provider v-if="registrationFields.licenseNumber"
                               name="License Number"
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
          <validation-provider v-if="registrationFields.vehicle"
                               #default="validationContext"
                               name="Vehicle Manufacturer"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleBrand')"
                label-for="manufacturer">
              <b-form-input
                  id="manufacturer"
                  v-model="vehicle.manufacturer"

                  trim/>

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Vehicle Model -->
          <validation-provider v-if="registrationFields.vehicle"
                               #default="validationContext"
                               name="Vehicle Model"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleModel')"
                label-for="model">
              <b-form-input
                  id="model"
                  v-model="vehicle.model"

                  trim/>

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Vehicle license Plate -->
          <validation-provider v-if="registrationFields.vehicle"
                               #default="validationContext"
                               name="Vehicle License Plate"
                               rules="">
            <b-form-group
                :label="$t('users.vehicleRegistrationNumber')"
                label-for="licensePlate">
              <b-form-input
                  id="licensePlate"
                  v-model="vehicle.licensePlate"

                  trim/>

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Password -->
          <b-form-group v-if="registrationFields.password">
            <div class="d-flex justify-content-between">
              <label for="login-password">{{ $t('password.password') }}</label>
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
                    id="login-password"
                    v-model="password"
                    :state="validate_password"
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
              <small v-if="!validate_password" class="text-danger">
                {{ $t('password.passwordValidation') }}
              </small>
            </validation-provider>
          </b-form-group>

          <!-- Confirm Password -->
          <b-form-group v-if="registrationFields.confirmPassword">
            <div class="d-flex justify-content-between">
              <label for="login-password">{{ $t('password.repeatPassword') }}</label>
            </div>
            <validation-provider
                #default="{ errors }"
                name="Password"
                vid="password"
                rules="required">
              <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null">
                <b-form-input id="confirm_password"
                              v-model="confirmPassword"
                              :type="passwordFieldType"
                              :state="validate_confirm_password"
                              trim/>
                <b-input-group-append is-text>
                  <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"/>
                </b-input-group-append>
              </b-input-group>
              <b-form-invalid-feedback for="confirmPassword">
                {{ $t('password.passwordsNotMatch') }}
              </b-form-invalid-feedback>
            </validation-provider>
          </b-form-group>

          <!-- Bank Account Number -->
          <validation-provider v-if="registrationFields.bankAccountNumber"
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
              <span v-if="!isCash">{{ $t('global.card') }}</span>
              <span v-else>{{ $t('global.cash') }}</span>
            </b-form-checkbox>

          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
                :disabled="isInvalid(errors)"
                @click.prevent="addUser"
            >
              {{ $t('global.add') }}
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
  BInputGroup,
  BFormInvalidFeedback,
  BButton,
  BFormCheckbox,
  BFormSelect,
  BFormFile,
  BFormTextarea,
  BInputGroupAppend,
} from 'bootstrap-vue'
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {ref} from '@vue/composition-api'
import {required, email, digits, integer, numeric} from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import countries from '@/@fake-db/data/other/countries'
import store from '@/store'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {togglePasswordVisibility} from "@core/mixins/ui/forms";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";

export default {
  name: 'UserListAddNew',
  components: {
    FormSelectStandard,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormCheckbox,
    BFormSelect,
    BFormFile,
    BFormTextarea,
    BInputGroupAppend,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    // roleOptions: {
    //     type: Array,
    //     required: true,
    // },
    // planOptions: {
    //     type: Array,
    //     required: true,
    // },
    registrationFields: {
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
    role: {
      type: String
    },
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      required,
      digits,
      integer,
      // email,
      countries,
      passwordFieldType: 'password',
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
      preferredLanguage: 'NotSet',
      isLegalEntity: false,
      isCash: false,
      sticker: '',
      address: {
        region: '',
        city: '',
        address: '',
        village: '',
      },
      juridicalInfo: {
        commercialName: '',
        commercialName_en: '',
        juridicalName: '',
        identificationNumber: '',
        juridicalType: 'NotSet'
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
        profileImage: '',
        coverImage: '',
        videoLink: '',
        text: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          }
        ]
      },

      selected1: {},
      option: [{title: 'Square'}, {title: 'Rectangle'}, {title: 'Rombo'}, {title: 'Romboid'}],
      books: [
        {
          title: 'Aperture',
          icon: 'ApertureIcon',
        },
        {
          title: 'Codepen',
          icon: 'CodepenIcon',
        },
        {
          title: 'Globe ',
          icon: 'GlobeIcon',
        },
        {
          title: 'Instagram ',
          icon: 'InstagramIcon',
        },
      ],
      juridicalTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'LimitedPartnership', text: this.$i18n.t('legalEntityTypes.jointAndSeveralLiabilityCompany')},
        {value: 'LimitedLiability', text: this.$i18n.t('legalEntityTypes.limitedLiabilityCompany')},
        {value: 'Cooperative', text: this.$i18n.t('legalEntityTypes.cooperative')},
        {value: 'Individual', text: this.$i18n.t('legalEntityTypes.individualEntrepreneur')},
        {value: 'Small', text: this.$i18n.t('legalEntityTypes.soleProprietorship')},
      ],
      stickerOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose'), img: ''},
        {value: 'Premium', text: this.$i18n.t('sticker.premium'), img: 'premium.svg'},
        {value: 'LaboratoryChecked', text: this.$i18n.t('sticker.laboratoryInspected'), img: 'laboratory_checked.svg'},
        {value: 'VisuallyChecked', text: this.$i18n.t('sticker.visuallyChecked'), img: 'visually_checked.svg'},
        {value: 'Bio', text: this.$i18n.t('sticker.bio'), img: 'bio.svg'},
        {value: 'Awarded', text: this.$i18n.t('sticker.awarded'), img: 'awarded.svg'},
        {value: 'Certified', text: this.$i18n.t('sticker.certified'), img: 'certified.svg'},
      ],
    }
  },

  computed: {
    validate_password() {
      // if (this.password.length === 0) return null
      return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$').test(this.password)
    },

    validate_confirm_password() {
      // if (this.confirmPassword.length === 0) return null
      return this.confirmPassword === this.password
    },

    validate_username() {
      if (this.userName.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.@]{6,100}$').test(this.userName)
    },

    validate_identification_number() {
      if (!this.registrationFields.juridicalInfo) return true
      if (this.juridicalInfo.identificationNumber.length === 0) return null
      return new RegExp('^[0-9]{1,100}$').test(this.juridicalInfo.identificationNumber)
    },

    validate_phone_number() {
      // if (this.phoneNumber.length === 0) return null
      // return new RegExp('^[0-9]{1,100}$').test(this.phoneNumber)
      if (this.isLegalEntity) return new RegExp('^[0-9]{9,10}$').test(this.phoneNumber)
      return new RegExp('^[0-9]{9}$').test(this.phoneNumber)
    },

    validate_license_number() {
      if (this.licenseNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.licenseNumber)
    },

    validate_bank_account_number() {
      if (!this.registrationFields.bankAccountNumber) return true
      if (this.isCash) return true
      if (this.bankAccountNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.bankAccountNumber)
      // return true
    },

    isConsul() {
      return localStorage.getItem('role') === 'consul'
    },

    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },

  },

  watch: {
    'address.region': function (newVal) {
      this.$emit('get-villages', {regionId: newVal ? newVal.id : ''});
      this.$emit('get-municipalities', newVal.id);
      this.address.city = '';
      this.address.village = '';
    },
    'address.city': function (newVal) {
      this.$emit('get-villages', {municipalityId: newVal.id, regionId: newVal.regionId});
      this.address.village = '';
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
      // console.log(this.validate_password,
      //     this.validate_username,
      //     this.validate_confirm_password,
      //     this.validate_bank_account_number,
      //     this.validate_phone_number,
      //     isJuridicalInfoValid)
      let isInvalid = !(this.validate_password
          && this.validate_username
          && this.validate_confirm_password
          && this.validate_bank_account_number
          && this.validate_phone_number
          && isJuridicalInfoValid)

      return isInvalid
    },

    addUser() {
      let payload = {
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName,
        identity: this.identity,
        email: this.email,
        phoneNumber: this.phoneNumber,
        workspacePhoneNumber: this.workspacePhoneNumber,
        password: this.password,
        sticker: this.sticker,
        confirmPassword: this.confirmPassword,
        preferredLanguage: this.preferredLanguage,
        responsibleUserId: this.responsibleUser.id,
        userType: this.isLegalEntity ? 'Juridical' : 'Physical',
        address: {
          regionId: this.address.region ? this.address.region.id : null,
          municipalityId: this.address.city ? this.address.city.id : null,
          villageId: this.address.village ? this.address.village.id : null,
          address: this.address.address,
        },
        physicalNames: [
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
        ],
        juridicalInfo: {
          juridicalName: this.juridicalInfo.juridicalName,
          identificationNumber: this.juridicalInfo.identificationNumber,
          juridicalType: this.juridicalInfo.juridicalType,
          directorFirstName: this.firstName,
          directorLastName: this.lastName,
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
        },
        bankAccountNumber: this.bankAccountNumber,
        enableCash: this.isCash,
        licenseNumber: this.licenseNumber,
        vehicle: {
          manufacturer: this.vehicle.manufacturer,
          model: this.vehicle.model,
          licensePlate: this.vehicle.licensePlate
        },
        personalInfo: this.personalInfo ? {
          coverImage: this.personalInfo.coverImage === '' ? null : this.personalInfo.coverImage,
          profileImage: this.personalInfo.profileImage === '' ? null : this.personalInfo.profileImage,
          text: this.personalInfo.text,
          videoLink: this.personalInfo.videoLink,
          translations: [
            {
              languageCode: 'ka',
              text: ''
            }
          ]
        } : {}
      };
      store.dispatch(this.requestPath, payload)
          .then(() => {
            this.toast(this.firstName + ' ' + this.lastName)
            this.clearUserData();
            this.$emit('refetch-data');
            this.$emit('update:is-add-new-user-sidebar-active', false);
            this.$refs.closeBtn.click();
          })
          .catch((err) => {
            this.toast('დაფიქსირდა შეცდომა', 'b-toaster-bottom-right', false, 'danger')
            alert(err.response.data)
          })
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

    clearUserData() {
      this.firstName = ''
      this.firstName_en = ''
      this.lastName = ''
      this.lastName_en = ''
      this.userName = ''
      this.identity = ''
      this.email = ''
      this.phoneNumber = ''
      this.workspacePhoneNumber = ''
      this.password = ''
      this.sticker = ''
      this.confirmPassword = ''
      this.responsibleUserId = ''
      this.preferredLanguage = 'NotSet'
      this.userType = this.isLegalEntity ? 'Juridical' : 'Physical'
      this.address = {
        regionId: '',
        municipalityId: '',
        villageId: '',
        address: '',
      }
      this.juridicalInfo = {
        commercialName: '',
        juridicalName: '',
        identificationNumber: '',
        juridicalType: "NotSet",
        juridicalNames: [
          {
            languageCode: "ka",
            commercialName: ''
          },
          {
            languageCode: "en",
            commercialName: ''
          },
        ]
      }
      this.bankAccountNumber = ''
      this.enableCash = ''
      this.licenseNumber = ''
      this.vehicle = {
        manufacturer: '',
        model: '',
        licensePlate: ''
      }
      this.personalInfo = {
        profileImage: '',
        coverImage: '',
        videoLink: '',
        text: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          }
        ]
      }
    }
  },

  setup(props, {emit}) {
    const blankUserData = {
      firstName: '',
      firstName_en: '',
      lastName: '',
      lastName_en: '',
      userName: '',
      identity: '',
      email: '',
      phoneNumber: '',
      workspacePhoneNumber: '',
      preferredLanguage: 'NotSet',
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
        juridicalType: 'NotSet',
        juridicalNames: [
          {
            languageCode: "ka",
            commercialName: ''
          },
          {
            languageCode: "en",
            commercialName: ''
          },
        ]
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

    const regions = ref(props.regionsList);
    // console.log("regions", regions, props.regionsList, props);

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }
    //
    // const onSubmit = () => {
    //   let self = this;
    //   let payload = {
    //       firstName: self.firstName,
    //       lastName: self.lastName,
    //       identity: self.identity,
    //       email: self.email,
    //       phoneNumber: self.phoneNumber,
    //       workspacePhoneNumber: self.workspacePhoneNumber,
    //       password: self.password,
    //       confirmPassword: self.confirmPassword,
    //   }
    //   store.dispatch('app-user/addUser', payload)
    //     .then(() => {
    //       emit('refetch-data')
    //       emit('update:is-add-new-user-sidebar-active', false)
    //     })
    // }

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

      regions,
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
