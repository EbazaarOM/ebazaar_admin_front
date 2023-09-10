<!-- eslint-disable vue/attributes-order -->
<template>
  <div class="mb-2">
    <p>{{ $t('statistics.cancelledProductsAndOrders') }}</p>
    <StatsDatePicker
      v-if="datepickerEnabled"
      :handle-from-change="handleFromChange"
      :handle-to-change="handleToChange"
    />
    <div class="my-1">
      <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" size="sm" v-b-toggle.denied-product-table variant="light">
        {{ $t('statistics.viewSpreadsheet') }}
      </b-button>
    </div>
    <b-collapse id="denied-product-table">
      <b-table
        v-if="items"
        :fields="fields"
        :items="items"
        class="table-sm rounded-lg shadow-sm order-table"
        small
        hover
        bordered
        striped
        responsive
        sticky-header
        primary-key="id"
        show-empty
        empty-text="No matching records found"
      >
      <!--  -->
      </b-table>
    </b-collapse>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BTable,
  BButton,
  BCollapse,
  VBToggle
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive'
import StatsDatePicker from '../StatsDatePicker.vue'


export default {
  name: 'ProductsTable',
  components: {
    BTable,
    StatsDatePicker,
    BButton,
    BCollapse,
  },
    directives: {
    'b-toggle': VBToggle,
    Ripple,
  },
  props: {
    prodStats: Object,
    handleFromChange: Function,
    handleToChange: Function,
    datepickerEnabled: Boolean,
  },
  data() {
    return {
      items: '',
      role: '',
      fields: [
        { key: 'productCode', label: this.$i18n.t('statistics.productCode') },
        { key: 'productTitle', label: this.$i18n.t('statistics.productTitle') },
        { key: 'quantity', label: this.$i18n.t('statistics.quantity') },
        { key: 'incomeAmount', label: this.$i18n.t('statistics.incomeAmount'), formatter: val => val && `${val.toFixed(2)} ₾`  },
      ]
    }
  },
  mounted() {
    this.role = localStorage.getItem('role');
    if (this.role === 'admin') {
      this.fields.push(
        { key: 'unitCost', label: this.$i18n.t('products.sellingPrice'), formatter: val => val && `${val.toFixed(2)} ₾` },
        { key: 'farmerFullName', label: this.$i18n.t('statistics.farmerName'), },
        { key: 'farmerCode', label: this.$i18n.t('statistics.farmerCode'), },
      )
    } else if (this.role === 'consul') {
     this.fields.push(
        { key: 'farmerFullName', label: this.$i18n.t('statistics.farmerName'), },
        { key: 'farmerCode', label: this.$i18n.t('statistics.farmerCode'), },
      ) 
    }


  },
  watch: {
    prodStats(newVal) {
      if(this.role === 'admin'){
        const arr  = [];
        newVal.data.forEach((e) =>{
          arr.push(...e.products);
        })
        this.items = arr;
      } else {
        this.items = newVal.products;
      }
    },
  },
  computed: {
    totalIncome(){
      if(this.prodStats.products){
        let count = 0;
        this.prodStats.products.forEach((e) =>{
          count += e.incomeAmount;
        })
        return count;
      }
    },
  },

}
</script>

<style>

</style>
