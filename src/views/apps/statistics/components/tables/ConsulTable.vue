<template>
  <b-table
    v-if="prodStats"
    :fields="fields"
    :items="prodStats"
    class="table-sm rounded-lg shadow-sm order-table"
    small
    hover
    bordered
    sticky-header
    striped
    responsive
    primary-key="id"
    show-empty
    empty-text="No matching records found"
  >
  <!--  -->
  </b-table>
</template>

<script>
/* eslint-disable */
import {
  BTable,
} from 'bootstrap-vue';

export default {
  name: 'ConsulTable',
  components: {
    BTable,
  },
  props: {
    prodStats: Array,
  },
  data() {
    return {
      role: '',
      fields: [
        { key: 'consulCode', label: this.$i18n.t('statistics.consulCode') },
        { key: 'consulFullName', label: this.$i18n.t('statistics.consulName') },
        { key: 'bonusAmount', label: this.$i18n.t('statistics.bonus'),formatter: val => `${val.toFixed(2)} ₾` },
        { key: 'flowAmount', label: this.$i18n.t('statistics.turnover'),formatter: val => `${val.toFixed(2)} ₾` },
        { key: 'incomeAmount', label: this.$i18n.t('statistics.profit'), formatter: val => `${val.toFixed(2)} ₾`  },
        { key: 'orderCount', label: this.$i18n.t('statistics.orderCount') },
        { key: 'productCount', label: this.$i18n.t('statistics.productCount') },
      ],
    }
  },
  mounted() {
    this.role = localStorage.getItem('role');
  },
}
</script>

<style>

</style>
