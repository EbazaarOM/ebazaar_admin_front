<template>
  <div>
    <users-list :registration-fields="fields"
                :edit-fields="fields"
                role-query="LogisticsManager"
                :add-request-path="requestUrls.logisticsManager.add"
                :edit-request-path="requestUrls.logisticsManager.edit"/>
  </div>
</template>

<script>
/* eslint-disable */
import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "LogisticsManagersList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'logistics_manager',
        "addTitle": this.$i18n.t('roles.addLogisticsManager'),
        "editTitle": this.$i18n.t('roles.editLogisticsManager'),
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": true,
        "password": true,
        "confirmPassword": true,
        "licenseNumber": {visible: true, required: true},
        "vehicle": {
          "manufacturer": '',
          "model": '',
          "licencePlate": ''
        }
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
