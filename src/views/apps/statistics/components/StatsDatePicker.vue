<template>
  <div class="d-flex align-items-center flex-wrap">
    <div class="mb-1 mr-2 w-100" style="max-width: 150px">
      <label>{{ $t('global.from') }}</label>
      <b-form-datepicker
        :value="todaysDate"
        :reset-button="true"
        :date-format-options="{
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }"
        placeholder="დან"
        @input="handleFromChange"
      />
    </div>
    <div class="mb-1 mr-2 w-100" style="max-width: 150px">
      <label>{{ $t('global.to') }}</label>
      <b-form-datepicker
        :value="todaysDate"
        :reset-button="true"
        :date-format-options="{
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }"
        placeholder="მდე"
        @input="handleToChange"
      />
    </div>
  </div>
</template>

<script>
import {
  BFormDatepicker
} from 'bootstrap-vue';

export default {
  name: 'StatsDatePicker',
  components: {
    BFormDatepicker
  },
  data() {
    return {
      todaysDate: this.setTodaysDate()
    }
  },
  props: {
    handleFromChange: Function,
    handleToChange: Function,
  },
  methods: {
    setTodaysDate() {
      const day = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      return `${year}-${month}-${day}`;
    }
  },
}
</script>

<style>

</style>
