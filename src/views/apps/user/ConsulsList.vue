<template>
  <div>
    <users-list :registration-fields="fields"
                :edit-fields="fields"
                role-query="Consul"
                :add-request-path="requestUrls.consul.add"
                :edit-request-path="requestUrls.consul.edit"/>
  </div>
</template>

<script>
/* eslint-disable */

import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "ConsulsList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'consul',
        "addTitle": this.$i18n.t('roles.addConsul'),
        "editTitle": this.$i18n.t('roles.editConsul'),
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "password": true,
        "confirmPassword": true,
        // "bankAccountNumber": {visible: true, required: true},
        "email": true,
        "phoneNumber": true,
        "address": ["regionId", "region", "address", "city"]
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
