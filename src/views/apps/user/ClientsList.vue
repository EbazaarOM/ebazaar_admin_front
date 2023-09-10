<template>
  <div>
    <users-list :request-path="requestUrls.user.add"
                role-query="Client"
                :edit-fields="fields"
                :registration-fields="fields"/>
  </div>
</template>

<script>
/* eslint-disable */
import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "ClientsList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'client',
        "title": '',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": true,
        "phoneNumber": true,
        "password": true,
        "confirmPassword": true,
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
