<template>
  <div>
    <b-input-group v-for="address in addresses" :key="address.id" class="mb-1 p-2">
      <b-input-group-prepend is-text>
        <input v-model="address.selected" type="radio" aria-label="Radio for following text input">
      </b-input-group-prepend>
      <b-input-group-append class="w-75">
        <b-row class="ml-1 full-width">

          <!-- Field: Region -->
          <b-col
              cols="12"
              md="4"
              lg="3"
          >
            <b-form-group
                label="რეგიონი"
                label-for="region"
            >
              <span v-if="address.regionText">{{ address.regionText.title }}</span>
              <span v-else>-</span>

            </b-form-group>
          </b-col>

          <!-- Field: Municipality -->
          <b-col
              cols="12"
              md="4"
              lg="3"
          >
            <b-form-group
                label="ქალაქი"
                label-for="municipality"
            >
              <span v-if="address.cityText">{{ address.cityText.title }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Village -->
          <b-col
              cols="12"
              md="4"
              lg="3"
          >
            <b-form-group
                label="სოფელი"
                label-for="village"
            >
              <span v-if="address.village">{{ address.village.title }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>

          <!-- Field: Address -->
          <b-col
              cols="12"
              md="4"
              lg="3"
          >
            <b-form-group
                label="მისამართი"
                label-for="address"
            >
              <span v-if="address.address">{{ address.address }}</span>
              <span v-else>-</span>
            </b-form-group>
          </b-col>
        </b-row>
      </b-input-group-append>
    </b-input-group>
  </div>

</template>

<script>
/* eslint-disable */

import {
  BCol,
  BRow,
  BFormGroup,
  BInputGroup,
} from 'bootstrap-vue'

export default {
  name: "Address",
  components: {
    BCol,
    BRow,
    BFormGroup,
    BInputGroup,
  },

  props: {
    addresses: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      selectedAddress: ''
    }
  }
}
</script>

<style scoped>

</style>
