<template>
  <div>
    <users-list :registration-fields="fields"
                :edit-fields="fields"
                role-query="Courier"
                :add-request-path="requestUrls.courier.add"
                :edit-request-path="requestUrls.courier.edit"/>
  </div>
</template>

<script>
/* eslint-disable */
import UsersList from "./users-list/UsersList";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "CouriersList",
  components: {UsersList},
  data() {
    return {
      registrationFields: {
        "role": 'courier',
        "addTitle": this.$i18n.t('roles.addCourier'),
        "editTitle": this.$i18n.t('roles.editCourier'),
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
        },
        "status": [
          {value: 'NotSet', payloadValue: 'NotSet', text: this.$i18n.t('global.choose')},
          {value: 'Active', payloadValue: 'Active', text: this.$i18n.t('global.active')},
          {value: 'Inactive', payloadValue: 'Inactive', text: this.$i18n.t('global.inactive')},
        ]
      },
      fields: {
        "role": 'courier',
        "addTitle": this.$i18n.t('roles.addCourier'),
        "editTitle": this.$i18n.t('roles.editCourier'),
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "licenseNumber": {visible: true, required: true},
        "vehicle": {
          "manufacturer": '',
          "model": '',
          "licencePlate": ''
        },
        "status": [
          {value: 'NotSet', payloadValue: 'NotSet', text: this.$i18n.t('global.choose')},
          {value: 'Active', payloadValue: 'Active', text: this.$i18n.t('global.active')},
          {value: 'Inactive', payloadValue: 'Inactive', text: this.$i18n.t('global.inactive')},
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
