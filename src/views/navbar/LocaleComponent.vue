<template>
  <b-nav-item-dropdown
      id="dropdown-grouped"
      variant="link"
      class="dropdown-language"
      right
  >
    <template #button-content>
      <b-img
          :src="currentLocale ? currentLocale.img: ''"
          height="14px"
          width="22px"
          :alt="currentLocale ? currentLocale.locale : ''"
      />
    </template>
    <b-dropdown-item
        v-for="localeObj in locales"
        :key="localeObj.locale"
        @click="changeLocale(localeObj)"
    >
      <b-img
          :src="localeObj ? localeObj.img : ''"
          height="14px"
          width="22px"
          :alt="localeObj.locale"
      />
      <span class="ml-50">{{ localeObj.name }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
/* eslint-disable */
import { BNavItemDropdown, BDropdownItem, BImg } from 'bootstrap-vue'
import router from "@/router";

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg,
  },
  // ! Need to move this computed property to comp function once we get to Vue 3
  computed: {
    currentLocale() {
      return this.locales.find(l => l.locale === localStorage.getItem('lang'))
    },
  },
  methods: {
    changeLocale(localeObj) {
      this.$i18n.locale = localeObj.locale
      this.$route.params.lang = localeObj.locale
      localStorage.setItem('lang', localeObj.locale)

      let newPath = this.$route.fullPath.split('/')
      newPath[1] = localeObj.locale
      router.push({ path: newPath.join("/") })
    }
  },
  setup() {
    /* eslint-disable global-require */
    const locales = [
      {
        locale: 'en',
        img: require('@/assets/images/flags/en.png'),
        name: 'English',
      },
      {
        locale: 'ka',
        img: require('@/assets/images/flags/ka.png'),
        name: 'ქართული',
      }
    ]
    /* eslint-disable global-require */

    return {
      locales,
    }
  },
}
</script>

<style>

</style>
