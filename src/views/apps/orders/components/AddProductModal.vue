<template>
	<b-modal
		id="add-product-modal"
		scrollable
		:title="$t('orders.insertProduct')"
		:cancel-title="$t('orders.cancelInsertProduct')"
		size="xl"
		cancel-variant="outline-secondary"
	>
		<div class="mr-2 mb-1">
			<label>{{ $t('global.search') }}</label>
			<b-form-input
				v-model="searchQuery"
				:placeholder="$t('orders.searchProductOrCode')"
				style="width: 230px"
			/>
		</div>
		{{ $t('orders.orderId') }} : {{ currentOrderId }}
		<b-table
			:fields="fields"
			:items="products"
			class="table-sm rounded-lg shadow-sm order-table mt-1"
			small
			hover
			responsive
			bordered
			striped
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
				<div class="d-flex align-items-center justify-content-center">
					<b-button
						class="btn-icon d-flex justify-items-center"
						variant="flat-primary"
						:disabled="
							data.item.quantity <= 0 || data.item.quantity === undefined
						"
						@click.prevent="addProductToOrder(data)"
					>
						<feather-icon size="16" icon="PlusSquareIcon" />
					</b-button>
				</div>
			</template>
			<!--  -->
			<!-- Pieces column -->
			<template #cell(pieces)="data">
				<div class="text-nowrap">
					{{ data.item.pieces }} {{ data.item.unit.title }}
				</div>
			</template>
			<template #cell(quantity)="data">
				<div class="d-flex justify-content-between align-items-center">
					<div class="">
						<b-input-group :append="data.item.unitTitle">
							<b-form-input
								v-model="data.item.quantity"
								type="text"
								style="max-width: 75px"
							/>
						</b-input-group>
					</div>
					<div>
						<div v-if="data.item.quantity">
							{{ (data.item.quantity * data.item.unitSaleCost).toFixed(2) }} ₾
						</div>
					</div>
				</div>
			</template>
			<!--  -->
			<template #cell(village)="data">
				<div class="text-nowrap">
					{{ data.item.village }}, {{ data.item.municipaliTy }},
					{{ data.item.region }}
				</div>
			</template>
		</b-table>
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
	</b-modal>
</template>

<script>
/* eslint-disable */
/* eslint-disable vue/require-default-prop */
import {
	BTable,
	BButton,
	BFormInput,
	BInputGroup,
	BModal,
	BPagination,
} from 'bootstrap-vue';
import store from '@/store';
import { onUnmounted } from '@vue/composition-api';
import orderStoreModule from '../orderStoreModule';
import productStoreModule from '../../products/productStoreModule';
import { ref, watch, computed } from '@vue/composition-api';

//
export default {
	name: 'AddProductModal',
	components: {
		BModal,
		BTable,
		BButton,
		BFormInput,
		BInputGroup,
		BPagination,
	},
	props: {
		role: String,
		currentOrderId: String,
		addProductToOrder: Function,
	},

	data() {
		return {
			fields: [
				{
					key: 'actions',
					label: this.$i18n.t('global.actions'),
					tdClass: 'actionsColumn',
					thStyle: { minWidth: '50px' },
				},
				{
					key: 'code',
					label: this.$i18n.t('orders.code'),
					thStyle: { minWidth: 'auto' },
				},
				{
					key: 'id',
					label: this.$i18n.t('orders.productId'),
					thStyle: { minWidth: '100px' },
				},
				{
					key: 'quantity',
					label: this.$i18n.t('orders.productAmount'),
					thStyle: { minWidth: '150px' },
				},
				{ key: 'title', label: this.$i18n.t('orders.productTitle') },
				{
					key: 'stockCount',
					label: this.$i18n.t('products.stock'),
					thStyle: { minWidth: '100px' },
				},
				{ key: 'pieces', label: this.$i18n.t('products.minUnit') },
				{
					key: 'unitSaleCost',
					label: this.$i18n.t('products.unitSaleCost'),
					formatter: (val) => `${val.toFixed(2)} ₾`,
				},
				{ key: 'farmer', label: this.$i18n.t('roles.farmer') },
				{ key: 'consul', label: this.$i18n.t('roles.consul') },
				{ key: 'village', label: this.$i18n.t('address.address') },
			],
			products: [],
			searchQuery: '',
			totalProducts: 0,
			currentPage: 1,
			perPage: 10,
			isSortDirDesc: true,
		};
	},
	// Product Sticker	Specification		Consul's Phone	Last Update time	Last update role
	setup() {
		const Order_APP_STORE_MODULE_NAME = 'app-orders';

		// Register module
		if (!store.hasModule(Order_APP_STORE_MODULE_NAME)) {
			store.registerModule(Order_APP_STORE_MODULE_NAME, orderStoreModule);
		}
		//
		//
		const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

		// Register module
		if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME))
			store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule);
	},
	watch: {
		searchQuery() {
			this.fetchProducts();
			this.currentPage = 1;
		},
		currentPage() {
			this.fetchProducts();
		},
	},

	mounted() {
		this.products = this.order;
	},

	methods: {
		fetchProducts() {
			store
				.dispatch('app-product/fetchProducts', {
					role: this.role,
					searchWord: this.searchQuery,
					perPage: this.perPage,
					page: this.currentPage,
					take: this.perPage,
					skip: (this.currentPage - 1) * this.perPage,
					sortBy: 'id',
					sortDesc: true,
					published: true,
					noDates: true,
				})
				.then((response) => {
					const products = response.data;
					// console.log('products', products);

					const total = response.meta ? response.meta.total : 0;
					this.totalProducts = total;
					this.products = products;
					console.log(this.products);
				})
				.catch((e) => {
					alert(e);
					toast({
						component: ToastificationContent,
						props: {
							title: 'Error fetching products list',
							icon: 'AlertTriangleIcon',
							variant: 'danger',
						},
					});
				});
		},
	},
};
</script>

<style></style>
