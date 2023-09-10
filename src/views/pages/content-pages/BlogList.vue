<template>
  <div class="blog-wrapper">
    <horizontal-navbar/>

    <b-row class="mb-3 align-items-center">
      <b-col cols="6">
        <h2>{{ $t('blog.title') }}</h2>
      </b-col>
      <b-col
          cols="6"
          class="mt-50 d-flex justify-content-end"
      >
        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="redirectToBlog"
        >
          {{ $t('blog.addNew') }}
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col
          v-for="blog in blogList"
          :key="blog.id"
          md="4"
      >
        <b-card
            tag="article"
            no-body
        >
          <b-link :to="{ name: 'blog', params: { id: blog.id} }">
            <!--            <b-img-->
            <!--                :src="require('@/assets/images/slider/04.jpg')"-->
            <!--                :alt="blog.image.slice(5)"-->
            <!--                class="card-img-top"-->
            <!--            />-->
            <img :src="staticEnvValue + `/` + blog.image"
                 class="card-img-top"/>
          </b-link>
          <b-card-body>
            <b-card-title>
              <b-link
                  :to="{ name: 'blog', params: { id: blog.id} }"
                  class="blog-title-truncate text-body-heading"
              >
                {{ blog.title }}
              </b-link>
            </b-card-title>
            <b-card-text class="blog-content-truncate">
              {{ blog.shortDescription }}
            </b-card-text>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <b-media no-body>
                <b-media-body>
                  <small v-if="blog.createDate" class="text-muted">{{
                      new Date(blog.createDate).toLocaleString()
                    }}</small>
                </b-media-body>
              </b-media>
              <b-link
                  :to="{ name: 'blog', params: { id: blog.id } }"
                  class="font-weight-bold"
              >
                {{ $t('global.seeMore') }}
              </b-link>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <!-- blogs -->
    <b-row class="blog-list-wrapper" v-if="false">
      <b-col cols="12">
        <!-- pagination -->
        <div class="my-2">
          <b-pagination
              v-model="currentPage"
              align="center"
              :total-rows="blogsMeta.total"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
              />
            </template>
          </b-pagination>
        </div>
      </b-col>
    </b-row>
    <!--/ blogs -->
  </div>
</template>

<script>
/* eslint-disable */
import {
  BRow,
  BCol,
  BCard,
  BFormInput,
  BCardText,
  BCardTitle,
  BMedia,
  BAvatar,
  BMediaAside,
  BMediaBody,
  BImg,
  BCardBody,
  BLink,
  BBadge,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BButton,
  BPagination,
} from 'bootstrap-vue'
import {kFormatter} from '@core/utils/filter'
import ContentWithSidebar from '@core/layouts/components/content-with-sidebar/ContentWithSidebar.vue'
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    HorizontalNavbar,
    BRow,
    BCol,
    BCard,
    BFormInput,
    BCardText,
    BCardBody,
    BCardTitle,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BLink,
    BBadge,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    BImg,
    BPagination,
    BButton,
    ContentWithSidebar,
  },
  data() {
    return {
      search_query: '',
      blogList: [],
      blogSidebar: {},
      blogsMeta: {},
      currentPage: 1,
      perPage: 3,
      rows: 140,
      staticEnvValue: ''
    }
  },
  directives: {
    Ripple,
  },
  created() {
    this.fetchBlogsList();
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  methods: {
    fetchBlogsList() {
      store.dispatch('app-content/fetchBlogs')
          .then((response) => {
            this.blogList = response.data.data
            this.blogsMeta = response.data.meta
          })
    },
    redirectToBlog() {
      this.$router.push({name: 'blog'})
    },
  },
  setup() {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    });
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-blog.scss';
</style>
