<template>
  <div>
    <horizontal-navbar/>
    <div class="mt-2 mb-2">
      <b-row>
        <b-col cols="6">
          <h2>{{ $t('notification.title') }}</h2>
        </b-col>
        <b-col
            cols="6"
            class="mt-50 d-flex justify-content-end"
        >
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="redirectToNotification(null)"
          >
            {{ $t('global.add') }}
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div>
      <template v-for="notification in notifications">
        <notification :key="notification.id"
                      :notification="notification"
                      :fetchNotifications="fetchNotifications"
                      @delete="deleteNotification"
                      @redirect="redirectToNotification"
        />
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BButton,
  BRow,
  BCol
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import Notification from "@/views/pages/notification/components/Notification";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import {onUnmounted} from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import Ripple from "vue-ripple-directive";

export default {
  name: "NotificationList",
  components: {
    Notification,
    HorizontalNavbar,
    BButton,
    BRow,
    BCol
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      notifications: [],
      notificationsMeta: [],
      currentPage: 1,
      perPage: 5,
      total: 0,
    }
  },

  mounted() {
    this.fetchNotifications()
  },

  methods: {
    fetchNotifications() {
      // for (let i = 0; i < 5; i++) {
      //   this.notifications.push({
      //     id: i,
      //     text: 'იშოპინგე MY GPC-ს აპით:-40% ნუქსის აქუაბელას, ლიერაკის ჰიდრაჟენისტის, ბოდი შოპის შიის კარაქის,ვიშის დერკოსის გამაზე და -45% ბრეტონის თვალის პატჩებზე 12.12მდე:https://bit.ly/3EZWCgB\n' +
      //         'NO 91270',
      //     date: '2021-12-09T11:30:52.502Z',
      //     userList: [
      //       {
      //         "id": "9e552a22-85d0-4a18-a3f0-b3e82f7bcafb",
      //         "firstName": "asdf",
      //         "lastName": "asdf",
      //         "identity": "01005024248",
      //         "role": "user",
      //         "userName": "557504782",
      //         "uniqueCode": "5821",
      //         "userStatus": null,
      //         "userType": "Physical",
      //         "gender": "NotSet",
      //         "deleted": false,
      //         "published": null,
      //         "enableCash": null,
      //         "phoneNumber": null,
      //         "workspacePhoneNumber": null,
      //         "email": "",
      //         "address": null,
      //         "juridicalInfo": null,
      //         "vehicleInfo": null,
      //         "stickers": null,
      //         "groupedCertificates": null,
      //         "responsiblePerson": null,
      //         "responsiblePersonCode": null,
      //         "responsiblePersonId": null,
      //         "registrationDate": "2021-12-09T07:33:13.309283Z",
      //         "lockoutEnd": null
      //       },
      //       {
      //         "id": "b4071bf4-c770-435a-8276-cbb4231935cd",
      //         "firstName": "Tako",
      //         "lastName": "Idukashvili",
      //         "identity": null,
      //         "role": "user",
      //         "userName": "takoidukashvili@leavingstone.com",
      //         "uniqueCode": "0822",
      //         "userStatus": null,
      //         "userType": "Physical",
      //         "gender": "NotSet",
      //         "deleted": false,
      //         "published": null,
      //         "enableCash": null,
      //         "phoneNumber": null,
      //         "workspacePhoneNumber": null,
      //         "email": "takoidukashvili@leavingstone.com",
      //         "address": null,
      //         "juridicalInfo": null,
      //         "vehicleInfo": null,
      //         "stickers": null,
      //         "groupedCertificates": null,
      //         "responsiblePerson": null,
      //         "responsiblePersonCode": null,
      //         "responsiblePersonId": null,
      //         "registrationDate": "2021-12-03T13:56:30.60426Z",
      //         "lockoutEnd": null
      //       },
      //       {
      //         "id": "2b513a45-b78c-4ea2-807f-780b752493f6",
      //         "firstName": "Olga",
      //         "lastName": "Dumbadze",
      //         "identity": null,
      //         "role": "user",
      //         "userName": "dumbadze.olga@gmail.com",
      //         "uniqueCode": "2821",
      //         "userStatus": null,
      //         "userType": "Physical",
      //         "gender": "NotSet",
      //         "deleted": false,
      //         "published": null,
      //         "enableCash": null,
      //         "phoneNumber": null,
      //         "workspacePhoneNumber": null,
      //         "email": "dumbadze.olga@gmail.com",
      //         "address": null,
      //         "juridicalInfo": null,
      //         "vehicleInfo": null,
      //         "stickers": null,
      //         "groupedCertificates": null,
      //         "responsiblePerson": null,
      //         "responsiblePersonCode": null,
      //         "responsiblePersonId": null,
      //         "registrationDate": "2021-12-03T12:16:50.711186Z",
      //         "lockoutEnd": null
      //       },
      //       {
      //         "id": "22390126-9055-439c-beb1-9e08e5cb99b2",
      //         "firstName": null,
      //         "lastName": null,
      //         "identity": "111111111",
      //         "role": "user",
      //         "userName": "lobione.edit@gmail.com",
      //         "uniqueCode": "8817",
      //         "userStatus": null,
      //         "userType": "Juridical",
      //         "gender": "NotSet",
      //         "deleted": false,
      //         "published": null,
      //         "enableCash": null,
      //         "phoneNumber": null,
      //         "workspacePhoneNumber": null,
      //         "email": "lobione.edit@gmail.com",
      //         "address": null,
      //         "juridicalInfo": {
      //           "id": 192,
      //           "createDate": "2021-11-29T06:29:06.687368Z",
      //           "commercialName": "სათვალე",
      //           "juridicalName": "შპს სათვალე",
      //           "identificationNumber": "111111111",
      //           "juridicalType": "JointStock",
      //           "directorFirstName": "სალომე ",
      //           "directorLastName": "ქერქაძე",
      //           "contactPersonFirstName": "თაკო",
      //           "contactPersonLastName": "იდუკაშვილი"
      //         },
      //         "vehicleInfo": null,
      //         "stickers": null,
      //         "groupedCertificates": null,
      //         "responsiblePerson": null,
      //         "responsiblePersonCode": null,
      //         "responsiblePersonId": null,
      //         "registrationDate": "2021-11-29T03:37:01.249113Z",
      //         "lockoutEnd": null
      //       },
      //       {
      //         "id": "0448080b-47e8-48a1-9cd8-465c5c4114c6",
      //         "firstName": null,
      //         "lastName": null,
      //         "identity": "18274637",
      //         "role": "user",
      //         "userName": "idukashvili.tako@gmail.com",
      //         "uniqueCode": "3817",
      //         "userStatus": null,
      //         "userType": "Juridical",
      //         "gender": "NotSet",
      //         "deleted": false,
      //         "published": null,
      //         "enableCash": null,
      //         "phoneNumber": null,
      //         "workspacePhoneNumber": null,
      //         "email": "idukashvili.tako@gmail.com",
      //         "address": null,
      //         "juridicalInfo": {
      //           "id": 190,
      //           "createDate": "2021-11-26T06:48:44.39485Z",
      //           "commercialName": "თაკო",
      //           "juridicalName": "შპს \"თაკო\"",
      //           "identificationNumber": "18274637",
      //           "juridicalType": "LimitedLiability",
      //           "directorFirstName": "Tako",
      //           "directorLastName": "idukashvili",
      //           "contactPersonFirstName": "takotako",
      //           "contactPersonLastName": "tamar"
      //         },
      //         "vehicleInfo": null,
      //         "stickers": null,
      //         "groupedCertificates": null,
      //         "responsiblePerson": null,
      //         "responsiblePersonCode": null,
      //         "responsiblePersonId": null,
      //         "registrationDate": "2021-11-26T06:28:18.498175Z",
      //         "lockoutEnd": null
      //       }
      //     ],
      //   })
      // }
      store.dispatch('app-user/fetchNotifications')
          .then((response) => {
            this.notifications = response.data.data
            this.notificationsMeta = response.data.meta
          })
    },
    deleteNotification(id) {
      store.dispatch('app-user/deleteNotification', {id: id}).then(() => {
        this.toast('შეტყობინება წარმატებით წაიშალა')
        this.fetchNotifications()
        // this.goBack()
      }).catch(() => {
        this.toast('დაფიქსირდა შეცდომა', 'danger')
      })
    },
    redirectToNotification(id = null) {
      this.$router.push({name: 'notification', params: {id: id}})
    },
    toast(title, variant = 'success', toaster = 'b-toaster-bottom-right', append = false) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: `${title}`,
          icon: 'EditIcon',
          variant: variant,
        },
      })
    },
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-user';

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    });

  },
}
</script>

<style scoped>

</style>
