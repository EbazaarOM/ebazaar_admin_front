<template>
  <div
      class="vertical-layout h-100"
      :class="[layoutClasses]">
    <!-- Vertical Nav Menu Overlay -->
    <div
        class="sidenav-overlay"
        :class="overlayClasses"
        @click="isVerticalMenuActive = false"
    />
    <!-- Vertical Nav Menu -->
    <vertical-nav-menu
        v-if="!isNavMenuHidden"
        :is-vertical-menu-active="isVerticalMenuActive"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
        class="d-block d-xl-none"
    >
      <template #header="slotProps">
        <slot
            name="vertical-menu-header"
            v-bind="slotProps"
        />
      </template>
    </vertical-nav-menu>
    <b-card class="header-container">
      <div class="left-navbar-container">
        <!-- Nav Menu Toggler -->
        <ul class="nav navbar-nav">
          <li class="nav-item d-xl-none">
            <b-link
                class="nav-link"
                @click="toggleVerticalMenuActive"
            >
              <feather-icon
                  icon="MenuIcon"
                  size="21"
              />
            </b-link>
          </li>
          <li class="nav-item">
            <div v-if="arrowVisible" class="nav-item">
              <b-link
                  class="nav-link"
                  @click="$emit('go-back')"
              >
                <feather-icon
                    icon="ArrowLeftIcon"
                    size="21"
                />
              </b-link>
            </div>
          </li>
        </ul>
      </div>
      <div class="right-navbar-container d-flex justify-content-between align-items-center">
        <!--<locale/>-->

        <b-modal id="modal-change-password"
                 ref="change-password-modal"
                 size="md"
                 class="p-3 pb-1"
                 hide-header
                 hide-footer
                 centered>

          <div class="modal-custom-header d-flex flex-wrap align-items-center justify-content-between">
            <h4>{{ $t('header.changePassword') }}</h4>

            <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hidePasswordModal">
              <feather-icon icon="XIcon"/>
            </b-button>

            <p v-if="errorVisible" class="text-danger">{{ $t('header.incorrectCurrentPassword') }}</p>
          </div>

          <password-input-field @change="changePassword" :current="true"></password-input-field>
        </b-modal>

        <b-modal id="modal-change-username"
                 ref="change-username-modal"
                 size="md"
                 class="p-3 pb-1"
                 hide-header
                 hide-footer
                 centered>

          <div class="modal-custom-header mb-1 d-flex flex-wrap align-items-center justify-content-between">
            <h4>{{ $t('header.changeUsername') }}</h4>

            <b-button variant="flat-secondary" class="btn-icon" size="lg" @click="hideUsernameModal">
              <feather-icon icon="XIcon"/>
            </b-button>
          </div>
          <validation-provider class="mr-2"
                               name="მომხმარებელი"
                               rules="required"
          >
            <b-form-group label-for="confirm_password">
              <label for="new_username">{{ $t('header.newUsername') }}</label>

              <b-form-input id="new_username"
                            v-model="newUsername"
                            :state="validate_username"
                            type="text"
                            trim/>
            </b-form-group>
          </validation-provider>

          <div class="d-flex justify-content-between align-items-center">
            <b-button variant="primary" class="save-changes mb-3"
                      :disabled="!validate_username"
                      @click="changeUsername">
              <feather-icon icon="SaveIcon"
                            class="mr-50"/>
              <span class="align-middle">{{ $t('global.update') }}</span>
            </b-button>
          </div>
        </b-modal>

        <div class="dropdown-container d-flex justify-content-between align-items-center">

          <locale-component/>

          <notifications-component class="p-1" :unseen="unseenNotificationsCount"
                                   :meta="notificationsMeta" :notifications="notifications"
                                   :loading="loading"
                                   @seen="seenNotification" @load="loadMore"/>
          <template>

            <div v-if="userRole === 'farmer'" class="d-flex flex-column align-items-end mr-4">
              <p class="user-name font-weight-bolder mb-0 text-secondary">
                <span>{{
                    `${responsiblePerson.firstName} ${responsiblePerson.lastName} - ${responsiblePerson.phoneNumber}`
                  }}</span>
              </p>
              <p class="user-name font-weight-bolder mb-0 text-secondary">
                <small>{{ $t('header.responsiblePerson') }}</small>
              </p>
            </div>
            <div class="user-nav text-right mr-1">
              <p class="user-name font-weight-bolder text-secondary">
                {{ userInfo.given_name }}
              </p>
              <p class="user-status mb-0 text-secondary">
                {{userRole}} - {{ userCode }}
              </p>
            </div>
            <b-avatar button
                      @click="dropdownVisible = !dropdownVisible"
                      size="40"
                      variant="secondary"
                      badge
                      :text="initials"
                      class="badge-minimal"
                      badge-variant="success">
            </b-avatar>
          </template>

          <div v-if="dropdownVisible" id="dropdownItem" class="dropdown-items">
            <div class="dropdown-item" @click="$router.push({ name: 'user-profile'})">
              <feather-icon
                  size="16"
                  icon="UserIcon"
                  class="mr-50"/>
              <span>{{ $t('header.myProfile') }}</span>
            </div>
            <div v-if="userRole === 'farmer'" class="dropdown-item" @click="changeUsernameModal">
              <feather-icon
                  size="16"
                  icon="EditIcon"
                  class="mr-50"/>
              <span>{{ $t('header.changeUsername') }}</span>
            </div>
            <div class="dropdown-item" @click="changePasswordModal">
              <feather-icon
                  size="16"
                  icon="KeyIcon"
                  class="mr-50"/>
              <span>{{ $t('header.changePassword') }}</span>
            </div>
            <div class="dropdown-item" @click="logout">
              <feather-icon
                  size="16"
                  icon="LogOutIcon"
                  class="mr-50"/>
              <span>{{ $t('header.logout') }}</span>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>

