<template>

  <div>
    <horizontal-navbar></horizontal-navbar>

    <user-list-add-new v-if="regionsList.length"
                       :regions-list="regionsList"
                       :region-subpart="regionSubpart"
                       :villages-list="villagesList"
                       :municipalities-list="municipalitiesList"
                       :consuls-list="consulsList"
                       :registration-fields="registrationFields"
                       :request-path="addRequestPath"
                       :role="roleQuery"
                       :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
                       @get-villages="fetchVillages"
                       @get-municipalities="fetchMunicipalities"
                       @refetch-data="refetchData"
    />

    <user-list-edit-user v-if="regionsList.length"
                         :regions-list="regionsList"
                         :region-subpart="regionSubpart"
                         :villages-list="villagesList"
                         :municipalities-list="municipalitiesList"
                         :consuls-list="consulsList"
                         :edit-fields="editFields"
                         :role="roleQuery"
                         :edit-sidebar-fields="editSidebarFields"
                         :request-path="editRequestPath"
                         :is-edit-user-sidebar-active.sync="isEditUserSidebarActive"
                         @get-villages="fetchVillages"
                         @get-municipalities="fetchMunicipalities"
                         @refetch-data="refetchData"
    />

    <b-modal id="modal-change-password"
             ref="change-password-modal"
             size="md"
             class="p-3 pb-1"
             hide-header
             hide-footer
             centered>

      <div class="modal-custom-header d-flex align-items-center justify-content-between">
        <h4>პაროლის შეცვლა</h4>

        <b-button variant="flat-secondary" class="mr-1 btn-icon" size="lg" @click="hideModal">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>

      <password-input-field :current="false" @change="resetPassword"></password-input-field>
    </b-modal>

    <!-- Table Container Card -->
    <b-card
        no-body
        class="mb-0"
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
              cols="12"
              md="3"
              class="mb-1 d-flex align-items-center justify-content-start mb-md-0"
          >
            <label>{{ $t('users.show') }}</label>
            <div class="d-flex align-items-center" style="height: 50px">
              <v-select
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="perPageOptions"
                  :clearable="false"
                  class="per-page-selector mx-50"
              />
            </div>
            <label>{{ $t('users.entries') }}</label>
          </b-col>

          <!-- Export to excel -->
          <b-col
              cols="12"
              md="4"
              class="mb-1 d-flex align-items-center justify-content-start mb-md-0">
            <b-button variant="success" @click="exportToExcel">{{ $t('global.export') }}</b-button>
          </b-col>

          <!-- Search -->
          <b-col
              cols="12"
              md="5"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                  v-model="searchQuery"
                  class="mr-1 d-inline-block"
                  :placeholder="$t('global.search')"
              />
              <b-button v-if="editFields.role !== 'client' && isAdmin || isLogisticsManager || isConsul"
                        variant="primary"
                        @click="isAddNewUserSidebarActive = true"
              >
                <span class="text-nowrap">{{ $t('users.add') }}</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <div v-if="roleQuery === 'Farmer' || roleQuery === 'Client' || roleQuery === 'LogisticsManager' || roleQuery === 'Courier'
      || roleQuery === 'Admin' || roleQuery === 'CallCenterManager' || roleQuery === 'Consul'" class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Filter by consul -->
          <b-col v-if="roleQuery === 'Farmer'"
                 cols="12"
                 md="3"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('roles.consul') }}</label>
              <v-select
                  id="consul"
                  v-model="consulFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="consulsList"
                  class="w-100"
                  label="title"
              >
                <template #option="{ title }">
									<span>
										{{ title }}
									</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by juridical user type -->
          <b-col v-if="roleQuery === 'Client' || roleQuery === 'Farmer'"
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
          <b-col v-if="roleQuery === 'Client' || roleQuery === 'Farmer'"
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
          <b-col v-if="roleQuery === 'Client'"
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

          <!-- Filter by published/unpublished -->
          <b-col v-if="roleQuery === 'Farmer'"
                 cols="12"
                 md="3"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('users.publishedUnpublished') }}</label>
              <v-select
                  id="isPublished"
                  v-model="publishedFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="publishedOptions"
                  class="w-100"
                  label="text"
              >
                <template #option="{ text }">
                  <span> {{ text }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by active/inactive -->
          <b-col v-if="roleQuery === 'CallCenterManager' || roleQuery === 'Courier'"
                 cols="12"
                 md="3"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('users.status') }}</label>
              <v-select
                  id="isActive"
                  v-model="activeFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="editFields.status"
                  class="w-100"
                  label="text"
              >
                <template #option="{ text }">
                  <span> {{ text }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by payment type -->
          <b-col v-if="roleQuery === 'Farmer'"
                 cols="12"
                 md="3"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('users.paymentMethod') }}</label>
              <v-select
                  id="payment_type"
                  v-model="paymentTypeFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="paymentTypeOptions"
                  class="w-100"
                  label="text"
              >
                <template #option="{ text }">
                  <span> {{ text }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by region -->
          <b-col v-if="roleQuery === 'Farmer' || roleQuery === 'Consul'"
                 cols="12"
                 md="2"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('address.region') }}</label>
              <v-select
                  id="region"
                  v-model="regionFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="regionsList"
                  class="w-100"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by municipality -->
          <b-col v-if="roleQuery === 'Farmer' || roleQuery === 'Consul'"
                 cols="12"
                 md="2"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('address.municipality') }}</label>
              <v-select
                  id="municipality"
                  v-model="municipalityFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="municipalitiesFilteringOptions"
                  class="w-100"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by village -->
          <b-col v-if="roleQuery === 'Farmer' || roleQuery === 'Consul'"
                 cols="12"
                 md="2"
                 class="mb-1 mb-md-0"
          >
            <b-form-group
                label-for="userType">
              <label>{{ $t('address.village') }}</label>
              <v-select
                  id="village"
                  v-model="villageFilter"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="villagesFilteringOptions"
                  class="w-100"
                  label="title"
              >
                <template #option="{ title }">
                  <span> {{ title }}</span>
                </template>
              </v-select>
            </b-form-group>
          </b-col>

          <!-- Filter by birth date -->
          <b-col v-if="roleQuery === 'Client'"
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
          <b-col v-if="roleQuery === 'Farmer' || roleQuery === 'Admin' || roleQuery === 'Courier' || roleQuery === 'Client'
          || roleQuery === 'CallCenterManager' || roleQuery === 'LogisticsManager' || roleQuery === 'Consul'"
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
          <b-col v-if="roleQuery === 'Farmer' || roleQuery === 'Admin' || roleQuery === 'LogisticsManager' || roleQuery === 'Client'
          || roleQuery === 'CallCenterManager' || roleQuery === 'Consul' || roleQuery === 'Courier'"
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

        </b-row>

      </div>

      <b-row class="ml-2" v-if="roleQuery === 'Farmer'">
        <b-form-group
            :label="$t('sticker.stickerFilter')"
        >
          <b-form-checkbox-group
              v-model="stickersFilter"
              :options="stickersList"
              value-field="id"
              text-field="title"
              switches
              class="p-1 mx-auto mb-1 overflow-x-visible border rounded justify-content-center align-items-center"
          />
        </b-form-group>
      </b-row>

      <b-table
          ref="refUserListTable"
          class="position-relative"
          :items="fetchUsers"
          responsive
          :fields="computedColumns"
          primary-key="id"
          :sort-by.sync="sortBy"
          show-empty
          empty-text="No matching records found"
          :sort-desc.sync="isSortDirDesc"
          @row-selected="onRowSelected"
      >

        <!-- Column: Unique Code -->
        <template #cell(uniqueCode)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.uniqueCode }}</span>
          </div>
        </template>
        <!-- Column: User -->
        <template #cell(user)="data">
          <b-media v-if="data.item.userType === 'Juridical'" vertical-align="center" class="d-flex align-items-center">
            <template #aside>
              <b-avatar
                  size="32"
                  :src="data.item.avatar"
                  :text="avatarText(data.item.firstName + data.item.lastName)"
                  :variant="`light-${resolveUserRoleVariant(data.item.role)}`"
                  :to="{ name: 'user-profile', params: { id: data.item.id } }"
              />
            </template>
            <b-link
                :to="{ name: 'user-profile', params: { id: data.item.id } }"
                class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.juridicalInfo.directorFirstName }} {{ data.item.juridicalInfo.directorLastName }}
            </b-link>
          </b-media>
          <b-media v-else vertical-align="center" class="d-flex align-items-center">
            <template #aside>
              <b-avatar
                  size="32"
                  :src="data.item.avatar"
                  :text="avatarText(data.item.firstName + data.item.lastName)"
                  :variant="`light-${resolveUserRoleVariant(data.item.role)}`"
                  :to="{ name: 'user-profile', params: { id: data.item.id } }"
              />
            </template>
            <b-link
                :to="{ name: 'user-profile', params: { id: data.item.id } }"
                class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.firstName }} {{ data.item.lastName }}
            </b-link>
          </b-media>
        </template>

        <!-- Column: Role -->
        <template v-if="false" #cell(role)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.role }}</span>
          </div>
        </template>

        <!-- Column: Verified -->
        <template #cell(verified)="data">
          <div class="text-nowrap">
            <span v-if="data.item.verified" class="align-text-top text-capitalize">დასრულებული</span>
            <span v-else class="align-text-top text-capitalize text-warning">დაუსრულებელი</span>
          </div>
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

        <!-- Column: Region -->
        <template #cell(region)="data">
          <div class="text-nowrap" v-if="data.item.address">
            <span class="align-text-top text-capitalize">{{ data.item.address.region }}</span>
          </div>
        </template>

        <!-- Column: City -->
        <template #cell(city)="data">
          <div class="text-nowrap" v-if="data.item.address">
            <span class="align-text-top text-capitalize">{{ data.item.address.municipality }}</span>
          </div>
        </template>

        <!-- Column: Village -->
        <template #cell(village)="data">
          <div class="text-nowrap" v-if="data.item.address">
            <span class="align-text-top text-capitalize">{{ data.item.address.village }}</span>
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

        <!-- Column: Vehicle Manufacturer -->
        <template #cell(vehicleManufacturer)="data">
          <div class="text-nowrap" v-if="data.item.vehicleInfo">
            <span class="align-text-top text-capitalize">{{ data.item.vehicleInfo.manufacturer }}</span>
          </div>
        </template>

        <!-- Column: Vehicle Model -->
        <template #cell(vehicleModel)="data">
          <div class="text-nowrap" v-if="data.item.vehicleInfo">
            <span class="align-text-top text-capitalize">{{ data.item.vehicleInfo.model }}</span>
          </div>
        </template>

        <!-- Column: License Plate -->
        <template #cell(licensePlate)="data">
          <div class="text-nowrap" v-if="data.item.vehicleInfo">
            <span class="align-text-top text-capitalize">{{ data.item.vehicleInfo.licensePlate }}</span>
          </div>
        </template>

        <!-- Column: Work Phone -->
        <template v-if="roleQuery === 'CallCenterManager'"
                  #cell(workPhone)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.workspacePhoneNumber }}</span>
          </div>
        </template>

        <!-- Column: Gender -->
        <template #cell(gender)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.gender }}</span>
          </div>
        </template>

        <!-- Column: Responsible person -->
        <template #cell(consul)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.responsiblePerson }}</span>
          </div>
        </template>

        <!-- Column: Registration Date -->
        <template #cell(date)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ formatRegistrationDate(data.item.registrationDate) }}</span>
          </div>
        </template>

        <!-- Column: Change Status -->
        <template #cell(status)="data"
                  v-if="editFields.role === 'courier' || editFields.role === 'call_center_manager'">
          <div class="mr-2 text-nowrap">
            <form-select-standard
                :id="data.item.id"
                :selected="data.item.userStatus"
                :loader="loader"
                :options="editFields.status"
                @update="updateStatus"/>
          </div>
        </template>

        <!-- Column: Sticker -->
        <template v-if="editFields.role === 'farmer'"
                  #cell(sticker)="data">
          <div class="mr-2 text-nowrap">
            <ul>
              <li v-for="s in data.item.stickers" :key="s.id">
                {{ s.title }}
              </li>
            </ul>
          </div>
        </template>

        <!-- Column: Cash or Card -->
        <template v-if="editFields.role === 'farmer'"
                  #cell(enableCash)="data">
          <div class="mr-2 text-nowrap">
            <span v-if="data.item.enableCash">ქეში</span>
            <span v-else>ბარათი</span>
          </div>
        </template>

        <!-- Column: Publish -->
        <template #cell(published)="data"
                  v-if="editFields.role === 'farmer'">
          <div class="text-nowrap">
            <form-select-standard :id="data.item.id"
                                  :selected="data.item.published"
                                  :loader="loader"
                                  @update="publishFarmer"/>
          </div>
        </template>

        <!-- Column: Reset Password -->
        <template v-if="isAdmin || isConsul" #cell(reset_password)="data">
          <b-button class="btn-icon" variant="flat-primary" @click="openResetPasswordModal(data.item)">
            <feather-icon v-if="!resetLoader" size="16" icon="RefreshCcwIcon"/>
            <b-spinner :key="data.item.id" v-else small/>
          </b-button>
        </template>

        <!-- Column: Actions -->
        <template v-if="isAdmin || isConsul" #cell(actions)="data">
          <div class="d-flex align-items-center">
            <b-button v-if="roleQuery !== 'Client'" class="btn-icon" variant="flat-primary"
                      @click="openEditSidebar(data.item)">
              <feather-icon size="16" icon="EditIcon"/>
            </b-button>

            <b-button v-if="isAdmin && roleQuery !== 'Client'" class="btn-icon" variant="flat-danger"
                      @click="confirmText(data.item, 'delete')">
              <feather-icon size="16" icon="TrashIcon"/>
            </b-button>

            <b-button v-if="isAdmin && roleQuery === 'Client'" :id="data.item.id" class="btn-icon" variant="flat-danger"
                      @click="confirmText(data.item, 'permanentDelete')">
              <feather-icon size="16" icon="TrashIcon"/>
            </b-button>

            <b-button v-if="isAdmin && data.item.role !== 'admin' && roleQuery !== 'Client'" :id="data.item.id"
                      class="btn-icon"
                      variant="flat-success"
                      @click="confirmText(data.item, 'login')">
              <feather-icon size="16" icon="UserIcon"/>
            </b-button>
            <b-tooltip :target="data.item.id" triggers="hover">
              {{ data.item.uniqueCode }}
              {{ roleQuery === 'Client' ? $i18n.t(`users.permanentDelete`) : $i18n.t(`login.${editFields.role}`) }}
            </b-tooltip>
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
    </b-card>
  </div>
