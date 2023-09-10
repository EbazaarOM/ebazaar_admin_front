<template>
  <div class="d-flex align-items-center">
    <b-form-select
        v-model="item.status"
        label="product-status"
        value-field="value"
        text-field="title"
        :disabled="disabledOrderStatuses.includes(orderStatus)"
        @change="watchSelect(item)"
    >
      <b-form-select-option
          v-for="s in filteredStatuses"
          :key="s.value"
          :disabled="s.disabled"
          :value="s.value"
          class="mb-0"
      >{{ s.title }}
      </b-form-select-option>
    </b-form-select>
    <b-button
        variant="flat-success"
        :disabled="item.status === 'NotEnough' || disabledOrderStatuses.includes(orderStatus)"
        class="btn-icon"
        @click="$emit('save', item)"
    >
      <feather-icon size="20" icon="SaveIcon"/>
    </b-button>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BTable,
  BButton,
  BFormInput,
  BInputGroup,
  BFormSelect,
  BFormSelectOption,
} from 'bootstrap-vue';
import AddCommentModal from "@/views/apps/orders/components/AddCommentModal";
import AddCommentOnProductModal from "@/views/apps/orders/components/AddCommentOnProductModal";
import ClientInfoComment from "@/views/apps/orders/components/ClientInfoComment";

export default {
  name: "StatusSelectField",
  components: {
    AddCommentModal,
    BFormSelectOption,
    AddCommentOnProductModal,
    ClientInfoComment,
    BTable,
    BButton,
    BFormInput,
    BInputGroup,
    BFormSelect,
  },
  props: ['item', 'role', 'productStatusList', 'products', 'orderStatus'],
  data(){
    return {
      disabledOrderStatuses : [
        'Closed', 'CancelledByAvailability', 'CancelledByCollecting', 'CancelledByGathering', 'Cancelled'
      ]
    }
  },

  computed: {
    filteredStatuses() {
      let warehouseCheck = false;
      let deliveredCheck = false;
      this.item.status === 'InWarehouse' || this.item.status === 'NotInWarehouse' ? warehouseCheck = true : ''
      this.item.status === 'Delivered' || this.item.status === 'NotDelivered' ? deliveredCheck = true : ''

      const filteredList = this.productStatusList.slice();

      filteredList.forEach((e) => {
        if (!e.role.includes(this.role) || e.value === 'Delivered' || e.value === 'NotDelivered') {
          e.disabled = true;
        }
        if ((warehouseCheck || deliveredCheck) && (e.value === 'Delivered' || e.value === 'NotDelivered') && e.role.includes(this.role)) {
          e.disabled = false;
        }
      });
      return filteredList;
    },
  },
  methods: {
    watchSelect(newVal) {
      this.$emit('watch', newVal)
    },
  }
}
</script>

<style scoped>

</style>
