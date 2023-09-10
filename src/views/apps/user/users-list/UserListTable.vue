<template>
  <div>
    <div class="d-flex align-items-start justify-content-between mb-1 mt-1">
      <div>{{ $t('notification.selectedUsers') }}
        <ul>
          <li v-for="item in selectedItems" :key="item.id">
            <span v-if="item.userType === 'Juridical'">{{ `${item.juridicalInfo.directorFirstName} ${item.juridicalInfo.directorLastName} - ${item.uniqueCode}` }}</span>
            <span v-else>{{ `${item.firstName} ${item.lastName} - ${item.uniqueCode}` }}</span>
          </li>
        </ul>
      </div>

      <div class="d-flex flex-column align-items-end">
        <div class="d-flex align-items-center justify-content-end mb-1">
          <b-form-file id="excelFile" v-model="excelFile" :placeholder="$t('uploadImage.uploadFileHere')"
                       accept="xls, xlsx, csv" @change="readFile"/>
          <b-button
              @click="sendNotificationByExcel"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="success"
              class="ml-1 text-nowrap"
          >
            <feather-icon
                icon="SendIcon"
                class="mr-50"
            />
            <span class="align-middle text-nowrap">{{ $t('notification.sendByExcel') }}</span>
          </b-button>
        </div>
        <b-button
            @click="sendNotification"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="ml-1"
            :disabled="!this.selectedItems.length"
        >
          <feather-icon
              icon="SendIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('notification.sendSelected') }}</span>
        </b-button>
        <b-button
            @click="sendToAllFilteredCustomers"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="warning"
            class="ml-1 mt-1"
            :disabled="isFiltered"
        >
          <feather-icon
              icon="SendIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('notification.sendToFiltered') }}</span>
        </b-button>
        <b-button
            @click="sendToAllCustomers"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="info"
            class="ml-1 mt-1"
            :disabled="!isFiltered"
        >
          <feather-icon
              icon="SendIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('notification.sendToAll') }}</span>
        </b-button>
      </div>
    </div>

    <div class="m-2">

      <!-- Table Top -->
      <b-row>

        <!-- Filter by juridical user type -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.customerType') }}</label>
            <v-select
                id="userType"
                v-model="userType"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="userTypeOptions"
                class="w-100"
                label="text"
            >
              <template #option="{ text }">
                <span> {{ text }}</span>
              </template>
            </v-select>
          </b-form-group>
        </b-col>

        <!-- Filter by juridical type -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.legalEntityType') }}</label>
            <v-select
                id="juridicalType"
                v-model="juridicalTypeFilter"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="juridicalTypeOptions"
                class="w-100"
                label="text"
            >
              <template #option="{ text }">
                <span> {{ text }}</span>
              </template>
            </v-select>
          </b-form-group>
        </b-col>

        <!-- Filter by gender -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.gender') }}</label>
            <v-select
                id="gender"
                v-model="genderFilter"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="genderOptions"
                class="w-100"
                label="text"
            >
              <template #option="{ text }">
                <span> {{ text }}</span>
              </template>
            </v-select>
          </b-form-group>
        </b-col>

        <!-- Filter by birth date -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.dateOfBirth') }}</label>
            <b-form-datepicker id="birthDate" v-model="birthDateFilter" reset-button></b-form-datepicker>
          </b-form-group>
        </b-col>

        <!-- Filter by from date -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.registrationFrom') }}</label>
            <b-form-datepicker id="date_from" v-model="dateFilterFrom" reset-button></b-form-datepicker>
          </b-form-group>
        </b-col>

        <!-- Filter by to date -->
        <b-col
            cols="12"
            md="3"
            class="mb-1 mb-md-0"
        >
          <b-form-group
              label-for="userType">
            <label>{{ $t('users.registrationTo') }}</label>
            <b-form-datepicker id="date_to" v-model="dateFilterTo" reset-button></b-form-datepicker>
          </b-form-group>
        </b-col>

        <!-- Search -->
        <b-col
            cols="12"
            md="6"
        >
          <b-form-group
              label-for="search">
            <label>{{ $t('global.search') }}</label>
            <b-form-input
                v-model="searchQuery"
                class="mr-1 d-inline-block"
                placeholder="Search..."
            />
          </b-form-group>
        </b-col>

      </b-row>

    </div>

    <b-table
        :ref="refForTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        :sort-by.sync="sortBy"
        :sort-desc.sync="isSortDirDesc"
        primary-key="id"
        show-empty
        empty-text="No matching records found"
        @row-selected="onRowSelected"
    >

      <!-- Column: User -->
      <template #cell(checkBox)="data">
        <select-user-checkbox :data="data.item" :index="data.index"
                              :is-selected="!!selectedItems.find(el => el.id === data.item.id)"
                              @check="onPreviewClick"
        />
      </template>

      <!-- Column: Unique Code -->
      <template #cell(uniqueCode)="data">
        <div class="text-nowrap">
          <span class="align-text-top text-capitalize">{{ data.item.uniqueCode }}</span>
        </div>
      </template>

      <!-- Column: User -->
      <template #cell(user)="data">
        <b-media v-if="data.item.userType === 'Juridical'" vertical-align="center" class="d-flex align-items-center">
          <b-link
              :to="{ name: 'user-profile', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.juridicalInfo.directorFirstName }} {{ data.item.juridicalInfo.directorLastName }}
          </b-link>
        </b-media>
        <b-media v-else vertical-align="center" class="d-flex align-items-center">
          <b-link
              :to="{ name: 'user-profile', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.firstName }} {{ data.item.lastName }}
          </b-link>
        </b-media>
      </template>

      <!-- Column: Email -->
      <template #cell(email)="data">
        <div class="text-nowrap">
          <span class="align-text-top">{{ data.item.email }}</span>
        </div>
      </template>

      <!-- Column: Phone -->
      <template #cell(phone)="data">
        <div class="text-nowrap">
          <span class="align-text-top text-capitalize">{{ data.item.phoneNumber }}</span>
        </div>
      </template>

      <!-- Column: City -->
      <template #cell(city)="data">
        <div class="text-nowrap" v-if="data.item.address">
          <span class="align-text-top text-capitalize">{{ data.item.address.municipality }}</span>
        </div>
      </template>

      <!-- Column: Address -->
      <template #cell(address)="data">
        <div class="text-nowrap" v-if="data.item.address">
          <span class="align-text-top text-capitalize">{{ data.item.address.address }}</span>
        </div>
      </template>

      <!-- Column: juridical Type -->
      <template #cell(juridicalType)="data">
        <div class="text-nowrap" v-if="data.item.juridicalInfo">
          <span class="align-text-top text-capitalize">{{ data.item.juridicalInfo.juridicalType }}</span>
        </div>
      </template>

      <!-- Column: identification Number -->
      <template #cell(identificationNumber)="data">
        <div class="text-nowrap" v-if="data.item.juridicalInfo">
          <span class="align-text-top text-capitalize">{{ data.item.juridicalInfo.identificationNumber }}</span>
        </div>
      </template>

      <!-- Column: Commercial Name -->
      <template #cell(commercialName)="data">
        <div class="text-nowrap" v-if="data.item.juridicalInfo">
          <span class="align-text-top text-capitalize">{{ data.item.juridicalInfo.commercialName }}</span>
        </div>
      </template>

      <!-- Column: Juridical Name -->
      <template #cell(juridicalName)="data">
        <div class="text-nowrap" v-if="data.item.juridicalInfo">
          <span class="align-text-top text-capitalize">{{ data.item.juridicalInfo.juridicalName }}</span>
        </div>
      </template>

      <!-- Column: Contact Person Name -->
      <template #cell(contactPerson)="data">
        <div class="text-nowrap" v-if="data.item.juridicalInfo">
            <span class="align-text-top text-capitalize">
              {{ data.item.juridicalInfo.contactPersonFirstName }}
              {{ data.item.juridicalInfo.contactPersonLastName }}
            </span>
        </div>
      </template>

      <!-- Column: Gender -->
      <template #cell(gender)="data">
        <div class="text-nowrap">
          <span class="align-text-top text-capitalize">{{ data.item.gender }}</span>
        </div>
      </template>

      <!-- Column: Registration Date -->
      <template #cell(date)="data">
        <div class="text-nowrap">
          <span class="align-text-top text-capitalize">{{ formatRegistrationDate(data.item.registrationDate) }}</span>
        </div>
      </template>

    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
            <span v-if="false" class="text-muted">Showing {{ dataMeta.from }}
              to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
              v-model="currentPage"
              :total-rows="totalUsers"
              :per-page="perPage"
              first-number
              last-number
              class="mt-1 mb-0 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BForm, BFormCheckbox,
  BBadge, BPagination, BFormSelect, BSpinner, BFormGroup, BFormFile, BFormInvalidFeedback, BFormDatepicker, BFormCheckboxGroup
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import UserListEditUser from "@/views/apps/user/users-list/UserListEditUser";
import UserListAddNew from "@/views/apps/user/users-list/UserListAddNew";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import useUsersList from "@/views/apps/user/users-list/useUsersList";
import {avatarText} from "@core/utils/filter";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import SelectUserCheckbox from "@/views/apps/user/users-list/SelectUserCheckbox";

