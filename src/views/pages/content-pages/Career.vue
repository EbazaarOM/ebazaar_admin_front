<template>
  <div>
    <horizontal-navbar/>
    <h2>{{ $t('career.title') }}</h2>
    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col
            cols="12"
            class="mt-50 d-flex justify-content-end"
        >
          <b-button :disabled="!actionActive"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateCareerContent"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="4">
          <b-form-group
              :label="$t('global.pageTitle_ka')"
              label-for="faq-title_ka"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_ka"
                v-model="careerItem.title_ka"
            />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group
              :label="$t('global.pageTitle_en')"
              label-for="faq-title_en"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_en"
                v-model="careerItem.title_en"
            />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group
              :label="$t('global.email')"
              label-for="email"
              class="mb-2"
          >
            <b-form-input
                id="email"
                v-model="careerItem.email"
            />
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-card>
            <!-- Header: Description -->
            <div class="d-flex mb-2">
              <feather-icon
                  icon="UserIcon"
                  size="19"
              />
              <h4 class="mb-0 ml-50">
                {{ $t('global.description') }}
              </h4>
            </div>

            <b-tabs>
              <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
                <!-- Form: Description -->
                <text-editor v-if="careerItem.description_ka !== null"
                             id="career_description_ka"
                             :editor="careerItem.description_ka"
                             @update="updateDescriptionValue_ka"/>
              </b-tab>
              <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                <!-- Form: Description -->
                <text-editor v-if="careerItem.description_en !== null"
                             id="career_description_en"
                             :editor="careerItem.description_en"
                             @update="updateDescriptionValue_en"/>
              </b-tab>
            </b-tabs>

          </b-card>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->

    <b-row class="mt-3">
      <b-col
          cols="12"
          class="mt-50 mb-2 d-flex justify-content-end"
      >
        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="openAddVacancyModal"
        >
          {{ $t('career.addNew') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <app-collapse id="vacancies"
                      accordion
                      type="margin"
                      class="mt-2">
          <vacancy v-for="vacancy in vacancies" :key="vacancy.id" :vacancy="vacancy"
                   @edit="openEditVacancyModal"/>
        </app-collapse>
      </b-col>
    </b-row>

    <vacancy-modal :is-vacancy-modal-active.sync="modalVisible" :is-editing="isEditing" :vacancy="modalVacancyObject"
                   @add="addVacancies" @update="updateVacancy" @delete="deleteVacancy"/>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BMedia,
  BAvatar,
  BCardText,
  BMediaAside,
  BMediaBody,
  BForm,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BImg,
  BFormFile,
  BLink,
  BButton,
  BTabs,
  BTab,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {useInputImageRenderer} from '@core/comp-functions/forms/form-utils'
import {onUnmounted, ref} from '@vue/composition-api'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import TeamMember from "@/views/pages/content-pages/components/TeamMember";
import TeamMemberModal from "@/views/pages/content-pages/components/TeamMemberModal";
import VacancyModal from "@/views/pages/content-pages/components/VacancyModal";
import Vacancy from "@/views/pages/content-pages/components/Vacancy";
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    AppCollapse,
    Vacancy,
    VacancyModal,
    TeamMemberModal,
    TeamMember,
    HorizontalNavbar,
    BCard,
    BMedia,
    BAvatar,
    BCardText,
    BMediaAside,
    BMediaBody,
    BForm,
    BLink,
    BImg,
    BRow,
    BCol,
    BButton,
    BTabs,
    BTab,
    BFormGroup,
    BFormInput,
    BFormFile,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      careerItem: {
        title_en: '',
        title_ka: '',
        description_ka: null,
        description_en: null,
        email: '',
      },
      actionActive: true,
      vacancies: [],
      modalVacancyObject: {},
      modalVisible: false,
      isEditing: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],         //bold, italic, underline, strikethrough
            [{'list': 'ordered'}, {'list': 'bullet'}],      //ordered list, unordered list
            [{'header': [4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            ['clean'],
            ['link', 'image', 'video'],
          ]
        }
      }
    }
  },
  created() {
    // this.$http.get('/blog/list/data/edit').then(res => { this.blogEdit = res.data })
  },
  mounted() {
    this.fetchCareerContent()
    this.fetchVacancies()
  },
  methods: {

    updateDescriptionValue_ka(description) {
      this.careerItem.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.careerItem.description_en = description
    },

    fetchCareerContent() {
      this.actionActive = false
      store.dispatch('app-content/fetchCareerContent')
          .then((response) => {
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.careerItem.title_ka = content_ka ? content_ka.title : ''
            this.careerItem.description_ka = content_ka ? content_ka.description : ''
            this.careerItem.title_en = content_en ? content_en.title : ''
            this.careerItem.description_en = content_en ? content_en.description : ''
            this.careerItem.email = response.data.email
            this.actionActive = true
          })
    },
    updateCareerContent() {
      this.actionActive = false
      let payload = {
        email: this.careerItem.email,
        translations: [
          {
            languageCode: 'ka',
            title: this.careerItem.title_ka,
            description: this.careerItem.description_ka ? this.careerItem.description_ka : ''
          },
          {
            languageCode: 'en',
            title: this.careerItem.title_en,
            description: this.careerItem.description_en ? this.careerItem.description_en : ''
          },
        ]
      }
      store.dispatch('app-content/updateCareerContent', payload)
          .then((response) => {
            this.toast('წარმატებით განახლდა')
            this.fetchCareerContent();
          })
    },
    fetchVacancies() {
      return store.dispatch('app-content/fetchVacancies')
          .then((response) => {
            this.vacancies = response.data.data
          })
    },
    fetchVacancy(payload) {
      return store.dispatch('app-content/fetchVacancies', payload)
          .then((response) => {
            this.modalVacancyObject = response.data
          })
    },
    openEditVacancyModal(vacancy) {
      this.fetchVacancy({id: vacancy.id}).then(() => {
        this.modalVisible = true;
        this.isEditing = true
      })
    },
    openAddVacancyModal() {
      this.modalVisible = true;
      this.modalVacancyObject = null;
      this.isEditing = false
    },
    addVacancies(payload) {
      return store.dispatch('app-content/addVacancy', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('ვაკანსია წარმატებით დაემატა')
            this.fetchVacancies();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateVacancy(payload) {
      return store.dispatch('app-content/updateVacancy', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('ვაკანსია წარმატებით შეიცვალა')
            this.fetchVacancies();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteVacancy(payload) {
      return store.dispatch('app-content/deleteVacancy', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('ვაკანსია წარმატებით წაიშალა')
            this.fetchVacancies();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/pages/page-blog.scss';
</style>