</template>

<script>

/* eslint-disable */
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BForm,
  BBadge, BPagination, BFormSelect, BSpinner, BFormGroup, BFormInvalidFeedback, BFormDatepicker, BFormCheckboxGroup,
  BTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import {saveAs} from 'file-saver';
import {ref, watch, onUnmounted} from '@vue/composition-api'
import {avatarText} from '@core/utils/filter'
import {ValidationProvider, ValidationObserver} from 'vee-validate'
// import UsersListFilters from './UsersListFilters.vue'
import useUsersList from './useUsersList'
import userStoreModule from '../userStoreModule'
import UserListAddNew from './UserListAddNew.vue'
import UserListEditUser from "./UserListEditUser";
import HorizontalNavbar from "../../../navbar/HorizontalNavbar";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import productStoreModule from "@/views/apps/products/productStoreModule";
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";

let FileSaver = require('file-saver');

export default {
  components: {
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
    BTooltip,
    vSelect,
  },

  props: ['usersList', 'registrationFields', 'editFields', 'roleQuery',
    'requestPath', 'addRequestPath', 'editRequestPath'],

  data() {
    return {
      // userTypeFilter: '',
      editSidebarFields: {},
      regionsList: [{id: '', default: true, title: this.$i18n.t('global.choose')}],
      villagesList: [],
      municipalitiesList: [],
      consulsList: [],
      password: '',
      confirm_password: '',
      user: null,
      loader: false,
      resetLoader: false,
      regionSubpart: [],
      stickersList: [],
      municipalitiesFilteringOptions: [{id: '', default: true, title: this.$i18n.t('global.choose')}],
      villagesFilteringOptions: [{id: '', default: true, title: this.$i18n.t('global.choose')}],
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
      tableColumns: [
        {key: 'actions', label: this.$i18n.t('global.actions')},
        {key: 'uniqueCode', label: this.$i18n.t('users.code')},
        {key: 'user', label: this.$i18n.t('users.name')},
        {key: 'verified', label: this.$i18n.t('users.verified')},
        {key: 'userType', label: this.$i18n.t('users.customerType')},
        {key: 'identity', label: this.$i18n.t('users.personalId')},
        {key: 'phone', label: this.$i18n.t('users.phoneNumber')},
        {key: 'gender', label: this.$i18n.t('users.gender')},
        {key: 'birthDate', label: this.$i18n.t('users.dateOfBirth')},
        {key: 'email', label: this.$i18n.t('global.email')},
        {key: 'date', label: this.$i18n.t('users.registrationDate')},
        {key: 'workPhone', label: this.$i18n.t('users.extensionNumber')},
        {key: 'status', label: this.$i18n.t('users.status')},
        {key: 'region', label: this.$i18n.t('address.region')},
        {key: 'city', label: this.$i18n.t('address.municipality')},
        {key: 'address', label: this.$i18n.t('address.address')},
        {key: 'village', label: this.$i18n.t('address.village')},
        {key: 'juridicalType', label: this.$i18n.t('users.legalEntityType')},
        {key: 'identificationNumber', label: this.$i18n.t('users.companyId')},
        {key: 'commercialName', label: this.$i18n.t('users.commercialName')},
        {key: 'juridicalName', label: this.$i18n.t('users.legalName')},
        {key: 'contactPerson', label: this.$i18n.t('users.contactPerson')},
        {key: 'consul', label: this.$i18n.t('users.responsiblePerson')},
        {key: 'vehicleManufacturer', label: this.$i18n.t('users.vehicleBrand')},
        {key: 'vehicleModel', label: this.$i18n.t('users.vehicleModel')},
        {key: 'licensePlate', label: this.$i18n.t('users.vehicleRegistrationNumber')},
        {key: 'sticker', label: this.$i18n.t('products.stickers')},
        {key: 'enableCash', label: this.$i18n.t('users.paymentMethod')},
        {key: 'published', label: this.$i18n.t('global.published')},
        {key: 'reset_password', label: this.$i18n.t('users.resetPassword')},
      ]
    }
  },

  computed: {
    computedColumns: function () {
      if (this.isAdmin) {
        this.getFilteredColumns(true);
      } else {
        this.getFilteredColumns(false)
      }
      return this.tableColumns
    },

    validate_password() {
      if (this.password.length === 0) return null
      return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$').test(this.password)
    },

    validate_confirm_password() {
      if (this.confirm_password.length === 0) return null
      return this.confirm_password === this.password
    },

    is_valid() {
      return this.validate_password && this.validate_confirm_password;
    },

    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },

    isLogisticsManager() {
      return localStorage.getItem('role') === 'logisticsManager'
    },

    isConsul() {
      return localStorage.getItem('role') === 'consul'
    }
  },

  watch: {
    regionFilter: function (newVal) {
      this.fetchMunicipalities(newVal ? newVal.id : '', true)
      this.fetchVillages({regionId: newVal ? newVal.id : '', municipality_id: ''}, true)
      this.villageFilter = ref(null)
      this.municipalityFilter = ref(null)
    },
    municipalityFilter: function (newVal) {
      this.fetchVillages({region_id: newVal ? newVal.regionId : '', municipality_id: newVal ? newVal.id : ''}, true)
      this.villageFilter = ref(null)
    },
  },

  mounted() {
    this.fetchRegions();
    if (this.editFields.consul && !this.isConsul)
      this.fetchConsuls();
    this.fetchFilteringOptions();
    this.fetchStickers();
  },

  methods: {
    formatRegistrationDate(date) {
      let dateFormat = require('dateformat');
      return dateFormat(new Date(date), "mmmm dS, yyyy");
    },

    openEditSidebar(user) {
      store.dispatch('app-user/fetchUser', user)
          .then((response) => {
            this.editSidebarFields['id'] = user.id;
            this.editSidebarFields = response.data;
            this.isEditUserSidebarActive = true;
          })
    },

    confirmText(user, action) {
      let titleText = this.$i18n.t('users.areYouSure');
      action === 'login' ? titleText += ` ${user.uniqueCode} ${this.$i18n.t('users.loginWithUser')}` :
          titleText += `მომხმარებლის, ID-ით ${user.uniqueCode}, ${action === 'permanentDelete' ? 'სამუდამოდ' : ''} წაშლა?`
      this.$swal({
        text: titleText,
        icon: action === 'permanentDelete' ? 'danger' : 'warning',
        showCancelButton: true,
        confirmButtonText: this.$i18n.t('global.yes'),
        cancelButtonText: this.$i18n.t('global.no'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          if (action === 'delete') this.deleteUser(user)
          if (action === 'permanentDelete') this.deleteUserPermanently(user)
          if (action === 'login') this.bypassLogin(user)
        }
      })
    },

    deleteUser(user) {
      store.dispatch('app-user/deleteUser', user)
          .then(() => {
            this.$swal({
              icon: 'success',
              title: 'მომხმარებელი წაშლილია!',
              text: `${user.firstName} ${user.lastName} წარმატებით წაიშალა`,
              customClass: {
                confirmButton: 'btn btn-success',
              },
            })
            this.refetchData()
          })
    },

    deleteUserPermanently(user) {
      store.dispatch('app-user/deleteUserPermanently', user)
          .then(() => {
            this.$swal({
              icon: 'success',
              title: 'მომხმარებელი წაშლილია სამუდამოდ!',
              text: `${user.firstName} ${user.lastName} წარმატებით წაიშალა`,
              customClass: {
                confirmButton: 'btn btn-success',
              },
            })
            this.refetchData()
          })
    },

    bypassLogin(user) {
      store.dispatch('app-user/bypassLogin', user)
          .then((response) => {
            let parsedToken = this.parseJwt(response.token.token)
            localStorage.setItem('role', parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            localStorage.setItem('token', response.token.token);
            localStorage.setItem('refreshToken', response.token.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(parsedToken));
            localStorage.setItem('userData', '{"id":1,"fullName":"John Doe","username":"johndoe","avatar":"/img/13-small.d796bffd.png","email":"admin@demo.com","role":"admin","ability":[{"action":"manage","subject":"all"}],"extras":{"eCommerceCartItemsCount":5}}')
            this.$swal({
              icon: 'success',
              title: this.$i18n.t('users.userChanged'),
              text: `${this.$i18n.t('users.userChanged')} ID - ${user.uniqueCode}`,
              customClass: {
                confirmButton: 'btn btn-success',
              },
            })
            setTimeout(() => {
              window.location.href = `/${localStorage.getItem('lang')}/main`;
            }, 2000)
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

    fetchRegions() {
      store.dispatch('app-user/fetchRegions')
          .then((response) => {
            this.regionsList = this.regionsList.concat(response.data.data)
          })
    },

    fetchStickers() {
      return store.dispatch('app-product/fetchStickers')
          .then((response) => {
            this.stickersList = response.data
          })
    },

    fetchConsuls() {
      store.dispatch('app-user/fetchUsers', {role: 'Consul', take: -1})
          .then((response) => {
            this.consulsList = response.data.map((a) => {
              return {title: a.firstName + ' ' + a.lastName + ' - ' + a.userName, id: a.id}
            })
          })
    },

    fetchVillages(data, isForFilter = false) {
      return store.dispatch('app-user/fetchVillages', {
        region_id: data.region_id,
        municipality_id: data.municipality_id
      })
          .then((response) => {
            if (!isForFilter) this.villagesList = response.data.data
            else this.villagesFilteringOptions = response.data.data
            // else this.villagesFilteringOptions = this.villagesFilteringOptions.concat(response.data.data)
          })
    },

    fetchFilteringOptions() {
      this.fetchVillages({});
      this.fetchMunicipalities(null);
    },

    fetchMunicipalities(id, isForFilter = false) {
      store.dispatch('app-user/fetchMunicipalities', {region_id: id})
          .then((response) => {
            if (!isForFilter) this.municipalitiesList = response.data.data
            else this.municipalitiesFilteringOptions = response.data.data
            // else this.municipalitiesFilteringOptions = this.municipalitiesFilteringOptions.concat(response.data.data)
          })
    },

    updateStatus(payload) {
      this.loader = true;
      store.dispatch('app-user/setStatus', {id: payload.id, status: payload.status})
          .then((response) => {
            this.loader = false;
          })
    },

    exportToExcel(payload) {
      store.dispatch('app-user/exportToExcel', {userType: this.roleQuery})
          .then((response) => {

            FileSaver.saveAs(response, this.roleQuery + "s_list.xlsx");
          })
    },

    publishFarmer(payload) {
      this.loader = true;
      store.dispatch('app-user/publishFarmer', {id: payload.id, value: payload.status})
          .then((response) => {
            this.loader = false;
          })
    },

    toast(variant, title, icon) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: title,
          icon: icon,
          variant: variant,
        },
      })
    },

    openResetPasswordModal(user) {
      this.user = user;
      this.showModal()
    },

    hideModal() {
      this.$refs['change-password-modal'].hide();
    },

    showModal() {
      this.$refs['change-password-modal'].show();
    },

    resetPassword(payload) {
      this.resetLoader = true;
      store.dispatch('app-user/resetUserPassword', {
        id: this.user.id,
        confirm_password: payload.confirm_password,
        password: payload.password
      })
          .then(() => {
            this.resetLoader = false;
            this.user = null;
            this.hideModal();
            this.toast('success', 'პაროლი წარმატებით შეიცვალა', 'KeyIcon')
          })
          .catch(() => {
            this.toast('danger', 'დაფიქსირდა შეცდომა', 'AlertCircleIcon')
          })

    },

    getFilteredColumns(isAdmin) {
      if (this.editFields.role === 'call_center_manager') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'userType'
            && a.key !== 'gender'
            && a.key !== 'vehicleManufacturer'
            && a.key !== 'vehicleModel'
            && a.key !== 'licensePlate'
            && a.key !== 'commercialName'
            && a.key !== 'corporateName'
            && a.key !== 'juridicalType'
            && a.key !== 'juridicalName'
            && a.key !== 'identificationNumber'
            && a.key !== 'birthDate'
            && a.key !== 'contactPerson'
            && a.key !== 'region'
            && a.key !== 'city'
            && a.key !== 'address'
            && a.key !== 'published'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'verified'
            && a.key !== 'village')
      }
      if (this.editFields.role === 'courier') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'gender'
            && a.key !== 'userType'
            && a.key !== 'commercialName'
            && a.key !== 'corporateName'
            && a.key !== 'juridicalType'
            && a.key !== 'juridicalName'
            && a.key !== 'verified'
            && a.key !== 'identificationNumber'
            && a.key !== 'contactPerson'
            && a.key !== 'workPhone'
            && a.key !== 'region'
            && a.key !== 'city'
            && a.key !== 'address'
            && a.key !== 'published'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'village')
      }
      if (this.editFields.role === 'farmer') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'status'
            && a.key !== 'gender'
            && a.key !== 'vehicleManufacturer'
            && a.key !== 'address'
            && a.key !== 'vehicleModel'
            && a.key !== 'contactPerson'
            && a.key !== 'birthDate'
            && a.key !== 'verified'
            && a.key !== 'identificationNumber'
            && a.key !== 'licensePlate' && a.key !== 'workPhone')
      }
      if (this.editFields.role === 'logistics_manager') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'gender'
            && a.key !== 'status'
            && a.key !== 'userType'
            && a.key !== 'verified'
            && a.key !== 'commercialName'
            && a.key !== 'corporateName'
            && a.key !== 'juridicalType'
            && a.key !== 'juridicalName'
            && a.key !== 'identificationNumber'
            && a.key !== 'contactPerson'
            && a.key !== 'birthDate'
            && a.key !== 'workPhone'
            && a.key !== 'region'
            && a.key !== 'city'
            && a.key !== 'address'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'published'
            && a.key !== 'village')
      }
      if (this.editFields.role === 'consul') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'gender'
            && a.key !== 'vehicleManufacturer'
            && a.key !== 'vehicleModel'
            && a.key !== 'verified'
            && a.key !== 'licensePlate' && a.key !== 'status'
            && a.key !== 'userType'
            && a.key !== 'commercialName'
            && a.key !== 'corporateName'
            && a.key !== 'juridicalName'
            && a.key !== 'identificationNumber'
            && a.key !== 'juridicalType'
            && a.key !== 'birthDate'
            && a.key !== 'contactPerson'
            && a.key !== 'address'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'published'
            && a.key !== 'workPhone')
      }
      if (this.editFields.role === 'client') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'vehicleManufacturer'
            && a.key !== 'vehicleModel'
            && a.key !== 'licensePlate'
            && a.key !== 'status'
            && a.key !== 'workPhone'
            && a.key !== 'region'
            && a.key !== 'identity'
            // && a.key !== 'city'
            && a.key !== 'village'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'published'
        )
      }
      if (this.editFields.role === 'admin') {
        this.tableColumns = this.tableColumns.filter(a =>
            a.key !== 'consul'
            && a.key !== 'gender'
            && a.key !== 'verified'
            && a.key !== 'vehicleManufacturer'
            && a.key !== 'vehicleModel'
            && a.key !== 'licensePlate'
            && a.key !== 'status'
            && a.key !== 'userType'
            && a.key !== 'commercialName'
            && a.key !== 'corporateName'
            && a.key !== 'juridicalName'
            && a.key !== 'identificationNumber'
            && a.key !== 'juridicalType'
            && a.key !== 'contactPerson'
            && a.key !== 'birthDate'
            && a.key !== 'workPhone'
            && a.key !== 'region'
            && a.key !== 'city'
            && a.key !== 'village'
            && a.key !== 'address'
            && a.key !== 'sticker'
            && a.key !== 'enableCash'
            && a.key !== 'published'
        )
      }

      if (this.isConsul) {
        this.tableColumns = this.tableColumns.filter(a => a.key !== 'consul')
      } else if (!this.isAdmin) {
        this.tableColumns = this.tableColumns.filter(a => a.key !== 'actions' && a.key !== 'reset_password')
      }

    },

    onRowSelected(items) {
      if (this.selectable) this.$emit('on-row-selected', items)
    },
  },

  setup(props) {
    const USER_APP_STORE_MODULE_NAME = 'app-user';
    const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    });

    // Register module
    if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME)
    });

    const isAddNewUserSidebarActive = ref(false);
    const isEditUserSidebarActive = ref(false);

    const roleOptions = [
      {label: 'Admin', value: 'admin'},
      {label: 'Author', value: 'author'},
      {label: 'Editor', value: 'editor'},
      {label: 'Maintainer', value: 'maintainer'},
      {label: 'Subscriber', value: 'subscriber'},
    ];

    const planOptions = [
      {label: 'Basic', value: 'basic'},
      {label: 'Company', value: 'company'},
      {label: 'Enterprise', value: 'enterprise'},
      {label: 'Team', value: 'team'},
    ];

    const statusOptions = [
      {label: 'Pending', value: 'pending'},
      {label: 'Active', value: 'active'},
      {label: 'Inactive', value: 'inactive'},
    ];

    const regions = ref([])

    // const fetchRegions = () => {
    //   store.dispatch('app-user/fetchRegions').then((response) => {
    //     regions.value = response.data.data;
    //   })
    // };

    const {
      fetchUsers,
      // tableColumns,
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
      consulFilter,
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
      isAddNewUserSidebarActive,
      isEditUserSidebarActive,

      fetchUsers,
      // tableColumns,
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
      consulFilter,
      activeFilter,
      stickersFilter,
      publishedFilter,
      paymentTypeFilter,
      juridicalTypeFilter,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,
      regions,

      // Filter
      avatarText,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      roleOptions,
      planOptions,
      statusOptions,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    }


  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
