<template>
  <div>
    <horizontal-navbar></horizontal-navbar>
    <div class="d-flex align-items-end justify-content-between mb-2">
      <!-- Search -->
      <div class="d-flex align-items-center justify-content-end">
        <b-form-input
            v-model="searchQuery"
            class="mr-1 d-inline-block"
            :placeholder="$t('reviews.searchByProductCode')"
        />
        <b-button variant="primary"
                  @click="fetchReviews"
        >
          <span class="text-nowrap">{{ $t('global.search') }}</span>
        </b-button>

      </div>
      <b-button variant="success" @click="exportReviews">
        {{ $t('global.export') }}
      </b-button>
    </div>
    <div v-if="reviews.length === 0">
      <p class="text-center">{{ $t('reviews.notFound') }}</p>
    </div>
    <div v-else v-for="review in reviews" :key="review.id">
      <review :review="review"
              :comment="review.id === waitingId ? '' : null"
              @add-comment="addComment"
              @delete-comment="deleteComment"
              @hide-comment="hideComment"
              @approve-comment="approveComment"
              @delete-review="deleteReview"
              @hide-review="hideReview"
              @approve-review="approveReview"
      />
    </div>
    <b-pagination
        v-model="currentPage"
        hide-goto-end-buttons
        align="center"
        :total-rows="totalReviews"
        :per-page="perPage"
    />
  </div>
</template>

<script>
/* eslint-disable */
import {
  BPagination,
  BButton,
  BCol,
  BFormInput
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import productStoreModule from "@/views/apps/products/productStoreModule";
import {onUnmounted} from "@vue/composition-api";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import Review from "@/views/pages/reviews/components/Review";

const FileSaver = require('file-saver');

export default {
  name: "Reviews",
  components: {
    BPagination,
    BButton,
    Review,
    HorizontalNavbar,
    BCol,
    BFormInput
  },
  data() {
    return {
      reviews: [],
      requestFinished: false,
      waitingId: null,
      currentPage: 1,
      perPage: 5,
      totalReviews: 0,
      searchQuery: ''
    }
  },

  mounted() {
    this.fetchReviews()
  },

  watch: {
    currentPage(val) {
      window.scrollTo(0, 0);
      this.fetchReviews({
        take: this.perPage,
        skip: this.perPage * (val - 1)
      });
    }
  },

  methods: {
    // Reviews
    fetchReviews(data = {}) {
      let payload = {
        take: this.perPage,
        skip: data.skip ? data.skip : 0,
        searchWord: this.searchQuery
      }
      this.reviews = []
      return store.dispatch('app-product/fetchReviews', payload)
          .then(response => {
            this.reviews = response.data.data
            this.totalReviews = response.data.meta ? response.data.meta.total : 0
          })
          .catch(error => {
            console.log(error)
          })
    },
    deleteReview(reviewId) {
      return store.dispatch('app-product/deleteReview', {id: reviewId})
          .then(response => {
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    approveReview(reviewId) {
      return store.dispatch('app-product/approveReview', {id: reviewId})
          .then(response => {
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    hideReview(reviewId) {
      return store.dispatch('app-product/hideReview', {id: reviewId})
          .then(response => {
            this.toast('warning', 'Review hid', '')
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    exportReviews() {
      store.dispatch('app-product/exportReviews')
          .then(response => {
            FileSaver.saveAs(response.data, 'reviews.xls');
          })
          .catch(error => {
            console.log(error)
          })
    },

    // Comments
    addComment(payload) {
      return store.dispatch('app-product/addComment', payload)
          .then(response => {
            this.toast('success', 'Comment added', '')
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
            this.waitingId = payload.reviewId
            this.requestFinished = true
          })
          .catch(error => {
            console.log(error)
          })
    },
    deleteComment(reviewId) {
      return store.dispatch('app-product/deleteComment', {id: reviewId})
          .then(response => {
            this.toast('danger', 'Comment deleted', '')
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    approveComment(reviewId) {
      return store.dispatch('app-product/approveComment', {id: reviewId})
          .then(response => {
            this.toast('success', 'Comment approved', '')
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    hideComment(reviewId) {
      return store.dispatch('app-product/hideComment', {id: reviewId})
          .then(response => {
            this.toast('warning', 'Comment hid', '')
            this.fetchReviews({
              take: this.perPage,
              skip: this.perPage * (this.currentPage - 1)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },

    hideModal({id}) {
      console.log('hide modal', id, this.$refs)
      this.$refs['add-address'].hide();
    },
    toast(variant, title, icon) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: title,
          icon: icon,
          variant: variant,
        },
      })
    },
    isInvalid(errors) {
      for (const [key, value] of Object.entries(errors)) {
        if (value.length > 0) return true
      }
      let isJuridicalInfoValid = this.isLegalEntity ? (this.juridicalInfo.juridicalName !== ''
          && this.juridicalInfo.identificationNumber !== ''
          && this.juridicalInfo.juridicalType !== 'NotSet') : true

      return !(this.validate_username
          && this.validate_bank_account_number
          && this.validate_identification_number
          && this.validate_phone_number
          && isJuridicalInfoValid);
    },
    goBack() {
      if (this.isMyProfile) router.push({name: 'user-profile'})
      else router.push({name: 'user-profile', params: {id: this.userId}})
    },
  },

  setup() {
    const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

    // Register module
    if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME)
    });

  },

}
</script>

<style scoped>

</style>
