<!-- eslint-disable -->
<template>
	<div class="">
		<AddCommentModal
			:comment.sync="order.comment"
			:order="order"
			:addComment="addComment"
		/>
		<AddCommentOnProductModal
			:product="prodForComment"
			:refetchData="refetchData"
		/>
		<ClientInfoComment :order="order" :role="role" :totalByCard="totalByCard" :totalByCash="totalByCash" />
		<div class="mt-2">
			<button
				v-if="
					(role === 'admin' || role === 'callCenterManager') &&
          order.payzeStatus === 'Blocked'
          &&
          order.orderStatus === 'Delideverd' || order.orderStatus === 'PartiallyReturned'
				"
				class="btn btn-primary mr-1 btn-sm"
				:disabled="commited"
				@click.prevent="commitButton(orderId)"
			>
<!--        თანხის ჩამოჭრა????  -->
        {{ $t('orders.makeTransaction') }}
			</button>
			<b-button
				v-if="showEdit.includes(order.orderStatus)"
				v-b-modal.add-product-modal
				variant="primary"
				class="mr-1 btn-sm"
			>
        {{ $t('orders.insertProduct') }}
			</b-button>
			<b-button
				v-if="role === 'callCenterManager' && order.callCenterFullName === null"
				variant="primary"
				class="mr-1 btn-sm"
				@click.prevent="assignCallCenterToOrder"
			>
<!--				შეკვეთის აღება (ქოლ ცენტრი) ?? -->

        {{ $t('orders.takeOrder') }}
      </b-button>
			<!-- show only when collected  and ungathered -->
			<b-button
				v-if="
					(order.orderStatus === 'Collected' ||
						order.orderStatus === 'Ungathered' ||
						order.orderStatus === 'PartiallyCollected') &&
					(role === 'admin' || role === 'logisticsManager')
				"
				v-b-modal.assign-courier-modal
				variant="primary"
				class="mr-1 btn-sm"
			>
<!--				კურიერის მიბმა-->
        {{ $t('orders.addCourier') }}
			</b-button>
			<b-button
				v-if="order.courierFullName"
				@click.prevent=""
				variant="primary"
				class="mr-1 btn-sm"
			>
        {{ $t('roles.courier') }}: {{ order.courierFullName }}
			</b-button>
			<b-button
				v-if="role === 'admin' || role === 'callCenterManager'"
				v-b-modal.add-comment-modal
				variant="primary"
				class="mr-1 btn-sm"
			>
        {{ $t('comment.add') }}
			</b-button>
			<b-button
				v-if="
					(role === 'admin' || role === 'callCenterManager') &&
          !disableCancel.includes(order.orderStatus)
				"
				@click.prevent="cancelButton(order.id)"
				variant="danger"
				class="mr-1 btn-sm"
			>
        {{ $t('orders.cancel') }}
			</b-button>
			<b-button
				v-if="
					(role === 'admin' || role === 'callCenterManager') &&
					(order.orderStatus === 'PartiallyReturned' ||
						order.orderStatus === 'Delivered') &&
					order.paymentType === 'Cash'
				"
				@click.prevent="finishOrder(order.id)"
				variant="danger"
				class="mr-1 btn-sm"
			>
<!--				დასრულება-->
        {{ $t('orders.finish') }}
			</b-button>
      <b-button
				v-if="
					(role === 'admin' || role === 'callCenterManager') &&
					allowClose.includes(order.orderStatus)
				"
				@click.prevent="closeOrder(order.id)"
				variant="danger"
				class="mr-1 btn-sm"
			>
