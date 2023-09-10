<template>
  <div>
    <horizontal-navbar/>
    <div class="villages-wrapper ">
      <b-col md="12" class="filtering d-flex align-items-center justify-content-start bg-white py-1 rounded">

        <!-- Filter by region -->
        <b-col
            cols="12"
            md="4"
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
                :clearable="false"
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
        <b-col
            cols="12"
            md="4"
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
                :clearable="false"
                class="w-100"
                label="title"
            >
              <template #option="{ title }">
                <span> {{ title }}</span>
              </template>
            </v-select>
          </b-form-group>
        </b-col>

        <!-- Search Query -->
        <b-col
            cols="12"
            md="4"
            class="mb-1 mb-md-0"
            >
            <b-form-group>
              <label>{{ $t('global.search') }}</label>
              <b-form-input
                  v-model="searchQuery"
                  class="mr-1 d-inline-block"
                  :placeholder="$t('global.search')"
              />
            </b-form-group>
        </b-col>
      </b-col>

      <b-col
          cols="12"
          sm="6"
          class="pt-2 pb-2 d-flex align-items-center justify-content-start"
      >

        <b-pagination
            v-model="currentPage"
            :total-rows="totalVillages"
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
      <b-col md="4">
        <b-list-group>
          <b-list-group-item class="">
            <village :is-empty="true"
                     :title="$t('address.villages')"
                     :disabled="regionFilter === '' || municipalityFilter === ''"
                     @add="addVillage"/>
          </b-list-group-item>
          <template v-if="villagesList.length">
            <b-list-group-item v-for="(village) in villagesList" :key="village.id + village.title">
              <village :category="village"
                       :next-visible="true"
                       @update="updateVillage"
                       @delete="deleteVillage"/>
            </b-list-group-item>
          </template>
        </b-list-group>
      </b-col>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BTable,
  BListGroup,
  BListGroupItem,
  BCard,
  BCardGroup,
  BCardHeader,
  BCollapse,
  BButton,
  BCardBody,
  BCardText,
  VBToggle,
  BTabs,
  BTab,
  BNavItem,
  BFormInput,
  BCol,
  BModal,
  BFormGroup,
  BPagination
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import {onUnmounted, ref} from "@vue/composition-api";
import Ripple from 'vue-ripple-directive'
import Category from "@/views/apps/category/components/Category";
import userStoreModule from "@/views/apps/user/userStoreModule";
import useUsersList from "@/views/apps/user/users-list/useUsersList";
import Village from "@/views/apps/address/components/village";
import vSelect from 'vue-select'
import ToastificationContent from "@core/components/toastification/ToastificationContent";

