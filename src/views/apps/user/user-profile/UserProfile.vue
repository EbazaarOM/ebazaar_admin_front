<template>
  <div id="user-profile">
    <horizontal-navbar :arrow-visible="true" @go-back="goBack"/>

    <template v-if="userData">
      <b-card v-if="userData.personalInfo"
              class="profile-header mb-2"
              :img-src="userData.personalInfo.coverImage ? cover_image : require('../../../../assets/images/banner/banner.png')"
              img-alt="Cover photo"
              img-top
              alt="cover photo"
              body-class="p-0"
      >
        <!-- profile picture -->
        <div class="position-relative">
          <div class="profile-img-container d-flex align-items-center">
            <!-- Media -->
            <b-media class="mb-2">
              <template #aside>
                <b-avatar
                    ref="previewEl"
                    :src="profile_image"
                    :variant="`light-success`"
                    size="90px"
                    rounded
                />
              </template>
            </b-media>
            <!-- profile title -->
            <div class="profile-title">
              <h2 class="text-black">
                {{ firstName }} {{ lastName }} <span class="font-small-4">- {{
                  userData.userType
                }}</span>
              </h2>

              <p v-if="responsibleUser" class="text-black">
                {{ $t('roles.consul') }}: {{ responsibleUser.title }}
              </p>
            </div>
            <!--/ profile title -->
          </div>
        </div>
        <!--/ profile picture -->

        <!-- profile navbar -->
        <div class="profile-header-nav">
          <b-navbar
              toggleable="md"
              type="light"
          >
            <!-- toggle button -->
            <b-navbar-toggle
                class="ml-auto"
                target="nav-text-collapse"
            >
              <feather-icon
                  icon="AlignJustifyIcon"
                  size="21"
              />
            </b-navbar-toggle>
            <!--/ toggle button -->

            <!-- collapse -->
            <b-collapse
                id="nav-text-collapse"
                is-nav
            >
              <b-tabs
                  pills
                  class="profile-tabs mt-1 mt-md-0"
                  nav-class="mb-0"
              >
                <!-- edit buttons -->
                <template v-if="userData.role === 'farmer'" #tabs-start>
                  <div class="text-nowrap ml-auto mr-4">
                    <form-select-standard :id="userData.id"
                                          :selected="userData.published ? userData.published : false"
                                          :loader="loader"
                                          :options="null"
                                          @update="publishFarmer"/>
                  </div>
                </template>

                <!-- edit buttons -->
                <template v-if="!is_call_center_manager && !(is_farmer && isMyProfile)" #tabs-end>
                  <b-button
                      :disabled="is_farmer && isMyProfile"
                      variant="primary"
                      @click="editUser"
                  >
                    <feather-icon
                        icon="EditIcon"
                        class="d-block d-md-none"
                    />
                    <span class="font-weight-bold d-none d-md-block">{{ $t('global.edit') }}</span>
                  </b-button>
                </template>
              </b-tabs>

            </b-collapse>
            <!--/ collapse -->
          </b-navbar>
        </div>
        <!--/ profile navbar -->
      </b-card>

      <b-card v-else class="profile-header container d-flex flex-row align-items-center justify-content-between">
        <div>
          <h1>{{ firstName }} {{ lastName }} <span v-if="userData.userType" class="font-small-4">- {{
              userData.userType
            }}</span></h1>
          <h3>{{ userData.role }} <span v-if="userData.status" class="font-small-4">- {{ userData.status }}</span></h3>
        </div>

        <div class="profile-header-nav">
          <b-navbar
              toggleable="md"
              type="light"
          >
            <!-- toggle button -->
            <b-navbar-toggle
                class="ml-auto"
                target="nav-edit"
            >
              <feather-icon
                  icon="AlignJustifyIcon"
                  size="21"
              />
            </b-navbar-toggle>
            <!--/ toggle button -->

            <!-- collapse -->
            <b-collapse
                id="nav-edit"
                is-nav
            >
              <b-tabs
                  pills
                  class="profile-tabs mt-md-0"
                  nav-class="mb-0"
              >
                <!-- edit buttons -->
                <template v-if="!is_call_center_manager && userData.role !== 'user'" #tabs-end>
                  <b-button
                      variant="primary"
                      class="ml-auto"
                      @click="editUser"
                  >
                    <feather-icon
                        icon="EditIcon"
                        class="d-block d-md-none"
                    />
                    <span class="font-weight-bold d-none d-md-block">{{ $t('global.edit') }}</span>
                  </b-button>
                </template>
                <!-- edit buttons -->
              </b-tabs>

            </b-collapse>
            <!--/ collapse -->
          </b-navbar>
        </div>

      </b-card>
    </template>

    <!-- Form: Personal Info Form -->
    <b-form v-if="userData" class="mt-1" cols="8">
      <b-card v-if="userData.role === 'farmer'">
        <!-- Header: Certificate -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="InfoIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('users.aboutFarmer') }}
          </h4>
        </div>

        <!-- Form: Certificate -->
        <b-row class="mt-1">

          <!-- Field: Stickers -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('sticker.title')"
                label-for="stickers"
            >
              <p v-for="s in stickers" :key="s.id" class="mb-0">
                - {{ s.title }}
              </p>
            </b-form-group>
          </b-col>

          <!-- Field: Responsible Person -->
          <b-col v-if="userData.role === 'farmer'"
                 cols="12"
                 md="6"
                 lg="4"
          >
            <b-form-group
                :label="$t('users.responsiblePerson')"
                label-for="link"
            >
              <p v-if="responsibleUser">
                {{ responsibleUser }} - {{ responsibleUserPhoneNumber }}
              </p>
              <span v-else> - </span>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <!-- Card: Farmer Certificates -->
      <b-card v-if="userData.role === 'farmer'">
        <!-- Header: Certificate -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="InfoIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('certificates.title') }}
          </h4>
        </div>

        <!-- Form: Certificate -->
        <b-row class="mt-1 d-flex justify-content-between">
          <certificates v-for="sticker in stickers" :key="sticker.id"
                        :sticker="sticker"
                        :is-editable="false"
                        :certificates-object="certificates.find(el => el.id == sticker.id) ? certificates.find(el => el.id == sticker.id) : sticker"/>
        </b-row>
      </b-card>

      <b-card>
        <!-- Header: Personal Info -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="UserIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('users.personalInfo') }}
          </h4>
        </div>

        <!-- Form: Personal Info Form -->
        <b-row>

          <!-- Field: First Name -->
          <b-col
              cols="12"
              md="6"
              lg="3"
          >
            <b-form-group
                :label="$t('users.name')"
                label-for="firstName"
            >
              <span id="firstName">{{ firstName }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: First Name English -->
          <b-col v-if="!isLegalEntity && userData.role === 'farmer'"
                 cols="12"
                 md="6"
                 lg="3"
          >
            <b-form-group
                :label="$t('users.name') + ' ' + $t('global.eng')"
                label-for="firstName_en"
            >
              <span id="firstName_en">{{ firstName_en }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: Last Name -->
          <b-col
              cols="12"
              md="6"
              lg="3"
          >
            <b-form-group
                :label="$t('users.lastname')"
                label-for="lastName"
            >
              <span id="lastName">{{ lastName }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: Last Name English-->
          <b-col v-if="!isLegalEntity && userData.role === 'farmer'"
                 cols="12"
                 md="6"
                 lg="3"
          >
            <b-form-group
                :label="$t('users.name') + ' ' + $t('global.eng')"
                label-for="lastName_en"
            >
              <span id="lastName_en">{{ lastName_en }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: User Name -->
          <b-col class="mt-2"
                 cols="12"
                 md="6"
                 lg="4"
          >
            <b-form-group
                :label="$t('users.username')"
                label-for="userName"
            >
              <span id="userName">{{ userData.userName }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: Identity Number -->
          <b-col class="mt-2"
                 cols="12"
                 md="6"
                 lg="4"
          >
            <b-form-group
                v-if="userData.role !== 'user'"
                :label="$t('users.personalId')"
                label-for="identity"
            >
              <span id="identity">{{ userData.identity }}</span>
            </b-form-group>
          </b-col>

        </b-row>
      </b-card>

      <b-card
          v-if="(userData.role === 'farmer' || userData.role === 'consul' || userData.role === 'user') && isLegalEntity"
      >
        <!-- Header: Juridical Info -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="UserIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('users.legalEntityInfo') }}
          </h4>
        </div>

        <!-- Form: Juridical Info Form -->
        <b-row>

          <!-- Field: Juridical Name -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.legalName')"
                label-for="juridicalName"
            >
              <span v-if="userData.juridicalInfo.juridicalName"
                    id="juridicalName"
              >{{ userData.juridicalInfo.juridicalName }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Commercial Name -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.commercialName')"
                label-for="commercialName"
            >
              <span v-if="juridicalInfo.commercialName"
                    id="commercialName"
              >{{ juridicalInfo.commercialName }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Commercial Name -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.commercialName_en')"
                label-for="commercialName_en"
            >
              <span v-if="juridicalInfo.commercialName_en"
                    id="commercialName_en"
              >{{ juridicalInfo.commercialName_en }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Juridical Type -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.legalEntityType')"
                label-for="juridicalType"
            >
              <span v-if="userData.juridicalInfo.juridicalType"
                    id="juridicalType"
              >{{ juridicalTypeOptions.find(el => el.value === userData.juridicalInfo.juridicalType).text }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Juridical Identification Number -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.companyId')"
                label-for="juridicalNumber"
            >
              <span v-if="userData.juridicalInfo.identificationNumber"
                    id="juridicalNumber"
              >{{ userData.juridicalInfo.identificationNumber }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

        </b-row>
      </b-card>

      <b-card>
        <!-- Header: Contact Information -->
        <div class="d-flex mb-2 align-items-center justify-content-between">
          <div class="d-flex">
            <feather-icon
                icon="PhoneIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('users.contactInfo') }}
            </h4>
          </div>

          <div v-if="(is_admin || is_consul) && userData.role === 'farmer'" class="d-flex">
            <!-- Save selected address-->
            <b-button :disabled="selected_phone_number === userData.phoneNumber"
                      variant="primary"
                      class="ml-2 d-flex"
                      @click="saveSelectedPhoneNumber"
            >
              <feather-icon
                  icon="EditIcon"
                  class="d-block mr-1"
              />
              <span class="font-weight-bold d-none d-md-block">{{ $t('users.saveSelectedPhoneNumber') }}</span>
            </b-button>
            <!-- Save selected address-->
            <!-- Add phone number-->
            <b-button
                variant="primary"
                class="ml-2 d-flex"
                @click="isAddPhoneNumberModalActive = true"
            >
              <feather-icon
                  icon="PlusIcon"
                  class="d-block mr-1"
              />
              <span class="font-weight-bold d-none d-md-block">{{$t('global.add')}} {{$t('users.phoneNumber')}}</span>
            </b-button>
            <!-- Add address-->
          </div>
        </div>

        <!-- Form: Phone Number Form -->
        <b-row>
          <!-- Field: Mobile -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group :label="$t('users.phoneNumber')">
              <b-form-radio-group v-if="userData.role === 'farmer'" v-model="selectedPhoneNumberId"
                                  :options="phoneNumbers"
              />
              <span v-else>{{ userData.phoneNumber }}</span>
            </b-form-group>
          </b-col>
          <!-- Field: Workspace Mobile Number -->
          <b-col v-if="userData.role === 'callCenterManager'"
                 cols="12"
                 md="6"
                 lg="4"
          >
            <b-form-group
                :label="$t('users.extensionNumber')"
                label-for="mobile"
            >
              <span>{{ userData.workspacePhoneNumber }}</span>
            </b-form-group>
          </b-col>

          <!-- Field: Email -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('global.email')"
                label-for="contact-options"
            >
              <span>{{ userData.email }}</span>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <b-card v-if="userData.role === 'farmer' || userData.role === 'consul' || userData.role === 'user'">
        <!-- Header: Address -->
        <div class="d-flex mb-2 align-items-center justify-content-between">
          <div class="d-flex">
            <feather-icon
                icon="MapPinIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('address.address') }}
            </h4>
          </div>
          <div v-if="(is_admin || is_consul) && userData.role === 'farmer'" class="d-flex">
            <!-- Save selected address-->
            <b-button v-if="userData.address"
                      :disabled="selectedAddress === userData.address.id"
                      variant="primary"
                      class="ml-2 d-flex"
                      @click="saveSelectedAddress"
            >
              <feather-icon
                  icon="EditIcon"
                  class="d-block mr-1"
              />
              <span class="font-weight-bold d-none d-md-block">{{ $t('users.saveSelectedAddress') }}ი</span>
            </b-button>
            <!-- Save selected address-->
            <!-- Add address-->
            <b-button
                variant="primary"
                class="ml-2 d-flex"
                @click="isAddAddressModalActive = true"
            >
              <feather-icon
                  icon="PlusIcon"
                  class="d-block mr-1"
              />
              <span class="font-weight-bold d-none d-md-block">{{$t('global.add')}} {{ $t('address.address') }}</span>
            </b-button>
            <!-- Add address-->
          </div>
        </div>

        <b-form-radio-group v-model="selectedAddress"
                            :options="addresses"
        />
      </b-card>

      <b-card v-if="userData.role === 'courier' || userData.role === 'logisticsManager'">
        <!-- Header: Vehicle -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="TruckIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('users.vehicleInformation') }}
          </h4>
        </div>

        <!-- Form: Vehicle -->
        <b-row class="mt-1">

          <!-- Field: Vehicle Manufacturer -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.vehicleBrand')"
                label-for="manufacturer"
            >
              <span v-if="vehicle.manufacturer">{{ vehicle.manufacturer }}</span>
              <span v-else>-</span>

            </b-form-group>
          </b-col>

          <!-- Field: Vehicle Model -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.vehicleModel')"
                label-for="model"
            >
              <span v-if="vehicle.model">{{ vehicle.model }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Village -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.vehicleRegistrationNumber')"
                label-for="licensePlate"
            >
              <span v-if="vehicle.licensePlate">{{ vehicle.licensePlate }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Address -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.licenseNumber')"
                label-for="licenseNumber"
            >
              <span v-if="licenseNumber !== ''">{{ licenseNumber }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <b-card v-if="userData.role === 'farmer'">
        <!-- Header: Bank Requisites -->
        <div class="d-flex mb-2">
          <feather-icon
              icon="CreditCardIcon"
              size="19"
          />
          <h4 class="mb-0 ml-50">
            {{ $t('users.requisite') }}
          </h4>
        </div>

        <!-- Form: Requisites -->
        <b-row class="mt-1">

          <!-- Field: Bank requisites -->
          <b-col
              cols="12"
              md="6"
              lg="4"
          >
            <b-form-group
                :label="$t('users.bankAccountNumber')"
                label-for="bankAccountNumber"
            >
              <span v-if="!isCash">{{ bankAccountNumber }}</span>
              <span v-else>{{ $t('global.cash') }}</span>

            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </b-form>

    <add-address-modal
        :regions-list="regionsList"
        :villages-list="villagesList"
        :municipalities-list="municipalitiesList"
        :is-add-address-modal-active.sync="isAddAddressModalActive"
        @add="addAddress"
        @hide="hideModal"
        @get-villages="fetchVillages"
        @get-municipalities="fetchMunicipalities"
    />

    <add-phone-number-modal
        :is-add-phone-number-modal-active.sync="isAddPhoneNumberModalActive"
        @add="addPhoneNumber"
        @hide="hideModal"
    />
  </div>
</template>

<script>
/* eslint-disable */

import {onUnmounted, ref} from "@vue/composition-api";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import router from "@/router";
import {
  BCard,
  BImg,
  BCardImg,
  BNavbar,
  BNavbarToggle,
  BCollapse,
  BTabs,
  BNavItem,
  BButton,
  BCol,
  BRow,
  BForm,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormCheckboxGroup,
  BFormInvalidFeedback,
  BFormCheckbox, BFormSelect,
  BInputGroup,
  BFormRadio,
  BMedia,
  BAvatar,
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component'
import {ValidationObserver, ValidationProvider} from "vee-validate";
import Ripple from 'vue-ripple-directive'
import {required, alphaNum, email} from '@validations'
import useUsersList from "@/views/apps/user/users-list/useUsersList";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import AddAddressModal from "@/views/apps/user/user-profile/components/AddAddressModal";
import AddPhoneNumberModal from "@/views/apps/user/user-profile/components/AddPhoneNumberModal";
import Certificates from "@/views/apps/user/user-profile/components/Certificates";

export default {
  name: "UserProfile",

  components: {
    Certificates,
    AddPhoneNumberModal,
    AddAddressModal,
    FormSelectStandard,
    HorizontalNavbar,
    BCard,
    BTabs,
    BButton,
    BNavItem,
    BNavbar,
    BNavbarToggle,
    BCollapse,
    BImg,
    BCardImg,
    vSelect,
    flatPickr,
    BCol,
    BRow, BForm, BFormGroup, BFormInput, BFormRadioGroup, BFormCheckboxGroup,
    BFormInvalidFeedback,
    BFormCheckbox,
    BFormSelect,
    BInputGroup,
    BFormRadio,
    BMedia,
    BAvatar,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },

  directives: {
    Ripple,
  },

  data() {
    return {
      required,
      alphaNum,
      loader: false,
      userData: null,
      isEditUserSidebarActive: false,
      isAddAddressModalActive: false,
      isAddPhoneNumberModalActive: false,
      role: '',
      sidebarFields: {},
      requestPath: '',
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
      isCash: false,
      selectedAddress: '',
      selectedPhoneNumberId: '',
      selectedStickersArray: [],
      addresses: [],
      phoneNumbers: [],
      address: {
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
      responsibleUserPhoneNumber: '',
      bankAccountNumber: '',
      licenseNumber: '',
      vehicle: {
        manufacturer: '',
        model: '',
        licensePlate: ''
      },
      stickers: [],
      certificates: [],
      personalInfo: {
        profileImage: '',
        coverImage: '',
        videoLink: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          }
        ]
      },
      juridicalTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'LimitedPartnership', text: this.$i18n.t('legalEntityTypes.jointAndSeveralLiabilityCompany')},
        {value: 'LimitedLiability', text: this.$i18n.t('legalEntityTypes.limitedLiabilityCompany')},
        {value: 'Cooperative', text: this.$i18n.t('legalEntityTypes.cooperative')},
        {value: 'Individual', text: this.$i18n.t('legalEntityTypes.individualEntrepreneur')},
        {value: 'Small', text: this.$i18n.t('legalEntityTypes.soleProprietorship')},
      ],
      isMyProfile: false,

      regionsList: [],
      villagesList: [],
      municipalitiesList: [],
      consulsList: [],

      userId: null,

      userDataInfo: {
        dob: null,
        mobile: '+6595895857',
        website: 'https://rowboat.com/insititious/Angelo',
        language: 'French',
        gender: 'female',
        contactOptions: ['Email', 'Message'],
        addressLine1: 'A-65, Belvedere Streets',
        addressLine2: '',
        postcode: '',
        city: 'New York',
        state: '',
        country: '',
      },
    }
  },

  mounted() {
    this.userId = router.currentRoute.params.id ? router.currentRoute.params.id : JSON.parse(localStorage.getItem('userInfo')).unique_name
    this.isMyProfile = !router.currentRoute.params.id
    this.fetchRegions();
    if (router.currentRoute.params.id) {
      this.fetchUserProfile()
    } else {
      this.fetchMyProfile()
    }
  },

  computed: {
    validate_username() {
      if (this.userName && this.userName.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.@]{6,100}$').test(this.userName)
    },
    validate_license_number() {
      if (this.licenseNumber && this.licenseNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.licenseNumber)
    },
    validate_bank_account_number() {
      if (this.isCash) return true;
      else if (this.bankAccountNumber && this.bankAccountNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.bankAccountNumber)
    },
    selected_phone_number() {
      let phoneObj = this.phoneNumbers.find(a => a.id === this.selectedPhoneNumberId)
      return phoneObj ? phoneObj.number : ''
    },

    is_admin() {
      return localStorage.getItem('role') === 'admin'
    },

    is_consul() {
      return localStorage.getItem('role') === 'consul'
    },

    is_call_center_manager() {
      return localStorage.getItem('role') === 'callCenterManager'
    },

    is_farmer() {
      return localStorage.getItem('role') === 'farmer'
    },

    cover_image() {
      return process.env.VUE_APP_STATIC_RESOURCES_URL + '/' + this.personalInfo.coverImage
    },

    profile_image() {
      return process.env.VUE_APP_STATIC_RESOURCES_URL + '/' + this.personalInfo.profileImage
    }
  },

  methods: {
    fetchUserProfile() {
      store.dispatch('app-user/fetchUser', {id: this.userId})
          .then(response => {
            this.userData = response.data
            this.role = this.userData.role
            this.sidebarFields['id'] = this.userData.id;
            this.sidebarFields = this.userData
            this.requestPath = this.requestUrls[this.role].edit
            this.updateUserInfo(response.data);
          })
          .catch(error => {
            console.log(error)
            // if (error.response.status === 404) {
            //   this.userData = undefined
            // }
          })
    },

    fetchMyProfile() {
      store.dispatch('app-user/fetchProfile')
          .then(response => {
            this.userData = response
            this.role = this.userData.role
            this.sidebarFields['id'] = this.userData.id;
            this.sidebarFields = this.userData
            this.requestPath = this.requestUrls[this.role].edit
            this.updateUserInfo(response);
          })
          .catch(error => {
            console.log(error)
          })
    },

    publishFarmer(payload) {
      this.loader = true;
      store.dispatch('app-user/publishFarmer', {id: payload.id, value: payload.status})
          .then((response) => {
            this.loader = false;
          })
    },

    fetchUserAddresses(id) {
      // this.loader = true;
      store.dispatch('app-user/fetchUserAddresses', {id: id})
          .then((response) => {
            this.addresses = [];
            response.data.forEach(a => {
              this.addresses.push({
                id: a.id,
                value: a.id,
                html: `<div><p><b>${this.$i18n.t('address.region')}</b>: <span>${a.region}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.municipality')}</b>: <span>${a.municipality}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.village')}</b>: <span>${a.village}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.address')}</b>: <span>${a.address}</span></p> </div>
                      `,
                region: a.regionId,
                address: a.address,
                regionText: a.region,
                cityText: a.municipality,
                village: a.village
              })
              if (a.selected) this.selectedAddress = a.id
            })
          })
    },

    fetchUserPhoneNumbers(id) {
      // this.loader = true;
      store.dispatch('app-user/fetchUserPhoneNumbers', {id: id})
          .then((response) => {
            this.phoneNumbers = [];
            response.data.forEach(a => {
              this.phoneNumbers.push({
                id: a.id,
                value: a.id,
                number: a.number,
                html: `<div><span>${a.number}</span></p> </div>`,
              })
              if (a.selected) this.selectedPhoneNumberId = a.id
            })
          })
    },

    updateUserInfo(newVal) {
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

      if (newVal.role === 'user' && newVal.userType === 'Juridical') {
        this.firstName = newVal.juridicalInfo.directorFirstName
        this.lastName = newVal.juridicalInfo.directorLastName
      }
      this.userName = newVal.userName;
      this.identity = newVal.identity;
      this.email = newVal.email;
      this.phoneNumber = newVal.phoneNumber;
      this.workspacePhoneNumber = newVal.workspacePhoneNumber;
      this.password = newVal.password;
      this.confirmPassword = newVal.confirmPassword;
      this.isCash = newVal.enableCash;
      this.isLegalEntity = newVal.userType === 'Juridical';
      let commercialNames_en = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'en') : {} : {}
      let commercialNames_ka = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'ka') : {} : {}
      this.juridicalInfo = newVal.juridicalInfo ? {
        directorFirstName: newVal.directorFirstName,
        directorLastName: newVal.directorLastName,
        commercialName: newVal.role === 'user' ? newVal.juridicalInfo.commercialName : commercialNames_en ? commercialNames_ka.commercialName : '',
        commercialName_en: commercialNames_en ? commercialNames_en.commercialName : '',
        juridicalName: newVal.juridicalInfo.juridicalName,
        identificationNumber: newVal.juridicalInfo.identificationNumber,
        juridicalType: newVal.juridicalInfo.juridicalType,
      } : {}
      this.bankAccountNumber = newVal.bankAccountNumber;
      this.stickers = newVal.stickers;
      // this.certificates = newVal.certificates;
      this.certificates = newVal.groupedCertificates;
      this.responsibleUser = newVal.responsibleUser;
      this.responsibleUserPhoneNumber = newVal.responsibleUserPhoneNumber;
      this.licenseNumber = newVal.licenseNumber;
      this.vehicle = newVal.vehicle ? {
        manufacturer: newVal.vehicle.manufacturer,
        model: newVal.vehicle.model,
        licensePlate: newVal.vehicle.licensePlate
      } : {}
      this.address = newVal.address ? {
        region: newVal.address.regionId,
        address: newVal.address.address,
        regionText: this.regionsList.find(a => a.id == newVal.address.regionId),
      } : {}
      this.personalInfo = newVal.personalInfo ? {
        coverImage: newVal.personalInfo.coverImage === '' ? null : newVal.personalInfo.coverImage,
        profileImage: newVal.personalInfo.profileImage === '' ? null : newVal.personalInfo.profileImage,
        videoLink: newVal.personalInfo.videoLink,
        translations: [
          {
            languageCode: 'ka',
            text: newVal.personalInfo.text
          }
        ]
      } : {}
      let regionId = newVal.address ? newVal.address.regionId : ''
      let municipalityId = newVal.address ? newVal.address.municipalityId : ''
      this.fetchMunicipalities(regionId).then(() => {
        this.fetchVillages({municipalityId: municipalityId, regionId: regionId}).then(() => {
          this.fetchUserAddresses(this.userId);
          this.fetchUserPhoneNumbers(this.userId);
        });
      });
    },

    fetchRegions() {
      store.dispatch('app-user/fetchRegions')
          .then((response) => {
            this.regionsList = this.regionsList.concat(response.data.data)
          })
    },

    fetchConsuls() {
      return store.dispatch('app-user/fetchUsers', {role: 'Consul', take: -1})
          .then((response) => {
            this.consulsList = response ? response.data.map((a) => {
              return {title: a.firstName + ' ' + a.lastName + ' - ' + a.userName, id: a.id}
            }) : []
          })
    },

    fetchVillages(data) {
      return store.dispatch('app-user/fetchVillages', {region_id: data.regionId, municipality_id: data.municipalityId})
          .then((response) => {
            if (data.regionId) this.villagesList = response.data.data
            // else this.villagesFilteringOptions = this.villagesFilteringOptions.concat(response.data.data)

            this.address.village = this.villagesList ? this.villagesList.find(a => a.id === this.userData.address.villageId) : ''
          })
    },

    fetchMunicipalities(id) {
      return store.dispatch('app-user/fetchMunicipalities', {region_id: id})
          .then((response) => {
            if (id) this.municipalitiesList = response.data.data
            // else this.municipalitiesFilteringOptions = this.municipalitiesFilteringOptions.concat(response.data.data)
            this.address.cityText = this.municipalitiesList.find(a => a.id == this.userData.address.municipalityId)
          })
    },

    editUser() {
      this.$router.push({name: 'edit-user-profile', params: {id: this.userId}})
      // this.isEditUserSidebarActive = true
    },

    saveSelectedAddress() {
      store.dispatch('app-user/saveSelectedAddress', {
        user_id: this.userId,
        address_id: this.selectedAddress
      })
          .then((response) => {
            this.fetchUserProfile();
          })
    },

    addAddress(payload) {
      store.dispatch('app-user/addAddress', payload)
          .then((response) => {
            this.isAddAddressModalActive = false;
            this.fetchUserProfile();
          })
    },

    saveSelectedPhoneNumber() {
      store.dispatch('app-user/saveSelectedPhoneNumber', {
        user_id: this.userId,
        phone_id: this.selectedPhoneNumberId
      })
          .then((response) => {
            this.fetchUserProfile();
          })
    },

    addPhoneNumber(phone) {
      let payload = {
        user_id: this.userId,
        token: localStorage.getItem('token'),
        number: phone
      }
      store.dispatch('app-user/addPhoneNumber', payload)
          .then((response) => {
            this.isAddPhoneNumberModalActive = false;
            this.fetchUserProfile();
          })
    },

    hideModal({id}) {
      this.$refs[id].hide();
    },

    isInvalid(errors) {
      for (const [key, value] of Object.entries(errors)) {
        if (value.length > 0) return true
      }
      return !(this.validate_username && this.validate_bank_account_number);
    },

    goBack() {
      if (this.userData.role === 'callCenterManager') {
        router.push({name: 'call-center-managers-list'})
      } else if (this.userData.role === 'logisticsManager') {
        router.push({name: 'logistic-managers-list'})
      } else {
        router.push({name: this.userData.role + 's-list'})
      }
    },
  },

  setup(props) {
    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const {
      editFieldsDict,
      requestUrls
    } = useUsersList(props)

    return {
      editFieldsDict,
      requestUrls
    }

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-profile.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.profile-header.container {
  .card-body {
    align-items: center;
    justify-content: space-between;
    display: flex;
  }
}

.profile-header .profile-img-container {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.card-img-top {
  min-height: 30vh;
}
</style>
