<template>
  <div>
    <users-list :registration-fields="fields"
                :edit-fields="fields"
                role-query="CallCenterManager"
                :add-request-path="requestUrls.callCenterManager.add"
                :edit-request-path="requestUrls.callCenterManager.edit"/>
  </div>
</template>

<script>
/* eslint-disable */
import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "CallCenterManagersList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'call_center_manager',
        "addTitle": this.$i18n.t('roles.addCallCenterManager'),
        "editTitle": this.$i18n.t('roles.editCallCenterManager'),
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": {visible: true, required: true},
        "workspacePhoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "status": [
          {value: 'NotSet', payloadValue: 'NotSet', text: this.$i18n.t('global.choose')},
          {value: 'Active', payloadValue: 'Active', text: this.$i18n.t('global.active')},
          {value: 'Inactive', payloadValue: 'Inactive', text: this.$i18n.t('global.inactive')},
          {value: 'Vacation', payloadValue: 'Vacation', text: this.$i18n.t('global.vacation')},
        ]
      }
    }
  },

  setup(props) {
    const {
      editFieldsDict,
      requestUrls
    } = useUsersList(props)

    return {
      editFieldsDict,
      requestUrls
    }
  },
}
</script>

<style scoped>

</style>
