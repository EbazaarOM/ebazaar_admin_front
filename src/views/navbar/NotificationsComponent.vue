<template>
  <b-nav-item-dropdown
      class="dropdown-notification mr-25"
      menu-class="dropdown-menu-media"
      right
  >
    <template #button-content>
      <feather-icon
          :badge="unseen"
          badge-classes="bg-danger"
          class="text-body"
          icon="BellIcon"
          size="21"
      />
    </template>

    <!-- Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex pt-1 pb-1">
        <h4 class="notification-title mb-0 mr-4">
          {{ $t('notification.title') }}
        </h4>
        <b-badge
            pill
            variant="light-primary"
        >
          {{ unseen }} {{ $t('global.new') }}
        </b-badge>
      </div>
    </li>
    <!-- Notifications -->
    <li
        id="infinite-list"
        class="scrollable-container media-list scroll-area"
    >
      <!-- Account Notification -->
      <div
          v-for="notification in childNotifications"
          :key="notification.id"
          :class="notification.seen ? 'seen-not' : 'bg-not-seen'"
          class="d-block"
      >
          <p class="pl-1 pb-1 pt-1 mb-0">
            <b-link @click="notificationClicked(notification)">
              <small class="notification-text">{{ notification.body }}</small>
            </b-link>
          </p>
      </div>
    </li>

    <!-- Cart Footer -->
    <li v-if="false" class="dropdown-menu-footer p-1">
      <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          block
          :disabled="meta.total < meta.currentSkip + 5"
          @click.prevent="loadMore"
      >
        load more
      </b-button>
    </li>
  </b-nav-item-dropdown>
</template>

<script>
/* eslint-disable */
import {
  BNavItemDropdown, BBadge, BLink, BButton
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BNavItemDropdown,
    BBadge,
    BLink,
    VuePerfectScrollbar,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: ['notifications', 'unseen', 'meta', 'loading'],
  data() {
    return {
      childNotifications: [],
      busy: false
    }
  },
  watch: {
    notifications: function (newVal) {
      this.$nextTick(() => {
        this.childNotifications = newVal
      })
    }
  },
  mounted() {
    this.childNotifications = this.notifications
    const listElm = document.querySelector('#infinite-list');
    listElm?.addEventListener('scroll', e => {
      if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight - 1) {
        console.log('reached bottom');
        this.loadMore();
      }
    });
  },
  methods: {
    notificationClicked(notification) {
      this.$emit('seen', notification)
    },
    loadMore() {
      this.$emit('load')
    },
  },
  setup() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    return {
      perfectScrollbarSettings,
    }
  },
}
</script>

<style lang="scss">
.scrollable-container.media-list.scroll-area {
  max-height: 400px;
  overflow-y: scroll !important;
}
</style>

<style scoped>
.seen-not p a{
  color: black;
  
}

.seen-not{
  background: #d6d6d6;
}

.bg-not-seen {
  /* background: #d6d6d6; */
}
</style>