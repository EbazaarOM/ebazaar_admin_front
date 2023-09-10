<template>
  <users-list :add-request-path="requestUrls.admin.add"
              :edit-request-path="requestUrls.admin.edit"
              role-query="Admin"
              :edit-fields="fields"
              :registration-fields="fields"
/>
</template>

<script>
/* eslint-disable */
import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "AdminsList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'admin',
        "addTitle": this.$i18n.t('roles.addAdmin'),
        "editTitle": this.$i18n.t('roles.editAdmin'),
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "password": true,
        "confirmPassword": true,
        "workingEmail": true,
        "phoneNumber": {visible: true, required: true},
        "email": {visible: true, required: true},
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
