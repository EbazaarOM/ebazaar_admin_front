<!-- eslint-disable  -->
<template>
  <b-card no-body class="mb-0 orders-list">
	  <AddCommentOnProductModal :product="prodForComment" :refetchData="refetchData" />
    <div class="px-1 py-1 orders-title">
      <h5 class="mb-0">
        შეკვეთები
      </h5>
    </div>
    <!-- filters component -->
    <OrderFilters
      :per-page.sync="perPage"
      :per-page-options="perPageOptions"
      :search-query.sync="searchQuery"
      :status-string-filter.sync="statusFilter"
      :product-status-list="productStatusList"
      :refetchData="refetchData"
    />
    <!-- Table Top -->
    <div class="px-1">
      <b-table
        ref="refProductsListTable"
        bordered
        hover
        responsive
        class="shadow-sm rounded-lg"
        thead-tr-class="order-main-thead"
        :items="fetchProducts"
        :fields="role === 'consul' ? consulColumns : farmerColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #cell(productStatus)="data"
          style="padding: 0 !important;"
        >
          <div class="d-flex align-items-center">

            <b-form-select v-model="data.item.status" @change="watchSelect(data.item)" label="product-status" value-field="value" text-field="title" :disabled="disabledOrderStatuses.includes(data.item.orderStatus)">
              <b-form-select-option v-for="s in filteredStatuses" :disabled="s.disabled" :key="s.value" :value="s.value"  class="mb-0" >{{s.title}} </b-form-select-option>
            </b-form-select>
            <b-button
              variant="flat-success"
              class="btn-icon"
              :disabled="data.item.status === 'NotEnough' ||  data.item.orderStatus === 'Closed'"
              @click="setOrderProductStatus(data.item)"
            >
              <feather-icon size="20" icon="SaveIcon" />
            </b-button>
          </div>
        </template>
        <template #cell(unitOriginalRealCost)="data">
          {{ (data.item.unitOriginalRealCost * data.item.quantity).toFixed(2) }} ₾
        </template>
        <template #cell(unitSaleCost)="data">
          {{ (data.item.unitSaleCost * data.item.quantity).toFixed(2) }} ₾
        </template>
        <template #cell(quantity)="data">
          {{ (data.item.quantity * data.item.pieces) % 1 === 0 ? data.item.quantity * data.item.pieces : (data.item.quantity * data.item.pieces).toFixed(2) }} {{ data.item.unitTitle }}
        </template>
        <!-- Date -->
        <template #cell(createDate)="data">
          {{ data.item.orderCreateDate | formatDate }}
        </template>
        <!-- Status -->
        <template #cell(orderStatus)="data">
          {{ data.item.orderStatus }}
        </template>
        <!-- FarmerPhoneNumber -->
        <template #cell(farmerPhoneNumber)="data">
          {{ data.item.farmerPhoneNumber }}
        </template>
        <!-- Stickers -->
        <template #cell(stickers)="data">
          <div v-if="data.item.stickers" class="stickers-container-orders">
            <div v-for="st in data.item.stickers" :key="st.id">
              <img
                v-b-tooltip.hover.v-success
                :title="st.title"
                v-if="st.image"
                :src="staticEnvValue + `/` + st.image"
                alt="st.title"
              />
            </div>
					</div>
        </template>
        <!-- Specification -->
        <template #cell(specifications)="data">
          <span v-for="spec in data.item.specifications" :key="spec.id" class="mr-1">
            {{ `${spec.specificationCategoryTitle}: ${spec.specificationTitle}`}}
          </span>
        </template>
        <!-- sale -->
        <template #cell(sale)="data">
          {{ data.item.hasSale ? 'კი' : 'არა' }}
        </template>
        <!-- buyerFullName -->
        <template #cell(buyerFullName)="data">
          {{ data.item.buyerFullName }}
        </template>
        <!-- Details -->
      </b-table>
    </div>
    <!-- Paginations -->
    <div class="mx-2 mb-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span v-if="true" class="text-muted">
            Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
            {{ dataMeta.of }} entries
          </span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalProducts"
            :per-page="perPage"
            first-number
            last-number
            class="mt-1 mb-0 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