<!--				დახურვა-->
        {{ $t('orders.close') }}
			</b-button>
      <b-button
				v-if="(role === 'admin' || role === 'callCenterManager') && order.transactionId"
				@click.prevent="fetchTransactionInfo(order.id)"
				variant="success"
				class="mr-1 btn-sm"
        v-b-modal.transaction-info-modal
			>
        {{ $t('orders.transactionInfo') }}
			</b-button>
		</div>
		<b-table
			v-if="order.products"
			:fields="filteredFields"
			:items="order.products"
			class="table-sm rounded-lg shadow-sm order-table mt-1"
			small
			hover
			bordered
			striped
			responsive
			primary-key="id"
			show-empty
			empty-text="No matching records found"
		>
        <!-- actions column -->
			<template
				v-if="role === 'admin' || role === 'callCenterManager'"
				#cell(actions)="data"
				style="padding: 0 !important"
			>
				<div class="d-flex align-items-center">
					<b-button
						v-if="showEdit.includes(order.orderStatus)"
						class="btn-icon"
						variant="flat-danger"
						@click="removeProductButton(data.item)"
					>
						<feather-icon size="16" icon="TrashIcon" />
					</b-button>
				</div>
			</template>
			<!-- status column -->
			<template #cell(productStatus)="data" style="padding: 0 !important">
				<StatusSelectField
					:item="data.item"
					:role="role"
					:products="order.products"
					:productStatusList="productStatusList"
          :orderStatus="order.orderStatus"
					@watch="watchSelect"
					@save="setOrderProductStatus"
				/>
			</template>
			quantity-tota
			<template #cell(quantity-total)="data">
				{{ (data.item.quantity * data.item.pieces) % 1 === 0 ? data.item.quantity * data.item.pieces : (data.item.quantity * data.item.pieces).toFixed(2) }} {{ data.item.unitTitle }}
			</template>
			<!-- quantity column -->
			<template #cell(quantity)="data">
				<div class="d-flex align-items-center">
					<div class="">
						<!-- <b-input-group :append="data.item.unitTitle"> -->
						<b-form-input
							v-model="data.item.quantity"
							type="text"
							style="max-width: 75px"
							:readonly="!showEdit.includes(order.orderStatus) || role === 'logisticsManager'"
						/>
						<!-- </b-input-group> -->
					</div>
					<div v-if="role != 'logisticsManager'">
						<b-button
							v-if="showEdit.includes(order.orderStatus)"
							variant="flat-success"
							class="btn-icon"
							@click="updateQuantity(data.item)"
						>
							<feather-icon size="20" icon="SaveIcon" />
						</b-button>
					</div>
				</div>
			</template>
			<!-- cost column -->
			<template #cell(unitSaleCost)="data">
				{{ (data.item.unitSaleCost * data.item.quantity).toFixed(2) }} ₾
			</template>
      <template #cell(lastStatusUpdate)="data">
        <span v-if="data.item.lastStatusUpdate">
          {{ data.item.lastStatusUpdate.updateDate | formatDate }}
        </span>
      </template>

		</b-table>
	</div>
</template>

<script>
/* eslint-disable */
/* eslint-disable vue/require-default-prop */
import {
  BTable,
  BButton,
  BFormInput,
  BInputGroup,
  BFormSelect,
  BFormSelectOption,
} from 'bootstrap-vue';
import AddCommentModal from './AddCommentModal.vue';
import AddCommentOnProductModal from './AddCommentOnProductModal.vue';
import ClientInfoComment from './ClientInfoComment.vue';
import StatusSelectField from "./StatusSelectField.vue";
import moment from 'moment';

