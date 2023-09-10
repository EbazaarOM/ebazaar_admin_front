<template>
  <div>
    <b-form-select v-if="selectedValue"
                   v-model="selectedValue"
                   :disabled="isDisabled"
                   :options="selectOptions"
    />
    <b-button class="btn-icon mr-1" variant="flat-primary" :disabled="isDisabled || disabled" @click="update">
      <feather-icon v-if="!loader" size="16" icon="SaveIcon"/>
      <b-spinner v-else small/>
    </b-button>
  </div>
</template>

<script>
/* eslint-disable */
import {BFormSelect, BButton, BSpinner} from 'bootstrap-vue'

export default {
  components: {
    BFormSelect,
    BButton,
    BSpinner
  },
  // props: ['selected', 'options', 'id', 'loader', 'isDisabled'],
  props: {
    selected: {},
    id: {},
    loader: {},
    isDisabled: {},
    options: {}
  },
  data() {
    return {
      selectedValue: null,
      disabled: true,
      selectOptions: null,
      defaultOptions: [
        {value: 'NotSet', payloadValue: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'published', payloadValue: true, text: this.$i18n.t('global.published')},
        {value: 'unpublished', payloadValue: false, text: this.$i18n.t('global.unpublished')},
      ]
    }
  },
  watch: {
    selectedValue: function (val) {
      if (val !== this.selected)
        this.disabled = false
    },
  },
  mounted() {
    this.selectOptions = this.options ? this.options : this.defaultOptions
    this.selectedValue = this.selectOptions.find(el => el.payloadValue === this.selected).value
  },

  methods: {
    update() {
      this.$emit('update', {id: this.id, status: this.selectOptions.find(el => el.value === this.selectedValue).payloadValue})
      this.disabled = true;
    }
  }
}
</script>
