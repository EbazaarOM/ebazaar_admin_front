<template>
  <div>
    <horizontal-navbar/>
    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col
            cols="12"
            class="mt-50 mb-3 d-flex justify-content-between"
        >
          <h2>{{ $t('contact.title') }}</h2>

          <b-button :disabled="!actionActive.contact"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateContactUsContent"
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
                v-model="contactUsContent.title_ka"
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
                v-model="contactUsContent.title_en"
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
                <text-editor v-if="contactUsContent.description_ka !== null"
                             id="contact_description_ka"
                             :editor="contactUsContent.description_ka"
                             @update="updateDescriptionValue_ka"/>
              </b-tab>
              <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
                <!-- Form: Description -->
                <text-editor v-if="contactUsContent.description_en !== null"
                             id="contact_description_en"
                             :editor="contactUsContent.description_en"
                             @update="updateDescriptionValue_en"/>
              </b-tab>
            </b-tabs>

          </b-card>
        </b-col>
        <b-col md="6 mb-4">
          <b-form-group
              :label="$t('contact.address_ka')"
              label-for="address_ka"
              class="mb-2"
          >
            <b-form-input
                id="address_ka"
                v-model="contactUsContent.address_ka"
            />
          </b-form-group>
        </b-col>
        <b-col md="6 mb-4">
          <b-form-group
              :label="$t('contact.address_en')"
              label-for="address_en"
              class="mb-2"
          >
            <b-form-input
                id="address_en"
                v-model="contactUsContent.address_en"
            />
          </b-form-group>
        </b-col>

        <b-col
            cols="12"
            class="mb-3 p-0 d-flex justify-content-between flex-wrap "
        >
          <h4 class="w-100 p-1">{{ $t('contact.workingHours') }}</h4>
          <b-col md="6">
            <b-form-group
                :label="$t('global.geo')"
                label-for="working-hours_ka"
                class="mb-2"
            >
              <b-form-input
                  id="working-hours_ka"
                  v-model="contactUsContent.workingHours_ka"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                :label="$t('global.eng')"
                label-for="working-hours_en"
                class="mb-2"
            >
              <b-form-input
                  id="working-hours_en"
                  v-model="contactUsContent.workingHours_en"
              />
            </b-form-group>
          </b-col>
        </b-col>
        <b-col md="6 mb-4">
          <h4 class="mb-1">{{ $t('contact.phoneNumbers') }}</h4>
          <b-list-group v-if="phones.length">
            <b-list-group-item class="empty-category">
              <contact-us-item :is-empty="true"
                               type="number"
                               @add="addPhoneNumber"
                               title=""/>
            </b-list-group-item>
            <b-list-group-item v-for="(phone, index) in phones" :key="phone">
              <contact-us-item
                  :contact-us-item="{title: phone, i: index}"
                  title=""
                  type="number"
                  @update="updatePhoneNumber"
                  @delete="deletePhoneNumber"
              />
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col md="6 mb-4">
          <h4 class="mb-1">{{ $t('contact.emails') }}</h4>
          <b-list-group v-if="emails.length">
            <b-list-group-item class="empty-category">
              <contact-us-item :is-empty="true"
                               type="email"
                               @add="addEmail"
                               title="ელ. ფოსტის"/>
            </b-list-group-item>
            <b-list-group-item v-for="(email, index) in emails" :key="email">
              <contact-us-item
                  :contact-us-item="{title: email, i: index}"
                  title="ელ.ფოსტის"
                  type="email"
                  @update="updateEmail"
                  @delete="deleteEmail"
              />
            </b-list-group-item>
          </b-list-group>
        </b-col>

        <!-- Social Links -->
        <b-col
            cols="12"
            class="mt-50 mt-1 mb-3 d-flex justify-content-between"
        >
          <h2>{{ $t('contact.socialMedia') }}</h2>

          <b-button :disabled="!actionActive.socialLinks"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateSocialLinks"
          >
            {{ $t('contact.saveLinks') }}
          </b-button>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('contact.fbLink')"
              label-for="fb-link"
              class="mb-2"
          >
            <b-form-input
                id="fb-link"
                v-model="fb_link"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('contact.instagramLink')"
              label-for="instagram_link"
              class="mb-2"
          >
            <b-form-input
                id="instagram_link"
                v-model="instagram_link"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('contact.linkedinLink')"
              label-for="linked-in-link"
              class="mb-2"
          >
            <b-form-input
                id="linked-in-link"
                v-model="linked_in_link"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
              :label="$t('contact.youtubeLink')"
              label-for="youtube_link"
              class="mb-2"
          >
            <b-form-input
                id="youtube_link"
                v-model="youtube_link"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <!--/ form -->
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
  BLink,
  BButton,
  BTabs,
  BTab,
  BListGroupItem,
  BListGroup,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {onUnmounted, ref} from '@vue/composition-api'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import ContactUsItem from "@/views/pages/content-pages/components/ContactUsItem";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  components: {
    TextEditor,
    ContactUsItem,
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
    BListGroupItem,
    BListGroup,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      phones: [],
      emails: [],
      contactUsContent: {
        title_en: '',
        title_ka: '',
        description_ka: null,
        description_en: null,
        workingHours_ka: '',
        workingHours_en: '',
        address_ka: '',
        address_en: ''
      },
      actionActive: {
        contact: true,
        socialLinks: true,
      },
      workingHours: '',
      youtube_link: '',
      linked_in_link: '',
      fb_link: '',
      instagram_link: '',
    }
  },
  mounted() {
    // this.$vs.loading()
    console.log("this", this.$refs)
    let contactUsPromise = this.fetchContactUsContent()
    let socialLinksPromise = this.fetchSocialLinks();
    Promise.all([contactUsPromise, socialLinksPromise]).then(() => {
      // this.$vs.loading.close()
    })

  },
  methods: {

    updateDescriptionValue_ka(description) {
      this.contactUsContent.description_ka = description
    },
    updateDescriptionValue_en(description) {
      this.contactUsContent.description_en = description
    },

    addPhoneNumber(item) {
      this.phones.push(item)
    },
    addEmail(item) {
      this.emails.push(item)
    },
    updateEmail(item) {
      this.emails[item.i] = item.title
    },
    updatePhoneNumber(item) {
      this.phones[item.i] = item.title
    },
    deleteEmail(item) {
      this.emails.splice(item.i, 1)
    },
    deletePhoneNumber(item) {
      this.phones.splice(item.i, 1)
    },
    updateData(response) {
      let content_ka = response.data.translations?.find(el => el.languageCode === 'ka')
      let content_en = response.data.translations?.find(el => el.languageCode === 'en')
      this.contactUsContent.title_ka = content_ka ? content_ka.title : ''
      this.contactUsContent.description_ka = content_ka ? content_ka.description : ''
      this.contactUsContent.title_en = content_en ? content_en.title : ''
      this.contactUsContent.description_en = content_en ? content_en.description : ''
      this.contactUsContent.address_ka = content_ka ? content_ka.address : ''
      this.contactUsContent.address_en = content_en ? content_en.address : ''
      this.contactUsContent.workingHours_ka = content_ka ? content_ka.workingHours : ''
      this.contactUsContent.workingHours_en = content_en ? content_en.workingHours : ''

      this.phones = response.data.phones
      this.emails = response.data.emails

      this.actionActive.contact = true
    },
    updateSocialData(response) {
      this.fb_link = response.data.facebook
      this.instagram_link = response.data.instagram
      this.linked_in_link = response.data.linkedin
      this.youtube_link = response.data.youtube
      this.actionActive.socialLinks = true
    },
    fetchContactUsContent() {
      this.actionActive.contact = false
      return store.dispatch('app-content/fetchContactUsContent')
          .then((response) => {
            this.updateData(response)
          })
    },
    updateContactUsContent() {
      this.actionActive.contact = false
      let payload = {
        phones: this.phones,
        emails: this.emails,
        translations: [
          {
            languageCode: 'ka',
            title: this.contactUsContent.title_ka,
            description: this.contactUsContent.description_ka ? this.contactUsContent.description_ka : '',
            workingHours: this.contactUsContent.workingHours_ka,
            address: this.contactUsContent.address_ka
          },
          {
            languageCode: 'en',
            title: this.contactUsContent.title_en,
            description: this.contactUsContent.description_en ? this.contactUsContent.description_en : '',
            workingHours: this.contactUsContent.workingHours_en,
            address: this.contactUsContent.address_en
          },
        ]
      }
      store.dispatch('app-content/updateContactUsContent', payload)
          .then((response) => {
            this.toast('წარმატებით განახლდა')
            this.updateData(response);
          })
    },
    fetchSocialLinks() {
      this.actionActive.socialLinks = false
      return store.dispatch('app-content/fetchSocialLinks')
          .then((response) => {
            this.updateSocialData(response)
          })
    },
    updateSocialLinks() {
      this.actionActive.socialLinks = false
      let payload = {
        facebook: this.fb_link,
        instagram: this.instagram_link,
        linkedin: this.linked_in_link,
        youtube: this.youtube_link,
      }
      store.dispatch('app-content/updateSocialLinks', payload)
          .then((response) => {
            this.toast('მონაცემები წარმატებით განახლდა')
            this.updateSocialData(response)
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