export default {
  name: "Villages",
  directives: {
    'b-toggle': VBToggle,
    Ripple,
  },
  components: {
    Village,
    Category,
    HorizontalNavbar,
    BTable,
    BListGroup,
    BCard,
    BCardGroup,
    BCardHeader,
    BCollapse,
    BButton,
    BCardBody,
    BCardText,
    BTabs,
    BTab,
    BNavItem,
    BFormInput,
    BCol,
    BListGroupItem,
    BModal,
    vSelect,
    BFormGroup,
    BPagination
  },
  data() {
    return {
      isSpecificationsModalVisible: false,
      subCategoriesVisible: false,
      productCategoriesVisible: false,
      specificationCategoryVisible: false,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedProductCategory: null,
      selectedSpecificationCategory: null,
      variant: '',
      categories: [],
      subCategories: [],
      productCategories: [],
      specificationCategories: [],
      specifications: [],
      specificationsVisible: false,
      specificationCategoriesVisible: false,
      product: [],

      regionsList: [{id: '', default: true, title: "აირჩიეთ"}],
      municipalitiesList: [],
      municipalitiesFilteringOptions: [{id: '', default: true, title: "აირჩიეთ"}],
      regionFilter: '',
      municipalityFilter: '',
      villagesList: [],
      searchQuery: '',

      currentPage: 1,
      perPage: 10,
      totalVillages: 0
    }
  },

  watch: {
    regionFilter: function (newVal) {
      this.fetchMunicipalities(newVal.id);
      this.fetchVillages({regionId: newVal.id});
      this.municipalityFilter = ''
      this.searchQuery = ''
    },
    municipalityFilter: function (newVal) {
      this.fetchVillages({regionId: newVal.id, municipalityId: newVal.id});
      this.searchQuery = ''
    },
    searchQuery: function (newVal) {
      this.fetchVillages({regionId: newVal.id, municipalityId: newVal.id});
    },
    currentPage(val) {
      this.fetchVillages({
        regionId: this.regionFilter.id,
        municipalityId: this.municipalityFilter.id,
        take: this.perPage,
        skip: this.perPage * (val - 1)
      });
    }
  },

  mounted() {
    this.fetchRegions();
    this.fetchVillages();
  },

  methods: {
    updateVillage(item) {
      let payload = {
        "id": item.category.id,
        "municipalityId": item.category.municipalityId,
        "translations": item.category.translations
      }
      console.log('item', item)
      store.dispatch('app-user/updateVillage', payload)
          .then((response) => {
            this.showToast({title: item.category.title + ' წარმატებით შეიცვალა', variant: 'warning'})
            this.fetchVillages({
              regionId: this.regionFilter.id,
              municipalityId: this.municipalityFilter.id,
              searchWord: this.searchQuery
            })
          })
    },
    deleteVillage(item) {
      store.dispatch('app-user/deleteVillage', {id: item.delete_id})
          .then((response) => {
            this.searchQuery = ''
            this.showToast({title: item.delete_id + ' წარმატებით წაიშალა', variant: 'danger'})
            this.fetchVillages({
              regionId: this.regionFilter.id,
              municipalityId: this.municipalityFilter.id,
              searchWord: this.searchQuery
            })
          })
    },
    addVillage(item) {
      let payload = {
        "regionId": this.regionFilter.id,
        "municipalityId": this.municipalityFilter.id,
        "translations": item.translations
      }
      store.dispatch('app-user/addVillage', payload)
          .then((response) => {
            this.showToast({title: ' წარმატებით დაემატა', variant: 'success'})
            this.fetchVillages({
              regionId: this.regionFilter.id,
              municipalityId: this.municipalityFilter.id,
              searchWord: this.searchQuery
            })
          })
    },

    fetchRegions() {
      store.dispatch('app-user/fetchRegions')
          .then((response) => {
            this.regionsList = this.regionsList.concat(response.data.data)
          })
    },


    fetchMunicipalities(id) {
      return store.dispatch('app-user/fetchMunicipalities', {region_id: id})
          .then((response) => {
            this.municipalitiesFilteringOptions = response.data.data
          })
    },

    fetchVillages(data = {}) {
      let payload = {
        take: this.perPage,
        skip: data.skip ? data.skip : 0,
        searchWord: this.searchQuery,
        region_id: data.regionId,
        municipality_id: data.municipalityId
      }
      return store.dispatch('app-user/fetchVillages', payload)
          .then((response) => {
            this.villagesList = response.data.data ? response.data.data : []
            this.totalVillages = response.data.meta ? response.data.meta.total : 0
          })
    },

    showToast(item) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: item.title,
          variant: item.variant,
          icon: 'BellIcon'
        },
      })
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
      // regionFilter,
      // municipalityFilter,
    } = useUsersList(props)

    return {
      // regionFilter,
      // municipalityFilter,
    }

  },
}
</script>

<style lang="scss">
.categories-tree.card {
  .card-header {
    background-color: rgba(34, 41, 47, 0.04);
  }
}

.list-group-item.active {
  color: #956639;
}

.list-group-item.active {
  background-color: #ffe4ca;
  border: 1px solid rgba(34, 41, 47, 0.125);
}

.list-group .list-group-item.active:hover {
  background-color: #ffe4ca;
  border-color: #956639;
}
</style>
