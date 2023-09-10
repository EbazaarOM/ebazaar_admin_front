<template>
  <div>
    <users-list :registration-fields="fields"
                :edit-fields="fields"
                role-query="Farmer"
                :add-request-path="requestUrls.farmer.add"
                :edit-request-path="requestUrls.farmer.edit"/>
  </div>
</template>

<script>
/* eslint-disable */

import UsersList from "./users-list/UsersList";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import {onUnmounted, ref} from "@vue/composition-api";
import useUsersList from "@/views/apps/user/users-list/useUsersList";
import {avatarText} from "@core/utils/filter";

export default {
  name: "FarmersList",
  components: {UsersList},
  data() {
    return {
      fields: {
        "role": 'farmer',
        "addTitle": this.$i18n.t('roles.addFarmer'),
        "editTitle": this.$i18n.t('roles.editFarmer'),
        "isFarmer": true,
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": {visible: true, required: true},
        "sticker": true,
        "email": {visible: true, required: false},
        "phoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "bankAccountNumber": {visible: true, required: true},
        "userType": true,
        "consul": true,
        "enableCash": true,
        "address": ["regionId", "region", "address", "city"],
        "personalInfo": ["coverImage", "profileImage", "videoLink", "text"],
        "juridicalInfo": {
          "commercialName": '',
          "juridicalName": '',
          "identificationNumber": '',
          "juridicalType": '',
        },
        "published": [
          {value: 'NotSet', payloadValue: 'NotSet', text: this.$i18n.t('global.choose')},
          {value: 'published', payloadValue: 'true', text: this.$i18n.t('global.published')},
          {value: 'unpublished', payloadValue: 'false', text: this.$i18n.t('global.unpublished')},
        ],
        "preferredLanguage": [
          {value: 'NotSet', text: this.$i18n.t('global.choose') },
          {value: 'KA', text: this.$i18n.t('global.geo')},
          {value: 'EN', text: this.$i18n.t('global.eng')},
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
