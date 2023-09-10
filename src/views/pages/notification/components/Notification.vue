<template>
  <b-card>
    <b-row class="notification-center">
      <b-col md="12">
        <!--        <p class="mt-1">{{ notification.text }}</p>-->
        <div
            class="d-flex align-items-start"
        >
          <div class="profile-user-info w-100">
            <div class="d-flex align-items-start justify-content-between">
              <p class="mb-0">
                {{ notification.header }}
                <small v-if="notification.sendDate" class="text-muted">
                  {{ $t('notification.sent') }} - {{ new Date(notification.sendDate).toLocaleString() }}
                </small>
                <small v-else class="text-muted">{{ $t('notification.notSent') }}</small>
              </p>
              <div>
                <b-button
                    @click="openModal"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="ml-1"
                    :disabled="!!notification.sendDate"
                >
                  <feather-icon
                      icon="UserIcon"
                      class="mr-50"
                  />
                  <span class="align-middle">{{ $t('notification.send') }}</span>
                </b-button>
                <b-button v-if="false"
                          @click="$emit('redirect', notification.id)"
                          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                          variant="warning"
                          class="ml-1"
                >
                  <feather-icon
                      icon="EditIcon"
                      class="mr-50"
                  />
                  <span class="align-middle">{{ $t('global.edit') }}</span>
                </b-button>
                <b-button
                          @click="confirmAction('Are you sure you want to delete notification?', 'danger', 'delete')"
                          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                          variant="danger"
                          class="ml-1"
                >
                  <feather-icon
                      icon="TrashIcon"
                      class="mr-50"
                  />
                  <span class="align-middle">{{ $t('global.delete') }}</span>
                </b-button>
              </div>
            </div>
            <p class="mt-1">{{ notification.body }}</p>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-modal id="modal-user-list"
             ref="user-list-modal"
             size="xl"
             class="p-3"
             hide-header
             hide-footer
             centered>

      <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
        <h4>{{ $t('notification.userList') }}</h4>

        <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>

      <user-list-table :notification="notification" :fetch-notifications="fetchNotifications" :hideModal="hideModal" ref-for-table="refUserListTable" role-query="Client" />
    </b-modal>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BRow,
  BCol,
  BAvatar,
  BLink,
  BButton,
  BFormTextarea,
  BDropdown,
  BDropdownItem,
  BModal,
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";
import UserListTable from "@/views/apps/user/users-list/UserListTable";

export default {
  name: "Notification",
  props: ['notification', 'fetchNotifications'],
  directives: {
    Ripple,
  },
  components: {
    UserListTable,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BLink,
    BButton,
    BFormTextarea,
    BDropdown,
    BDropdownItem,
    BModal,
  },
  methods: {
    confirmText() {
      this.$swal({
        title: 'დარწმუნებული ხართ რომ გინდათ წაშლა?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ',
        cancelButtonText: 'არა',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.$emit('delete', this.notification.id)
        }
      })
    },
    confirmAction(text, variant, methodName, data = null) {
      this.boxTwo = ''
      this.$bvModal
          .msgBoxConfirm(text, {
            title: 'Please confirm',
            size: 'sm',
            okVariant: variant,
            okTitle: 'Yes',
            cancelTitle: 'No',
            cancelVariant: 'outline-secondary',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => {
            if (value) {
              this.$emit(methodName, this.notification.id)
            }
          })
    },
    hideModal() {
      this.$refs['user-list-modal'].hide()
    },
    openModal() {
      this.$refs['user-list-modal'].show()
    },
  },


}
</script>

<style scoped>

</style>