/* eslint-disable */
import { BCard, BRow, BCol, BTable, BPagination, BFormSelect, BButton, BFormInput, BFormSelectOption, VBTooltip } from 'bootstrap-vue';
import moment from 'moment';
import { onUnmounted } from '@vue/composition-api';
import store from '@/store';
import orderStoreModule from '../orderStoreModule';
import AddProductModal from './AddProductModal.vue';
import AssignCourierModal from './AssignCourierModal.vue';
import OrderFilters from './OrderFilters.vue';
import useProductsList from '../useProductsList'
import AddCommentOnProductModal from './AddCommentOnProductModal.vue';

export default {
  name: 'OrderProductsList',
  components: {
    AddCommentOnProductModal,
    BFormSelectOption,
    VBTooltip,
    OrderFilters,
    BFormInput,
    BFormSelect,
    AddProductModal,
    AssignCourierModal,
    BCard,
    BRow,
    BCol,
    BTable,
    BPagination,
    BButton
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  filters: {
    formatDate(value) {
      return moment(String(value)).format('HH:mm  MM/DD/YYYY');
    },
  },
  computed: {
		filteredStatuses() {
			const filteredList = this.productStatusList.slice();
			filteredList.forEach((e)=>{
				if(!e.role.includes(this.role)){
					e.disabled = true;
				}
			})
			return filteredList;
    }
	},

  props: {
    toast: Function,
    productStatusList: Array,
    role: String,
    setOrderProductStatus: Function,
    confirmOrder: Function,
    currentOrderId: String,
    setCurrentOrderId: Function,
    triggerRefetch: Number,
    farmerColumns: Array,
    // tableColumns: Array,
    consulColumns: Array,
  },
  watch: {
    statusFilter(newVal){
      console.log(newVal);
    },
    triggerRefetch(newVal){
      this.refetchData();
    },
	},
  data() {
		return {
			staticEnvValue: '',
      searchSomething: '',
			// filters
      prodForComment: {},
      disabledOrderStatuses : [
        'Closed', 'CancelledByAvailability', 'CancelledByCollecting', 'CancelledByGathering', 'Cancelled'
      ]
		};
	},
  mounted() {
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
    this.timer = setInterval(this.refetchData, 60000);
	},
  methods: {
		watchSelect(newVal){
			if(newVal.status === 'NotEnough'){
				this.prodForComment = newVal;
				this.$bvModal.show('add-comment-on-product-modal');
			}
		},
  },
  setup(props) {
		const Order_APP_STORE_MODULE_NAME = 'app-orders';

		// Register module
		if (!store.hasModule(Order_APP_STORE_MODULE_NAME)) {
			store.registerModule(Order_APP_STORE_MODULE_NAME, orderStoreModule);
		}


		const {
			perPage,
			perPageOptions,
			currentPage,
			searchQuery,
			totalProducts,
			fetchProducts,
			// tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			productsList,
      refProductsListTable,
      // farmerColumns,
      statusFilter,
		} = useProductsList(props);

		return {
			// from composable
			perPage,
			perPageOptions,
			currentPage,
			searchQuery,
			totalProducts,
			fetchProducts,
			// tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			productsList,
      refProductsListTable,
      // farmerColumns,
      statusFilter,
		};
	},

}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  [dir] .table-hover tbody tr {
    transition: background 0.3s ease;
    cursor: default;
  }
  .order-main-thead div {
    padding: 0.5rem 0 !important;
    font-size: 1rem;
  }
  .orders-list .per-page-selector {
    min-width: 90px;
  }

  .orders-title {
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
    border-top-left-radius: 0.428rem;
    border-top-right-radius: 0.428rem;
    h5 {
      color: white;
    }
  }

  .b-table-row-selected {
    border-left: 2px solid #7367f0;
    border-right: 2px solid #7367f0;
    font-weight: bolder;
    background: rgb(243, 243, 243) !important;
  }

  .b-table-row-selected td {
    border-bottom: 2px solid #8f87e9a4 !important;
    border-right: 2px solid #8f87e9a4 !important;
    color: #7367f0;
  }

  .b-table-details {
    border: 2px solid #7367f0;
    border-top: 0;
    transition: all 0.3s ease;
    background: rgb(211, 211, 211) !important;
    th {
      padding: 0.75rem 0.5rem !important;
      background:  rgb(40 199 111 / 70%)!important;
    }
    tr {
      background: rgb(230, 230, 230);
    }
  }

  .specsColumn {
    min-width: 300px;
    padding: 0 !important;
  }
  .stickers-container-orders {
    padding: 0;
    margin: 0;
    display: flex;

    img {
      width: 30px;
      height: 30px;
      margin-right: 0.25rem;
    }
  }
</style>