export default {
  name: "UserListTable",
  components: {
    SelectUserCheckbox,
    PasswordInputField,
    FormSelectStandard,
    ValidationProvider,
    ValidationObserver,
    BFormInvalidFeedback,
    HorizontalNavbar,
    UserListEditUser,
    // UsersListFilters,
    UserListAddNew,
    BForm,
    BSpinner,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BPagination,
    BFormSelect,
    BFormGroup,
    BFormDatepicker,
    BFormCheckboxGroup,
    BFormCheckbox,
    BFormFile,
    vSelect,
  },
  directives: {
    Ripple,
  },
  props: ['notification', 'roleQuery', 'refForTable', 'hideModal', 'fetchNotifications'],
  data() {
    return {
      excelFile: [],
      src: '',
      tableColumns: [
        {key: 'checkBox', label: ''},
        {key: 'uniqueCode', label: 'ID'},
        {key: 'user', label: this.$i18n.t('users.name')},
        {key: 'userType', label: this.$i18n.t('users.customerType')},
        {key: 'identity', label: this.$i18n.t('users.personalId')},
        {key: 'phone', label: this.$i18n.t('users.phoneNumber')},
        {key: 'gender', label: this.$i18n.t('users.gender')},
        {key: 'birthDate', label: this.$i18n.t('users.dateOfBirth')},
        {key: 'email', label: this.$i18n.t('global.email')},
        {key: 'date', label: this.$i18n.t('users.registrationDate')},
        {key: 'region', label: this.$i18n.t('address.region')},
        {key: 'city', label: this.$i18n.t('address.municipality')},
        {key: 'address', label: this.$i18n.t('address.address')},
        {key: 'village', label: this.$i18n.t('address.village')},
        {key: 'juridicalType', label: this.$i18n.t('users.legalEntityType')},
        {key: 'identificationNumber', label: this.$i18n.t('users.companyId')},
        {key: 'commercialName', label: this.$i18n.t('users.commercialName')},
        {key: 'juridicalName', label: this.$i18n.t('users.legalName')},
        {key: 'contactPerson', label: this.$i18n.t('users.contactPerson')},
      ],
      formData: null,
      selectedItems: [],
      filteredToSend: [],
      genderOptions: [
        {value: '', text: this.$i18n.t('global.choose')},
        {value: 'Female', text: this.$i18n.t('global.female')},
        {value: 'Male', text: this.$i18n.t('global.male')},
      ],
      publishedOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'true', text: this.$i18n.t('global.published')},
        {value: 'false', text: this.$i18n.t('global.unpublished')},
      ],
      paymentTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'true', text: this.$i18n.t('global.cash')},
        {value: 'false', text: this.$i18n.t('global.card')},
      ],
      userTypeOptions: [
        {value: '', text: this.$i18n.t('global.choose')},
        {value: 'Physical', text: this.$i18n.t('customerTypes.naturalPerson')},
        {value: 'Juridical', text: this.$i18n.t('customerTypes.legalEntity')},
      ],
      juridicalTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'LimitedPartnership', text: this.$i18n.t('legalEntityTypes.jointAndSeveralLiabilityCompany')},
        {value: 'LimitedLiability', text: this.$i18n.t('legalEntityTypes.limitedLiabilityCompany')},
        {value: 'Cooperative', text: this.$i18n.t('legalEntityTypes.cooperative')},
        {value: 'Individual', text: this.$i18n.t('legalEntityTypes.individualEntrepreneur')},
        {value: 'Small', text: this.$i18n.t('legalEntityTypes.soleProprietorship')},
      ],
    }
  },
  mounted() {
  },
  methods: {
    formatRegistrationDate(date) {
      let dateFormat = require('dateformat');
      return dateFormat(new Date(date), "mmmm dS, yyyy");
    },
    onRowSelected(items) {
      // if (this.selectable) this.$emit('on-row-selected', items)
    },
    onPreviewClick({value, item}) {
      if (value) {
        this.selectedItems.push(item)
      } else {
        this.selectedItems = this.selectedItems.filter(el => {
          return el.id !== item.id
        })
      }
    },
    sendNotification() {
      store.dispatch('app-user/sendNotification', {id: this.notification.id, body: this.selectedItems.map(el => el.id)})
          .then(() => {
            this.toast('შეტყობინება წარმატებით გაიგზავნა');
            this.hideModal();
            this.fetchNotifications();
          }).catch((error) => {
            if(error.response.data.errors[0].value[0] === 'AlreadySent'){
              this.toast('არჩეულ მომხმარებლებთან შეტყობინება უკვე გაგზავნილია', 'warning')
            }else{
              this.toast('დაფიქსირდა შეცდომა', 'danger')
            }
      })
    },
    sendNotificationByExcel() {
      store.dispatch('app-user/sendNotificationByExcel', {id: this.notification.id, body: this.excelFile})
          .then(() => {
            this.toast('შეტყობინება წარმატებით გაიგზავნა');
            this.hideModal();
            this.fetchNotifications();
          }).catch(() => {
        this.toast('დაფიქსირდა შეცდომა', 'danger')
      })
    },
    sendToAllFilteredCustomers() {
     store.dispatch('app-user/fetchUsers', {
        gender: this.genderFilter.value ? this.genderFilter.value : '',
        regDateFrom: this.dateFilterFrom ? this.dateFilterFrom : '',
        regDateTo: this.dateFilterTo ? this.dateFilterTo : '',
        birthDate: this.birthDateFilter ? this.birthDateFilter : '',
        juridicalType: this.juridicalTypeFilter.value ? this.juridicalTypeFilter.value : '',
        role: 'Client',
        userType: this.userType.value ? this.userType.value : '',
        saerchWord: this.searchQuery ? this.searchQuery: '',
        take: -1,
      }).then((result) => {
        this.filteredToSend = result.data;
        this.sendToAllFiltered();
      })
    },
    sendToAllCustomers() {
     store.dispatch('app-user/fetchUsers', {
        role: 'Client',
        take: -1,
      }).then((result) => {
        this.filteredToSend = result.data;
        this.sendToAllFiltered();
      })
    },
    sendToAllFiltered() {
      const vari = this.filteredToSend.map(el => el.id);
      store.dispatch('app-user/sendNotification', {id: this.notification.id, body: this.filteredToSend.map(el => el.id)})
      .then(() => {
        this.toast('შეტყობინება წარმატებით გაიგზავნა');
        this.filteredToSend = [];
        this.hideModal();
        this.fetchNotifications();
      }).catch((error) => {
          if(error.response.data.errors[0].value[0] === 'AlreadySent'){
            this.toast('არჩეულ მომხმარებლებთან შეტყობინება უკვე გაგზავნილია', 'warning')
          }else{
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          }
      })
    },
    readFile(e) {
      this.excelFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', this.excelFile);
      this.formData = formData
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
  computed: {
    isFiltered() {
      if(this.userType != '' ||
        this.juridicalTypeFilter != '' ||
        this.genderFilter != '' ||
        this.birthDateFilter != '' ||
        this.dateFilterTo != '' ||
        this.dateFilterFrom != '' ||
        this.searchQuery != '') {
          return false;
        } else {
          return true;
        }
    }
  },
  setup(props) {
    const USER_APP_STORE_MODULE_NAME = 'app-user';

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    const {
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      regionFilter,
      genderFilter,
      municipalityFilter,
      villageFilter,
      dateFilter,
      dateFilterFrom,
      dateFilterTo,
      birthDateFilter,
      userType,
      activeFilter,
      stickersFilter,
      publishedFilter,
      paymentTypeFilter,
      juridicalTypeFilter,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,
      // regions,
      // fetchRegions,
      editFieldsDict,
      requestUrls,
      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,

    } = useUsersList(props)

    // fetchRegions();

    // watch(regions, val => {
    //     // this.regionsList = regions.value;
    //     console.log("watch regions", regions);
    // })
    return {

      // Sidebar
      editFieldsDict,
      requestUrls,
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      regionFilter,
      genderFilter,
      municipalityFilter,
      villageFilter,
      dateFilter,
      dateFilterFrom,
      dateFilterTo,
      birthDateFilter,
      userType,
      activeFilter,
      stickersFilter,
      publishedFilter,
      paymentTypeFilter,
      juridicalTypeFilter,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    }


  },
}
</script>

<style scoped>

</style>
