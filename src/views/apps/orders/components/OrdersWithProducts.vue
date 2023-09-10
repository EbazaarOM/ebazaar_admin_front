<!-- eslint-disable  -->
<template>
	<b-card no-body class="mb-0 orders-list">
		<AddProductModal
			:role="role"
			:currentOrderId="currentOrderId"
			:addProductToOrder="addProductToOrder"
		/>
		<AssignCourierModal
			v-if="
				role === 'admin' ||
				role === 'callCenterManager' ||
				role === 'logisticsManager'
			"
			:role="role"
			:currentOrderId="currentOrderId"
			:assignCourierToOrder="assignCourierToOrder"
		/>
		<transaction-info-modal :transactionInfo="transactionInfo" />
		<div class="px-1 py-1 orders-title">
			<h5 class="mb-0">
				{{ $t('orders.title') }}
			</h5>
		</div>
		<!-- filters component -->
		<OrderFilters
			:role="role"
			:per-page.sync="perPage"
			:per-page-options="perPageOptions"
			:search-query.sync="searchQuery"
			:product-code-filter.sync="productCodeFilter"
			:payment-method-filter.sync="paymentMethodFilter"
			:refetchData="refetchData"
			:paymentMethodOptions="paymentMethodOptions"
			:status-filter.sync="statusFilter"
			:payze-status-filter.sync="payzeStatusFilter"
			:orderStatusList="orderStatusList"
			:dateFromFilter.sync="dateFromFilter"
			:dateToFilter.sync="dateToFilter"
			:handleSwitch="handleSwitch"
			:priceFrom.sync="priceFrom"
			:priceTo.sync="priceTo"
			:exportToExcel="exportToExcel"
		/>
		<!-- Table Top -->
		<!-- {{ this.currentOrderId }} -->
		<div class="px-sm-1">
			<b-table
				ref="refOrdersListTable"
				bordered
				hover
				responsive
				class="shadow-sm rounded-lg"
				thead-tr-class="order-main-thead"
				:items="fetchOrders"
				:fields="isDeliveryActive ? deliveryDashboardColumns : tableColumns"
				primary-key="id"
				:sort-by.sync="sortBy"
				show-empty
				empty-text="No matching records found"
				:sort-desc.sync="isSortDirDesc"
				selectable
				select-mode="single"
				@row-clicked="handleRowClick"
			>
				<!-- Open deatils button -->
				<template #cell(code)="data">
					<div class="d-flex align-items-center cursor-pointer">
						<feather-icon
							size="18"
							:icon="data.detailsShowing ? 'EyeOffIcon' : 'EyeIcon'"
							class="mr-2"
						/>
						<p class="mb-0">{{ data.item.code }}</p>
					</div>
				</template>

				<!-- Date -->
				<template #cell(createDate)="data">
					{{ data.item.createDate | formatDate }}
				</template>
				<template #cell(dateOfArrival)="data">
					<div class="d-flex align-items-center">
						<b-form-datepicker
							:disabled="
								!showEdit.includes(data.item.orderStatus) || role === 'courier'
							"
							v-model="data.item.dateOfArrival"
							class="ml-1 p-0"
							:date-format-options="{
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
							}"
						/>
						<b-button
							variant="flat-success"
							class="btn-icon"
							:disabled="
								!showEdit.includes(data.item.orderStatus) || role === 'courier'
							"
							@click="setOrderNewDate(data.item)"
						>
							<feather-icon size="20" icon="SaveIcon" />
						</b-button>
					</div>
				</template>
				<template #cell(transactionId)="data" hidden>
					<span v-if="role === 'admin'">
						{{ data.item.transactionId }}
					</span>
				</template>

				<!--  -->
				<template #cell(deliveryCost)="data" hidden>
					<span v-if="role === 'admin'">
						{{ data.item.deliveryCost.toFixed(2) }}
						{{
							data.item.isDeliveryCash ? $t('global.cash') : $t('global.card')
						}}
					</span>
				</template>

				<!--  -->

				<template #cell(clientName)="data">
					<div v-if="data.item.client">
						<span v-if="data.item.client.fullName">{{
							data.item.client.fullName
						}}</span>
						<span v-else>{{ data.item.client.directorFullName }}</span>
					</div>
				</template>
				<!-- Details -->
				<template #row-details="data">
					<OrderProducts
						:key="data.item.id"
						:order="data.item"
						:role="role"
						:orderId="data.item.id"
						:productStatusList="productStatusList"
						:updateQuantity="updateQuantity"
						:removeProduct="removeProduct"
						:assignCallCenterToOrder="assignCallCenterToOrder"
						:setOrderProductStatus="setOrderProductStatus"
						:confirmOrder="confirmOrder"
						:addComment="addComment"
						:commitOrder="commitOrder"
						:cancelOrder="cancelOrder"
						:finishOrder="finishOrder"
						:refetchData="refetchData"
						:fetchTransactionInfo="fetchTransactionInfo"
						:showEdit="showEdit"
						:closeOrder="closeOrder"
					/>
				</template>
			</b-table>
		</div>
		<!-- Paginations -->
		<div class="mx-2 mb-2">
			<b-row>
				<b-col
					cols="12"
					sm="6"
					class="
						d-flex
						align-items-center
						justify-content-center justify-content-sm-start
					"
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
					class="
						d-flex
						align-items-center
						justify-content-center justify-content-sm-end
						pr-sm-4
					"
				>
					<b-pagination
						v-model="currentPage"
						:total-rows="totalOrders"
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
import {
	BCard,
	BRow,
	BCol,
	BTable,
	BPagination,
	BModal,
	BFormDatepicker,
	BButton,
} from 'bootstrap-vue';
import moment from 'moment';
import { onUnmounted } from '@vue/composition-api';
import store from '@/store';
import orderStoreModule from '../orderStoreModule';
import AddProductModal from './AddProductModal.vue';
import AssignCourierModal from './AssignCourierModal.vue';
import OrderFilters from './OrderFilters.vue';
import OrderProducts from './OrderProducts.vue';
import useOrdersList from '../useOrdersList';
import TransactionInfoModal from './TransactionInfoModal.vue';

