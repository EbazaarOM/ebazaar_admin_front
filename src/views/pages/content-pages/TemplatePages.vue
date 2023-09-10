<template>
  <div>
    <horizontal-navbar/>
    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col cols="6">
          <h2>{{ $t('templatePages.title') }}</h2>
        </b-col>
        <b-col
            cols="6"
            class="mt-50 d-flex justify-content-end"
        >
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="redirectToTemplatePage"
          >
            {{ $t('global.add')  }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->
    <b-table
        ref="refUserListTable"
        class="position-relative mt-3"
        :items="templatePages"
        responsive
        :fields="tableColumns"
        primary-key="id"
        show-empty
        empty-text="No matching records found"
    >
      <!-- Column: ID -->
      <template #cell(id)="data">
        <b-media vertical-align="center" class="d-flex align-items-center">
          <b-link
              :to="{ name: 'template-page', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.id }}
          </b-link>
        </b-media>
      </template>
      <!-- Column: Publish Date -->
      <template #cell(publishDate)="data">
        <b-media vertical-align="center" class="d-flex align-items-center">
          <span v-if="data.item.publishDate !== null"
              :to="{ name: 'template-page', params: { id: data.item.publishDate } }"
              class="font-weight-bold d-block text-nowrap"
          >
            {{ new Date(data.item.publishDate).toLocaleString() }}
          </span>
        </b-media>
      </template>
      <!-- Column: Title -->
      <template #cell(title)="data">
        <b-media vertical-align="center" class="d-flex align-items-center">
          <b-link
              :to="{ name: 'template-page', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.title }}
          </b-link>
        </b-media>
      </template>
    </b-table>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BForm,
  BBadge, BPagination, BFormSelect, BSpinner, BFormGroup, BFormInvalidFeedback, BFormDatepicker, BFormCheckboxGroup
} from 'bootstrap-vue'
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import UserListEditUser from "@/views/apps/user/users-list/UserListEditUser";
import UserListAddNew from "@/views/apps/user/users-list/UserListAddNew";
import vSelect from "vue-select";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import Ripple from "vue-ripple-directive";
import i18n from "@/main";
export default {
  name: "TemplatePages",
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
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      templatePages: [],
      tableColumns: [
        {key: 'id', label: this.$i18n.t('global.id')},
        {key: 'title', label: this.$i18n.t('global.title')},
        {key: 'publishDate', label: this.$i18n.t('templatePages.publishingDate')},
        {key: 'pageCategory', label: this.$i18n.t('templatePages.categoryOfPage')},
        {key: 'localPath', label: this.$i18n.t('templatePages.localLink')},
        {key: 'slug', label: this.$i18n.t('blog.slag')},
      ]
    }
  },
  mounted() {
    this.fetchTemplatePages()
  },
  methods: {
    fetchTemplatePages() {
      store.dispatch('app-content/fetchTemplatePages')
          .then((response) => {
            this.templatePages = response.data.data
          })
    },
    fetchTemplatePage(id) {
      return store.dispatch('app-content/fetchFaq', {id: id})
          .then((response) => {
            this.editFaqItem = response.data
          })
    },
    addFaq(payload) {
      return store.dispatch('app-content/addFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით დაემატა')
            this.fetchFaqs();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateFaq(payload) {
      return store.dispatch('app-content/updateFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით შეიცვალა')
            this.fetchFaqs();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteFaq(payload) {
      return store.dispatch('app-content/deleteFaq', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('კითხვა წარმატებით წაიშალა')
            this.fetchFaqs();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    redirectToTemplatePage() {
      this.$router.push({ name: 'template-page' })
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

  setup() {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    });
  },
}
</script>

<style scoped>

</style>