export default {
  name: 'OrderProducts',
  components: {
    StatusSelectField,
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
  props: {
    order: Object,
    role: String,
    orderId: String,
    addComment: Function,
    updateQuantity: Function,
    assignCallCenterToOrder: Function,
    setOrderProductStatus: Function,
    removeProduct: Function,
    confirmOrder: Function,
    productStatusList: Array,
    cancelOrder: Function,
    finishOrder: Function,
    commitOrder: Function,
    refetchData: Function,
    fetchTransactionInfo: Function,
    showEdit: Array,
    closeOrder: Function,
  },

  data() {
    return {
      allowClose: [
        'CancelledByAvailability',
        'CancelledByCollecting',
        'CancelledByGathering',
        'Returned',
        'Declined',
        'Delivered',
        'PartiallyDelivered',
        'PartiallyReturned',
        'Refunded',
      ],
      disableCancel: [
        'AwaitingPayment',
        'Cancelled',
        'Failed',
        'Refunded',
        'Closed',
        'Delivered',
        'PartiallyDelivered',
      ],
      totalByCash: 0,
      totalByCard: 0,
      commited: '',
      fields: [
        {
          key: 'actions',
          label: '',
          thStyle: {minWidth: '40px'},
          tdClass: 'actionsColumn',
        },
        {
          key: 'productStatus',
          label: this.$i18n.t('global.status'),
          thStyle: {minWidth: '269px'},
          tdClass: 'actionsColumn',
        },
        {key: 'code', label: this.$i18n.t('orders.productId'), thStyle: {minWidth: '100px'}},
        {key: 'comment', label: this.$i18n.t('orders.comment'), thStyle: {minWidth: '250px'}},
        {
          key: 'productTitle',
          label: this.$i18n.t('orders.productTitle'),
          thStyle: {minWidth: '250px'},
        },
        {key: 'quantity-total', label: this.$i18n.t('orders.productAmount')},
        {key: 'quantity', label: this.$i18n.t('orders.amountCorrection')},
        {key: 'unitSaleCost', label: this.$i18n.t('orders.productValue')},
        {key: 'categoryTitle', label: this.$i18n.t('orders.category'), disableForCourier: true},
        {key: 'parentSubCategoryTitle', label: this.$i18n.t('orders.subCategory'), disableForCourier: true},
        {key: 'subCategoryTitle', label: this.$i18n.t('orders.productCategory'), disableForCourier: true},
        {key: 'farmerFullName', label: this.$i18n.t('roles.farmer'), disableForCourier: true},
        {key: 'farmerCode', label: this.$i18n.t('orders.farmerId'), disableForCourier: true},
        {key: 'regionTitle', label: this.$i18n.t('address.region'), disableForCourier: true},
        {key: 'municipalityTitle', label: this.$i18n.t('address.municipality'), disableForCourier: true},
        {key: 'villageTitle', label: this.$i18n.t('address.village'), disableForCourier: true},
        {key: 'address', label: this.$i18n.t('address.address'), thStyle: {minWidth: '250px'}, disableForCourier: true},
        {key: 'consulFullName', label: this.$i18n.t('roles.consul'), disableForCourier: true},
        {key: 'consulCode', label: this.$i18n.t('orders.consulId'), disableForCourier: true},
        {key: 'userPaymentType', label: this.$i18n.t('orders.paymentMethod')},
        {key: 'costByCard', label: this.$i18n.t('orders.paidWithCard'), formatter: (val) => `${val.toFixed(2)} ₾`,},
        {key: 'quantityByCard', label: this.$i18n.t('orders.productsWithCardPayment') },
        {key: 'costByCash', label: this.$i18n.t('orders.paidWithCash'), formatter: (val) => `${val.toFixed(2)} ₾`,},
        {key: 'quantityByCash', label: this.$i18n.t('orders.productsWithCashPayment') },
        {key: 'lastStatusUpdate.user', label: this.$i18n.t('orders.lastUpdateUser'), disableForCourier: true},
        {key: 'lastStatusUpdate', label: this.$i18n.t('orders.lastUpdateDate'), disableForCourier: true},
      ],
      products: [],
      prodForComment: {},
    };
  },
  computed: {
    filteredFields() { 
      if (this.role === 'courier') {
        return this.fields.filter(field => !field.disableForCourier);
      } else {
        return this.fields;
      }
    },
    filteredStatuses() {
      // return this.productStatusList.filter((e)=> e.role.includes(this.role));
      let warehouseCheck = false;
      this.order.products.every((element) => {
        if (
            element.status === 'InWarehouse' ||
            element.status === 'NotInWarehouse'
        ) {
          console.log('this order passes', element);
          warehouseCheck = true;
        }
      });

      const filteredList = this.productStatusList.slice();

      filteredList.forEach((e) => {
        if (!e.role.includes(this.role) || e.value === 'Delivered' || e.value === 'NotDelivered') {
          e.disabled = true;
          // console.log('first', e.value, e.disabled)
        }
        if (warehouseCheck && (e.value === 'Delivered' || e.value === 'NotDelivered')) {
          e.disabled = false;
          // console.log('second', warehouseCheck, e.value)
        }
        // console.log('out', e.title, e.disabled, e.role)
      });
      console.log('filteredList', this.role)
      return filteredList;
    },
  },

  mounted() {
    // console.log('products', this.order.products);
    this.commited = this.order.commited;
    console.log('commited', this.commited);

    this.products = this.order.products;
    this.products.forEach(e=>{
        this.totalByCard += e.costByCard;
        this.totalByCash += e.costByCash;
      })
    console.log('this.order.products', this.products)
  },
  watch: {
    products(newVal) {
      this.assessCommited(newVal);
    },
    order(newVal){
      this.totalByCard = 0;
      this.totalByCash = 0;
      console.log('new order')
      newVal.products.forEach(e=>{
        this.totalByCard += e.costByCard;
        this.totalByCash += e.costByCash;
      })
    }
  },
  filters: {
    formatDate(value) {
      return moment(String(value)).format('HH:mm  MM/DD/YYYY');
    },
  },
  methods: {
    watchSelect(newVal) {
      if (newVal.status === 'NotEnough') {
        this.prodForComment = newVal;
        console.log('prodForComment', this.prodForComment);
        this.$bvModal.show('add-comment-on-product-modal');
      }
      console.log('watch select', newVal)
    },
    assessCommited(data) {
      if (data.length < 2) {
        console.log('one item only');
        return (this.commited = true);
      }
      const uniqueStatuses = new Set();
      data.forEach((e) => {
        uniqueStatuses.add(e.status);
      });
      // console.log('assessCommited',uniqueStatuses, this.order.products);
      if (
          uniqueStatuses.has('Delivered') &&
          uniqueStatuses.has('NotDelivered') &&
          this.order.commited === false
      ) {
        this.commited = false;
      } else {
        this.commited = true;
      }
    },
    cancelButton(orderId) {
      console.log('inbutton', orderId);
      this.$swal({
        title: 'დაწმუნებული ხარ?',
        html: `<p class="mt-2"><span style="font-weight: bold; color: darkred">შეკვეთა</span> დაქენსელდება!</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ, გადაგზავნე!',
        cancelButtonText: 'არა პლზ დაიცა დაიცა 🙏',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // handle confirming order here
          this.cancelOrder(orderId);
        }
      });
    },
    commitButton(orderId) {
      this.$swal({
        title: 'დაწმუნებული ხარ?',
        html: `<p class="mt-2"><span style="font-weight: bold; color: darkred">შეკვეთა</span> დაქომითდება!</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ, გადაგზავნე!',
        cancelButtonText: 'არა პლზ დაიცა დაიცა 🙏',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // handle confirming order here
          this.commitOrder(orderId);
        }
      });
    },

    confirmButton(orderId) {
      if (!this.order._enableEdit) return;
      this.$swal({
        title: 'დაწმუნებული ხარ?',
        html: `<p class="mt-2"><span style="font-weight: bold; color: darkred">შეკვეთა</span> გადაიგზავნება!</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ, გადაგზავნე!',
        cancelButtonText: 'არა პლზ დაიცა დაიცა 🙏',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // handle confirming order here
          this.confirmOrder(orderId);
        }
      });
    },
    removeProductButton(prod) {
      this.$swal({
        title: 'დაწმუნებული ხარ?',
        html: `<p class="mt-2"><span style="font-weight: bold; color: darkred">${prod.productTitle}</span> -  ამოიშლება შეკვეთიდან!</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ, წაშალე!',
        cancelButtonText: 'არა პლზ დატოვე 🙏',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          //handle product remove here
          this.removeProduct(prod);
        }
      });
    },
  },
};
</script>

<style lang="scss">
th {
	min-width: 200px;
	padding: 0.125rem !important;
	text-align: center;
  background: #f6f6f6 !important;
  color: #6e6b7b !important;
}

.actionsColumn {
	padding: 0.125rem !important;
}

.swal-text {
	max-width: 10em;
}
</style>