const FileSaver = require('file-saver');

export default {
	components: {
		BButton,
		BModal,
		OrderFilters,
		AddProductModal,
		AssignCourierModal,
		OrderProducts,
		BCard,
		BRow,
		BCol,
		BTable,
		BPagination,
		TransactionInfoModal,
		BFormDatepicker,
	},
	filters: {
		formatDate(value) {
			return moment(String(value)).format('HH:mm  MM/DD/YYYY');
		},
		formatDay(value) {
			return moment(String(value)).format('MM/DD/YYYY');
		},
	},
	props: {
		toast: Function,
		commitOrder: Function,
		productStatusList: Array,
		role: String,
		setOrderProductStatus: Function,
		confirmOrder: Function,
		currentOrderId: String,
		setCurrentOrderId: Function,
		triggerRefetch: Number,
		setOrderNewDate: Function,
		deliveryDashboardColumns: Array,
		tableColumns: Array,
	},
	watch: {
		triggerRefetch(newVal) {
			this.refetchData();
		},
		ordersList() {
			if (this.currentOrderId) {
				const row = this.ordersList.findIndex(
					(x) => x.id === this.currentOrderId
				);
				const table = this.$refs.refOrdersListTable;
				// eslint-disable-next-line no-underscore-dangle
				if (table._data.localItems[row]) {
					table._data.localItems[row]._showDetails = true;
					// eslint-disable-next-line no-underscore-dangle
					table._data.localItems[row]._enableEdit = true;
				}
			}
		},
	},
	data() {
		return {
			staticEnvValue: '',
			isDeliveryActive: false,
			timer: '',
			transactionInfo: null,
			allowDateChange: false,
			showEdit: [
				'AwaitingFulfillment',
				'Collected',
				'PartiallyCollected',
				'Gathered',
				'Ungathered',
				'Pending',
				'New',
				'Declined',
			],
		};
	},
	mounted() {
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
		this.timer = setInterval(this.refetchData, 60000);
	},
	methods: {
		fetchTransactionInfo(orderId) {
			store
				.dispatch('app-orders/fetchTransactionInfo', orderId)
				.then((response) => {
					this.transactionInfo = response.transaction.response;
				})
				.catch((err) => {
					console.log('error closing order', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა ტრანზაქციის ინფო მოპოვებისას.');
				});
		},
		exportToExcel(dateFrom, dateTo) {
			const payload = {
				dateFrom,
				dateTo,
			};
			console.log('in comp', payload);

			store.dispatch('app-orders/exportToExcel', payload).then((response) => {
				FileSaver.saveAs(response, 'orders' + 's_list.xls');
			});
		},
		handleSwitch() {
			this.isDeliveryActive = !this.isDeliveryActive;
		},
		closeOrder(orderId) {
			store
				.dispatch('app-orders/closeOrder', orderId)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error closing order', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა შეკვეთის დახურვისას.');
				});
		},
		finishOrder(orderId) {
			store
				.dispatch('app-orders/finishOrder', orderId)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error closing order', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა შეკვეთის დასრულებისას.');
				});
		},
		cancelOrder(orderId) {
			console.log(orderId);
			store
				.dispatch('app-orders/cancelOrder', orderId)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error caneling order', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა შეკვეთის ქენსელისას.');
				});
		},
		addComment(order) {
			const data = {
				orderId: order.id,
				comment: order.comment,
			};
			store
				.dispatch('app-orders/addCommentToOrder', data)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error adding comment product', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა კომენტარის დამატებისას');
				});
		},
		removeProduct(prod) {
			const product = {
				prodId: prod.id,
				orderId: this.currentOrderId,
			};
			store
				.dispatch('app-orders/removeProduct', product)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error deleting product', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა პროდუქტის წაშლისას.');
				});
		},
		assignCallCenterToOrder() {
			store
				.dispatch('app-orders/assignCallCenter', this.currentOrderId)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error changing quantity', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა კონსულის მიბმისას.');
				});
		},
		updateQuantity(prod) {
			// alert(prod.quantity)
			const product = {
				orderId: this.currentOrderId,
				prodId: prod.id,
				quantity: prod.quantity,
			};
			store
				.dispatch('app-orders/updateProductQuantity', product)
				.then((response) => {
					this.toast();
					this.refetchData();
				})
				.catch((err) => {
					console.log('error changing quantity', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა პროდუქტის რაოდენობის შეცვლისას.');
				});
		},
		assignCourierToOrder(item) {
			const data = {
				orderId: this.currentOrderId,
				courierId: item.item.id,
			};
			store
				.dispatch('app-orders/assignCourierToOrder', data)
				.then((response) => {
					// close modal here
					this.$bvModal.hide('assign-courier-modal');
					this.toast();
					// refetch data here
					this.refetchData();
				})
				.catch((err) => {
					console.log('error adding courier', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა კურიერის მიმაგრებისას.');
				});
		},
		handleRowClick(item) {
			const row = this.ordersList.findIndex((x) => x.id === item.id);
			const table = this.$refs.refOrdersListTable;

			table._data.localItems.forEach((e) => {
				if (e._showDetails === true && e != item) {
					e._showDetails = false;
				}
			});

			if (this.currentOrderId === item.id) {
				this.setCurrentOrderId('');
			} else {
				this.setCurrentOrderId(item.id);
			}
			table._data.localItems[row]._showDetails =
				!table._data.localItems[row]._showDetails;
		},
		addProductToOrder(data) {
			const product = {
				orderId: this.currentOrderId,
				quantity: data.item.quantity,
				code: data.item.code,
			};
			store
				.dispatch('app-orders/addProduct', product)
				.then((response) => {
					// close modal here
					this.$bvModal.hide('add-product-modal');
					this.toast();

					// refetch here with current data.
					this.refetchData();
				})
				.catch((err) => {
					console.log(
						'error adding product',
						err.response.data.errors[0].value[0]
					);
					if (err.response.data.errors[0].value[0] === 'AlreadyAdded') {
						alert('Product already added');
					} else {
						// eslint-disable-next-line no-alert
						alert('შეცდომა პროდუქტის ჩამატებისას.');
					}
				});
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
			totalOrders,
			fetchOrders,
			refOrdersListTable,
			// tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			ordersList,
			paymentMethodOptions,
			paymentMethodFilter,
			orderStatusList,
			statusFilter,
			dateFromFilter,
			dateToFilter,
			// deliveryDashboardColumns,
			payzeStatusFilter,
			productCodeFilter,
			priceFrom,
			priceTo,
		} = useOrdersList(props);

		return {
			// from composable
			perPage,
			perPageOptions,
			currentPage,
			searchQuery,
			totalOrders,
			fetchOrders,
			refOrdersListTable,
			// tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			ordersList,
			paymentMethodOptions,
			paymentMethodFilter,
			orderStatusList,
			statusFilter,
			dateFromFilter,
			dateToFilter,
			// deliveryDashboardColumns,
			payzeStatusFilter,
			productCodeFilter,
			priceFrom,
			priceTo,
		};
	},
};
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

.b-table-row-selected td {
	cursor: default !important;
	border-top: 2px solid #7367f0;
	font-weight: bolder;
	background: rgb(243, 243, 243) !important;
}

.b-table-details {
	cursor: default !important;
	border-bottom: 2px solid #7367f0;
	transition: all 0.3s ease;
	background: rgb(243, 243, 243) !important;

	th {
		padding: 0.75rem 0.5rem !important;
	}

	tr {
		background: rgb(230, 230, 230);
	}
	td {
		padding: 0.25rem !important;
		@media (min-width: 640px) {
			padding: 0.75rem !important;
		}
	}
}
</style>

// @media (min-width: 640px) {
