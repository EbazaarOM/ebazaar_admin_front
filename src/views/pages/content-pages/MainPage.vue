<template>
  <div>
    <horizontal-navbar/>

    <h2 class="mb-4">{{ $t('mainPage.title') }}</h2>

    <hr>

    <main-slider/>

    <hr>

    <features/>

    <hr>

    <banners/>

    <hr>
  </div>
</template>

<script>
/* eslint-disable */
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import MainSlider from "@/views/pages/content-pages/components/MainSlider";
import Features from "@/views/pages/content-pages/components/Features";
import Banners from "@/views/pages/content-pages/components/Banners";
export default {
  name: "MainPage",
  components: {Banners, Features, MainSlider, HorizontalNavbar}
}
</script>

<style scoped>

</style>
