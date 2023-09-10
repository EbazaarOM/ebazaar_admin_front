<template>
  <b-card>
    <b-row md="12" class="review-top">
      <b-col md="6" class="d-flex align-items-center">
        <template>
          <b-avatar
              size="70"
              rounded
              :src="staticEnvValue + `/` + review.productImage"
              variant="light-primary"
              class="badge-minimal"
          >
            <feather-icon
                v-if="!review.productImage"
                icon="StarIcon"
                size="22"
            />
          </b-avatar>
          <div class="d-flex flex-column align-items-start ml-1 user-nav">
            <b-link class="user-name font-weight-bolder mb-0" target="_blank"
                    :to="{ name: 'product-view', params: { id: review.productCode } }">
              {{ `${review.productTitle} - ${review.productCode}` }}
            </b-link>
            <ul class="unstyled-list list-inline mb-0">
              <li
                  v-for="star in 5"
                  :key="star"
                  class="ratings-list-item mr-25"
              >
                <feather-icon
                    icon="StarIcon"
                    size="18"
                    :class="[{'fill-current': star <= review.mark}, star <= review.mark ? 'text-warning' : 'text-muted']"
                />
              </li>
            </ul>
          </div>
        </template>
      </b-col>
      <b-col v-if="userRole === 'admin' || userRole === 'callCenterManager'" md="6"
             class="d-flex justify-content-end align-items-center">
        <b-button :disabled="review.approved"
                  @click="confirmAction('Are you sure you want to approve review?', 'success', 'approveReview')"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="success"
        >
          <feather-icon
              icon="CheckIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ review.approved ? $t('reviews.approved') : $t('reviews.approve') }}</span>
        </b-button>
        <b-button
            @click="confirmAction('Are you sure you want to hide review?', 'warning', 'hideReview')"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="warning"
            class="ml-1"
        >
          <feather-icon
              icon="EyeOffIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('reviews.hide') }}</span>
        </b-button>
        <b-button
            @click="confirmAction('Are you sure you want to delete review?', 'danger', 'deleteReview')"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="danger"
            class="ml-1"
        >
          <feather-icon
              icon="TrashIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('reviews.delete') }}</span>
        </b-button>
      </b-col>
    </b-row>
    <hr/>
    <b-row class="review-center">
      <b-col md="8">
        <!--        <p class="mt-1">{{ review.text }}</p>-->
        <div
            class="d-flex align-items-start mb-1"
        >
          <b-avatar
              :src="review.avatar"
              size="34"
              variant="light-primary"
              class="mt-25 mr-75"
          />
          <div class="profile-user-info w-100">
            <div class="d-flex flex-column align-items-start justify-content-start">
              <h6 class="mb-0">
                {{ review.author }}
              </h6>
              <p class="mb-0">
                <small class="text-muted">{{ new Date(review.createDate).toLocaleString() }}</small>
              </p>
            </div>
            <p>{{ review.text }}</p>
          </div>
        </div>
        <div v-if="review.comments.length > 0" class="pl-4">
          <div
              v-for="(comment,ind) in review.comments"
              :key="ind"
              class="d-flex align-items-start mb-1"
          >
            <b-avatar
                :src="comment.avatar"
                size="34"
                variant="light-secondary"
                class="mt-25 mr-75"
            />
            <div class="profile-user-info w-100">
              <div class="d-flex flex-column align-items-start justify-content-start">
                <h6 class="mb-0">
                  {{ comment.author }}
                  <small v-if="userRole === 'admin' || userRole === 'callCenterManager'"
                         :class="comment.approved ? 'text-success' : 'text-warning'">
                    {{ comment.approved ? 'Approved' : 'Hidden' }}
                  </small>
                </h6>
                <p class="mb-0">
                  <small class="text-muted">{{ new Date(comment.createDate).toLocaleString() }}</small>
                </p>
              </div>
              <div class="d-flex justify-content-between align-items-start">
                <p>{{ comment.text }}</p>

                <!-- Dropdown -->
                <b-dropdown
                    v-if="userRole === 'admin' || userRole === 'callCenterManager'"
                    variant="link"
                    toggle-class="p-0"
                    no-caret
                    :right="$store.state.appConfig.isRTL"
                >

                  <template #button-content>
                    <feather-icon
                        icon="MoreVerticalIcon"
                        size="16"
                        class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item
                      :disabled="comment.approved"
                      @click="confirmAction('Are you sure you want to approve comment?', 'success', 'approveComment', comment.id)"
                  >
                    <feather-icon icon="CheckIcon"/>
                    <span class="align-middle ml-50">{{ $t('reviews.approve') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item
                      @click="confirmAction('Are you sure you want to hide comment?', 'warning', 'hideComment', comment.id)"
                  >
                    <feather-icon icon="EyeOffIcon"/>
                    <span class="align-middle ml-50">{{ $t('reviews.hide') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item
                      @click="confirmAction('Are you sure you want to delete comment?', 'danger', 'deleteComment', comment.id)"
                  >
                    <feather-icon icon="TrashIcon"/>
                    <span class="align-middle ml-50">{{ $t('reviews.delete') }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <hr v-if="review.approved"/>
    <b-row v-if="review.approved" class="review-bottom">
      <b-col md="12" class="d-flex flex-column justify-content-end align-items-end">
        <b-form-textarea v-model="reviewComment"></b-form-textarea>
        <b-button
            :disabled="reviewComment === ''"
            @click="addComment"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="ml-1 mt-1"
        >
          <feather-icon
              icon="MessageSquareIcon"
              class="mr-50"
          />
          <span class="align-middle">{{ $t('reviews.reply') }}</span>
        </b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BRow,
  BCol,
  BAvatar,
  BLink,
  BButton,
  BFormTextarea,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";

export default {
  name: "Review",
  props: ['review', 'comment'],
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BRow,
    BCol,
    BAvatar,
    BLink,
    BButton,
    BFormTextarea,
    BDropdown,
    BDropdownItem,
  },
  data() {
    return {
      staticEnvValue: '',
      reviewComment: ''
    }
  },

  watch: {
    comment: function () {
      this.reviewComment = ''
    }
  },

  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('userInfo'));
    },

    userRole() {
      return this.userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    },
  },

  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },

  methods: {
    approveReview() {
      this.$emit('approve-review', this.review.id)
    },
    hideReview() {
      this.$emit('hide-review', this.review.id)
    },
    deleteReview() {
      this.$emit('delete-review', this.review.id)
    },
    addComment() {
      let payload = {
        reviewId: this.review.id,
        text: this.reviewComment
      }
      this.$emit('add-comment', payload)
    },
    approveComment(id) {
      this.$emit('approve-comment', id)
    },
    hideComment(id) {
      this.$emit('hide-comment', id)
    },
    deleteComment(id) {
      this.$emit('delete-comment', id)
    },

    confirmAction(text, variant, methodName, data = null) {
      this.boxTwo = ''
      this.$bvModal
          .msgBoxConfirm(text, {
            title: 'Please confirm',
            size: 'sm',
            okVariant: variant,
            okTitle: 'Yes',
            cancelTitle: 'No',
            cancelVariant: 'outline-secondary',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => {
            if (value) {
              this[methodName](data)
            }
          })
    },
  }
}
</script>

<style scoped>

</style>
