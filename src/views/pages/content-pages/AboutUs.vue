<template>
  <div>
    <horizontal-navbar/>
    <h2>{{ $t('aboutUs.title') }}</h2>
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
              @click="updateAboutUsContent"
          >
            {{ $t('global.save') }}
          </b-button>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('global.pageTitle_ka')"
              label-for="faq-title_ka"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_ka"
                v-model="aboutUsItem.title_ka"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('global.pageTitle_en')"
              label-for="faq-title_en"
              class="mb-2"
          >
            <b-form-input
                id="faq-title_en"
                v-model="aboutUsItem.title_en"
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
                <text-editor v-if="aboutUsItem.description_ka !== null" :editor="aboutUsItem.description_ka" @update="updateDescriptionValue_ka"/>
              </b-tab>
              <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                <!-- Form: Description -->
                <text-editor v-if="aboutUsItem.description_en !== null" :editor="aboutUsItem.description_en" @update="updateDescriptionValue_en"/>
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
            @click="openAddTeamMemberModal"
        >
          {{ $t('aboutUs.addEmployee') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="teamMembers">
      <team-member v-for="member in teamMembers" :key="member.id" :team-member="member"
                   @edit="openEditTeamMemberModal"/>
    </b-row>

    <team-member-modal :is-add-team-member-modal-active.sync="modalVisible" :is-editing="isEditing"
                       :member="modalTeamMember" @add="addTeamMember" @update="updateTeamMember" @delete="deleteTeamMember"/>
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
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
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
      aboutUsItem: {
        title_en: '',
        title_ka: '',
        description_ka: null,
        description_en: null
      },
      actionActive: false,
      teamMembers: [],
      modalTeamMember: {},
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
    this.fetchAboutUsContent()
    this.fetchTeamMembers()
  },
  methods: {

    updateDescriptionValue_ka(description) {
      this.aboutUsItem.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.aboutUsItem.description_en = description
    },

    fetchAboutUsContent() {
      this.actionActive = false
      store.dispatch('app-content/fetchAboutUsContent')
          .then((response) => {
            let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
            let content_en = response.data.translations?.find(el => el.languageCode === 'en')
            this.aboutUsItem.title_ka = content_ka ? content_ka.title : ''
            this.aboutUsItem.description_ka = content_ka ? content_ka.description : ''
            this.aboutUsItem.title_en = content_en ? content_en.title : ''
            this.aboutUsItem.description_en = content_en ? content_en.description : ''
            this.actionActive = true
          })
    },
    updateAboutUsContent() {
      this.actionActive = false
      let payload = {
        translations: [
          {
            languageCode: 'ka',
            title: this.aboutUsItem.title_ka,
            description: this.aboutUsItem.description_ka ? this.aboutUsItem.description_ka : ''
          },
          {
            languageCode: 'en',
            title: this.aboutUsItem.title_en,
            description: this.aboutUsItem.description_en ? this.aboutUsItem.description_en : ''
          },
        ]
      }
      store.dispatch('app-content/updateAboutUsContent', payload)
          .then((response) => {
            this.toast('წარმატებით განახლდა')
            this.fetchAboutUsContent()
          })
    },
    fetchTeamMembers() {
      return store.dispatch('app-content/fetchTeamMembers')
          .then((response) => {
            this.teamMembers = response.data.data
          })
    },
    fetchTeamMember(payload) {
      return store.dispatch('app-content/fetchTeamMembers', payload)
          .then((response) => {
            this.modalTeamMember = response.data
          })
    },
    openEditTeamMemberModal(member) {
      this.fetchTeamMember({id: member.id}).then(() => {
        this.modalVisible = true;
        this.isEditing = true
      })
    },
    openAddTeamMemberModal() {
      this.modalVisible = true;
      this.modalTeamMember = null;
      this.isEditing = false
    },
    addTeamMember(payload) {
      console.log("addTeamMember fetch team members", payload)
      return store.dispatch('app-content/addTeamMember', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('თანამშრომელი წარმატებით დაემატა')
            this.fetchTeamMembers();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    updateTeamMember(payload) {
      return store.dispatch('app-content/updateTeamMember', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('თანამშრომელი წარმატებით შეიცვალა')
            this.fetchTeamMembers();
          }).catch(() => {
            this.toast('დაფიქსირდა შეცდომა', 'danger')
          })
    },
    deleteTeamMember(payload) {
      console.log("updateTeamMember fetch team members", payload)
      return store.dispatch('app-content/deleteTeamMember', payload)
          .then((response) => {
            this.modalVisible = false;
            this.toast('თანამშრომელი წარმატებით წაიშალა')
            this.fetchTeamMembers();
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
