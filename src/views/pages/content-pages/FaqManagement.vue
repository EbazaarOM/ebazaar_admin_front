<template>
  <div>
    <horizontal-navbar/>
    <h2>{{ $t('faq.title') }}</h2>
    <faq></faq>
  </div>
</template>

<script>
/* eslint-disable */
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import Faq from "@/views/pages/content-pages/Faq";
export default {
  name: "FaqManagement",
  components: {Faq, HorizontalNavbar}
}
</script>

<style scoped>

</style>