</template>

<script>
/* eslint-disable */
import {
  BInputGroup, BInputGroupPrepend, BAvatar, BCard, BForm, BFormInput, BFormGroup, BButton, BFormInvalidFeedback, BLink
} from 'bootstrap-vue'
import store from "@/store";
import authModule from "@/store/auth";
import {onUnmounted} from "@vue/composition-api";
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import useVerticalLayout from "@core/layouts/layout-vertical/useVerticalLayout";
import useAppConfig from "@core/app-config/useAppConfig";
import VerticalNavMenu from "@core/layouts/layout-vertical/components/vertical-nav-menu/VerticalNavMenu";
import PasswordInputField from "@/views/forms/form-element/form-password/PasswordInputField";
import userStoreModule from "@/views/apps/user/userStoreModule";
import NotificationsComponent from "@/views/navbar/NotificationsComponent";
import router from "@/router";
import Locale from "@core/layouts/components/app-navbar/components/Locale";
import LocaleComponent from "@/views/navbar/LocaleComponent";

export default {
  components: {
    LocaleComponent,
    Locale,
    NotificationsComponent,
    PasswordInputField,
    VerticalNavMenu,
    BForm,
    BInputGroup,
    BInputGroupPrepend,
    BAvatar,
    BCard,
    BFormInput,
    BFormGroup,
    BButton,
    BLink,
    BFormInvalidFeedback,
    ValidationObserver,
    ValidationProvider
  },
  name: "HorizontalNavbar",

  data() {
    return {
      userData: {
        firstName: '',
        lastName: '',
        username: '',
        role: '',
        avatar: '',
      },
      currentUsername: '',
      newUsername: '',
      responsiblePerson: {},
      errorVisible: false,
      passwordFieldType: 'password',
      dropdownVisible: false,
      searchInput: '',
      old_password: '',
      password: '',
      confirm_password: '',
      isMenuActive: false,
      notifications: [],
      notificationsMeta: {},
      unseenNotificationsCount: 0,
      loading: false,
    }
  },

  props: ['arrowVisible'],

  watch: {
    searchInput: function (newVal) {
      if (newVal.length >= 3) this.$emit('search', newVal);
      else if (newVal.length === 0) this.$emit('search', undefined);
    }
  },

  computed: {

    userInfo() {
      return JSON.parse(localStorage.getItem('userInfo'));
    },

    userRole() {
      let userRoleKey = this.userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      return this.$i18n.t(`roles.${userRoleKey}`)
    },

    initials() {
      let fullName = this.userInfo.given_name ? this.userInfo.given_name.split(' ') : [[''], ['']];
      let firstNameInitial = fullName[0] ? fullName[0][0] : ''
      let lastNameInitial = fullName[1] ? fullName[1][0] : ''
      return firstNameInitial + lastNameInitial;
    },

    userCode() {
      return this.userInfo['nameid']
    },

    validate_username() {
      if (this.newUsername && this.newUsername.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.@]{6,100}$').test(this.newUsername)
    },
  },

  mounted() {
    if (this.userRole === 'farmer') this.fetchResponsiblePerson();
    this.refreshToken();
    this.fetchNotifications();
    this.timer = setInterval(this.fetchNotifications, 60000);
  },

  methods: {

    logout() {
      this.dropdownVisible = false;
      localStorage.clear();
      return this.$router.replace('/login');
    },

    changePassword(payload) {
      this.$store.dispatch('auth/changePassword', {
        "currentPassword": payload.current,
        "password": payload.password,
        "confirmPassword": payload.confirm_password
      }).then((response) => {
        if (response.data.success) {
          alert('პაროლი წარმატებით შეიცვალა');
          this.errorVisible = false
          this.hidePasswordModal()
        } else {
          alert('დაფიქსირდა შეცდომა');
          this.errorVisible = true
        }
      })
    },

    changeUsername() {
      this.$store.dispatch('app-user/changeUsername', {
        "userName": this.newUsername,
      }).then((response) => {
        alert('მომხმარებლის სახელი წარმატებით შეიცვალა');
        this.hideUsernameModal()
      }).catch(() => {
        alert('დაფიქსირდა შეცდომა');
      })
    },

    fetchResponsiblePerson() {
      this.$store.dispatch('app-user/fetchResponsiblePerson').then((response) => {
        this.responsiblePerson = response
      })
    },

    fetchNotifications(payload = {}, refreshed = true) {
      this.loading = false
      this.$store.dispatch('app-user/fetchNotificationsByUser', payload).then((response) => {
        if (refreshed) this.notifications = []

        this.$nextTick(() => {
          this.notifications = this.notifications.concat(response.data.data)
        })
        this.notificationsMeta = response.data.meta
        this.unseenNotificationsCount = response.data.meta.unSeen
        this.loading = true
      })
    },

    loadMore() {
      let skip = this.notificationsMeta.currentSkip
      let currentTake = this.notificationsMeta.currentTake;
      let total = this.notificationsMeta.total
      let payloadSkip;
      if(skip === 0 ){ 
        payloadSkip = 10;
      } else {
        payloadSkip = total >= skip + 5 ? skip + 5 : skip;
      }

      let payload = {
        skip: payloadSkip,
        take: 5,
      }

      console.log(this.notificationsMeta);
      if(skip + currentTake < total) {
        this.fetchNotifications(payload, false)
      }
    },

    seenNotification(notification) {
      if (!notification.seen)
        this.$store.dispatch('app-user/seenNotification', {id: notification.id}).then(() => {
          this.navigateFromNotification(notification.type)
        })
      else this.navigateFromNotification(notification.type)
    },

    navigateFromNotification(type) {
      if (type === 'NewOrder') router.push({name: 'orders'}).catch(() => {
        router.go(0)
      })
      if (type === 'NewReview' || type === 'ReviewReply') router.push({name: 'reviews'}).catch(() => {
        router.go(0)
      })
    },

    refreshToken() {
      this.$store.dispatch('auth/refreshToken')
          .catch(() => {
            this.logout()
          })
    },

    changePasswordModal() {
      this.$refs['change-password-modal'].show();
      this.dropdownVisible = false;
    },

    changeUsernameModal() {
      this.$refs['change-username-modal'].show();
      this.dropdownVisible = false;
    },

    hidePasswordModal() {
      this.$refs['change-password-modal'].hide();
    },

    hideUsernameModal() {
      this.$refs['change-username-modal'].hide();
    },

    closeSideNav() {
      document.getElementsByClassName('nav-toggle')[0].click();
      document.getElementsByClassName('vertical-layout vertical-overlay-menu')[0].classList.remove('menu-open')
      document.getElementsByClassName('vertical-layout vertical-overlay-menu')[0].classList.add('menu-hide')
      document.getElementsByClassName('sidenav-overlay')[0].classList.remove('show')
    },

    openSideNav() {
      document.getElementsByClassName('vertical-layout vertical-overlay-menu')[0].classList.add('menu-open')
      document.getElementsByClassName('vertical-layout vertical-overlay-menu')[0].classList.remove('menu-hide')
      document.getElementsByClassName('sidenav-overlay')[0].classList.add('show')
    }
  },

  setup() {

    const AUTH_MODULE_NAME = 'auth';

    // Register auth module
    if (!store.hasModule(AUTH_MODULE_NAME)) store.registerModule(AUTH_MODULE_NAME, authModule);

    const USER_APP_STORE_MODULE_NAME = 'app-user';

    // Register user module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    const {
      routerTransition, navbarBackgroundColor, navbarType, footerType, isNavMenuHidden,
    } = useAppConfig()

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      layoutClasses,
      overlayClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    // Resize handler
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,
    }

  },
}

</script>

<style lang="scss">

.header-container {
  z-index: 10;
}

.header-container .card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.user-nav p {
  line-height: 1.12;
}

.left-navbar-container {
  width: 40%;

  .input-group-text {
    border: none;
  }

  .form-control {
    border: none;
  }
}

.right-navbar-container {
  li {
    list-style: none;
  }

  .b-nav-dropdown .dropdown-toggle::after {
    display: none;
  }

  .dropdown-items {
    position: absolute;
    background-color: white;
    top: 50px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    right: 0;
    border-radius: 2px;
    cursor: pointer;
  }

  .dropdown-container {
    position: relative;
  }
}

.main-menu .navbar-header .navbar-brand .brand-logo img {
  width: 140px;
  max-width: unset;
}

.user-name {
  margin-bottom: 3px;
}

</style>
