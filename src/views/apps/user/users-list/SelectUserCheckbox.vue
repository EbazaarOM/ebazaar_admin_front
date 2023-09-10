<template>
<div>
  <b-form-checkbox
      v-model="selected"
      @input="onPreviewClick($event, data)"
  ></b-form-checkbox>
</div>
</template>

<script>
/* eslint-disable */
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BForm, BFormCheckbox,
  BBadge, BPagination, BFormSelect, BSpinner, BFormGroup, BFormInvalidFeedback, BFormDatepicker, BFormCheckboxGroup
} from 'bootstrap-vue'

export default {
  name: "SelectUserCheckbox",
  components: {
    BFormInvalidFeedback,
    BForm,
    BSpinner,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BPagination,
    BFormSelect,
    BFormGroup,
    BFormDatepicker,
    BFormCheckboxGroup,
    BFormCheckbox,
  },
  props: ['isSelected', 'data', 'index'],
  data() {
    return {
      selected: false
    }
  },
  mounted() {
    this.selected = this.isSelected
  },
  methods: {
    onPreviewClick(value, item) {
      if (this.isSelected !== value) this.$emit('check', {value: value, item: item})
    },
  },
}
</script>

<style scoped>

</style>
