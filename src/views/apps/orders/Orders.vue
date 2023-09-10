<!-- eslint-disable  -->
<template>
	<div>
		<HorizontalNavbar />

		<OrdersWithProducts
			v-if="
				role === 'admin' ||
				role === 'callCenterManager' ||
				role === 'courier' ||
				role === 'logisticsManager'
			"
			:productStatusList="productStatusList"
			:role="role"
			:confirmOrder="confirmOrder"
			:setOrderProductStatus="setOrderProductStatus"
			:setCurrentOrderId="setCurrentOrderId"
			:currentOrderId="currentOrderId"
			:triggerRefetch="triggerRefetch"
			:commitOrder="commitOrder"
			:toast="toast"
			:deliveryDashboardColumns="deliveryDashboardColumns"
			:tableColumns="tableColumns"
			:setOrderNewDate="setOrderNewDate"
		/>

		<OrderProductsList
			v-if="role === 'farmer' || role === 'consul'"
			:role="role"
			:productStatusList="productStatusList"
			:confirmOrder="confirmOrder"
			:triggerRefetch="triggerRefetch"
			:farmerColumns="farmerColumns"
			:tableColumns="tableColumns"
			:consulColumns="consulColumns"
			:setOrderProductStatus="setOrderProductStatus"
			:toast="toast"
		/>
	</div>
</template>

<script>
/* eslint-disable */
import { onUnmounted } from '@vue/composition-api';
import store from '@/store';
import orderStoreModule from './orderStoreModule';
import HorizontalNavbar from '../../navbar/HorizontalNavbar.vue';
import OrdersWithProducts from './components/OrdersWithProducts.vue';
import OrderProductsList from './components/OrderProductsList.vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
	components: {
		OrdersWithProducts,
		HorizontalNavbar,
		OrderProductsList,
	},

	data() {
		return {
			staticEnvValue: '',
			role: '',
			currentOrderId: '',
			triggerRefetch: 0,
			// filters
			productStatusList: [
				{
					value: 'NotSet',
					title: this.$i18n.t('productStatusList.new'),
					disabled: true,
					role: ['admin', 'farmer', 'consul', 'callCenterManager'],
				},
				{
					value: 'Available',
					title: this.$i18n.t('productStatusList.availableProduct'),
					disabled: false,
					role: ['admin', 'farmer', 'consul', 'callCenterManager'],
				},
				{
					value: 'Unavailable',
					title: this.$i18n.t('productStatusList.unavailableProduct'),
					disabled: false,
					role: ['admin', 'farmer', 'consul', 'callCenterManager'],
				},
				{
					value: 'NotEnough',
					disabled: false,
					title: this.$i18n.t('productStatusList.incompleteStock'),
					role: ['admin', 'farmer', 'consul', 'callCenterManager'],
				},
				{
					value: 'PickedUp',
					disabled: false,
					title: this.$i18n.t('productStatusList.pickedUp'),
					role: ['admin', 'consul', 'callCenterManager'],
				},
				{
					value: 'NotHaving',
					disabled: false,
					title: this.$i18n.t('productStatusList.notPickedUp'),
					role: ['admin', 'consul', 'callCenterManager'],
				},
				{
					value: 'InWarehouse',
					disabled: false,
					title: this.$i18n.t('productStatusList.inWarehouse'),
					role: ['admin', 'logisticsManager'],
				},
				{
					value: 'NotInWarehouse',
					disabled: false,
					title: this.$i18n.t('productStatusList.notInWarehouse'),
					role: ['admin', 'logisticsManager'],
				},
				{
					value: 'Delivered',
					disabled: false,
					title: this.$i18n.t('productStatusList.delivered'),
					role: ['admin', 'courier'],
				},
				{
					value: 'NotDelivered',
					title: this.$i18n.t('productStatusList.notDelivered'),
					disabled: false,
					role: ['admin', 'courier'],
				},
				{
					value: 'Refunded',
					disabled: false,
					title: this.$i18n.t('productStatusList.refunded'),
					role: ['admin', 'callCenterManager'],
				},
				{
					value: 'Cancelled',
					title: this.$i18n.t('productStatusList.cancelled'),
					disabled: true,
					role: [],
				},
			],
			deliveryDashboardColumns: [
				{
					key: 'code',
					label: this.$i18n.t('orders.orderId'),
					thStyle: { minWidth: '100px' },
				},
				{ key: 'orderStatus', label: this.$i18n.t('orders.orderStatus') },
				{ key: 'clientName', label: this.$i18n.t('orders.buyerName') },
				{ key: 'client.address', label: this.$i18n.t('orders.buyerAddress') },
				{
					key: 'AssignToCourierDate',
					label: this.$i18n.t('orders.assignCourierTime'),
				},
				{ key: 'courierFullName', label: this.$i18n.t('orders.courierName') },
				{ key: 'DeliveryDate', label: this.$i18n.t('orders.deliveryDate') },
			],
			tableColumns: [
				{
					key: 'code',
					label: this.$i18n.t('orders.orderId'),
					thStyle: { minWidth: '100px' },
				},
				{ key: 'createDate', label: this.$i18n.t('orders.orderCreateDate') },
				{ key: 'orderStatus', label: this.$i18n.t('orders.orderStatus') },
				{
					key: 'callCenterFullName',
					label: this.$i18n.t('orders.orderManager'),
				},
				{ key: 'clientName', label: this.$i18n.t('orders.buyerName') },
				{ key: 'client.phoneNumber', label: this.$i18n.t('orders.buyerPhone') },
				// { key: 'client.address', label: 'მყიდველის მისამართი' },
				{ key: 'paymentType', label: this.$i18n.t('orders.paymentMethod') },
				{ key: 'payzeStatus', label: this.$i18n.t('orders.payzeStatus') },
				{
					key: 'totalCost',
					label: this.$i18n.t('orders.orderValue'),
					formatter: (value, key, item) =>
						`${(item.deliveryCost + item.totalCost).toFixed(2)} ₾`,
				},
				{
					key: 'dateOfArrival',
					label: this.$i18n.t('orders.deliveryDate'),
					thStyle: { minWidth: '300px' },
				},
				{
					key: 'deliveryCost',
					label: this.$i18n.t('orders.deliveryCost'),
				},
			],
			farmerColumns: [
				{ key: 'orderCode', label: this.$i18n.t('orders.orderId') },
				{ key: 'createDate', label: this.$i18n.t('orders.orderCreateDate') },
				{ key: 'orderStatus', label: this.$i18n.t('orders.orderStatus') },
				{
					key: 'productStatus',
					label: this.$i18n.t('orders.productStatus'),
					thStyle: { minWidth: '269px' },
					tdClass: 'actionsColumn',
				},
				{ key: 'comment', label: this.$i18n.t('orders.orderComment') },
				{
					key: 'productTitle',
					label: this.$i18n.t('orders.productTitle'),
					thStyle: { minWidth: '250px' },
				},
				{
					key: 'quantity',
					label: this.$i18n.t('statistics.quantity'),
					thStyle: { minWidth: '150px' },
				},
				{
					key: 'subCategoryTitle',
					label: this.$i18n.t('category.productCategory'),
				},
				{
					key: 'unitOriginalRealCost',
					label: this.$i18n.t('products.farmerPrice'),
				},
				{ key: 'stickers', label: this.$i18n.t('sticker.title') },
				{
					key: 'specifications',
					label: this.$i18n.t('category.specifications'),
					thStyle: { minWidth: '300px' },
				},
				{ key: 'code', label: this.$i18n.t('statistics.productCode') },
				{ key: 'buyerFullName', label: this.$i18n.t('orders.buyerName') },
			],
			consulColumns: [
				{ key: 'orderCode', label: this.$i18n.t('orders.orderId') },
				{ key: 'createDate', label: this.$i18n.t('orders.orderCreateDate') },
				{ key: 'orderStatus', label: this.$i18n.t('orders.orderStatus') },
				{
					key: 'productStatus',
					label: this.$i18n.t('orders.productStatus'),
					thStyle: { minWidth: '269px' },
					tdClass: 'actionsColumn',
				},
				{ key: 'comment', label: this.$i18n.t('orders.orderComment') },
				{
					key: 'productTitle',
					label: this.$i18n.t('orders.productTitle'),
					thStyle: { minWidth: '250px' },
				},
				{
					key: 'quantity',
					label: this.$i18n.t('statistics.quantity'),
					thStyle: { minWidth: '150px' },
				},
				{ key: 'farmerFullName', label: this.$i18n.t('orders.farmerFullName') },
				{
					key: 'farmerPhoneNumber',
					label: this.$i18n.t('orders.farmerPhoneNumber'),
				},
				{
					key: 'subCategoryTitle',
					label: this.$i18n.t('category.productCategory'),
				},
				{
					key: 'unitOriginalRealCost',
					label: this.$i18n.t('products.farmerPrice'),
				},

				{ key: 'stickers', label: this.$i18n.t('sticker.title') },
				{
					key: 'specifications',
					label: this.$i18n.t('category.specifications'),
				},
				{ key: 'sale', label: this.$i18n.t('global.sale') },
				{ key: 'address', label: this.$i18n.t('orders.farmerAddress') },
				{ key: 'code', label: this.$i18n.t('statistics.productCode') },
				{ key: 'buyerFullName', label: this.$i18n.t('orders.buyerName') },
				{ key: 'unitSaleCost', label: this.$i18n.t('products.unitSaleCost') },
			],
		};
	},

	mounted() {
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
		this.role = localStorage.getItem('role');
		// eslint-disable-next-line no-console
		console.log('My role is ', this.role);
	},

	methods: {
		toast(
			title,
			toaster = 'b-toaster-bottom-right',
			append = false,
			variant = 'success'
		) {
			this.$toast({
				component: ToastificationContent,
				props: {
					title: 'წარმატებით განახლდა',
					icon: 'EditIcon',
					variant: 'success',
				},
			});
		},

		setCurrentOrderId(id) {
			this.currentOrderId = id;
		},
		confirmOrder() {
			store
				.dispatch('app-orders/confirmOrder', this.currentOrderId)
				.then((response) => {
					this.toast();
					this.triggerRefetch++;
				})
				.catch((err) => {
					console.log('error confirming product', err.response);
					alert('შეცდომა პროდუქტის დაკონფირმებისას.');
				});
		},
		commitOrder(orderId) {
			store
				.dispatch('app-orders/commitOrder', orderId)
				.then(() => {
					this.toast();
					this.triggerRefetch++;
				})
				.catch((err) => {
					console.log('error commiting product', err.response);
					alert('შეცდომა პროდუქტის დაქომითებისას.');
				});
		},
		setOrderProductStatus(prod) {
			const product = {
				orderId: prod.orderId,
				prodId: prod.id,
				status: prod.status,
				comment: '',
			};
			store
				.dispatch('app-orders/setOrderProductStatus', product)
				.then(() => {
					// eslint-disable-next-line no-plusplus
					this.toast();
					this.triggerRefetch++;
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('error changing status', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა პროდუქტის სტატუსის შეცვლისას.');
				});
		},
		setOrderNewDate(order) {
			const utcDate = new Date(order.dateOfArrival).toISOString();
			const toSend = {
				orderId: order.id,
				date: utcDate,
			};
			console.log(toSend);
			store
				.dispatch('app-orders/setOrderNewDate', toSend)
				.then((response) => {
					this.toast();
					this.triggerRefetch++;
				})
				.catch((err) => {
					console.log('error confirming product', err.response);
					alert('შეცდომა თარიღის შეცვლისას.');
				});
		},
	},
	setup() {
		const Order_APP_STORE_MODULE_NAME = 'app-orders';

		// Register module
		if (!store.hasModule(Order_APP_STORE_MODULE_NAME)) {
			store.registerModule(Order_APP_STORE_MODULE_NAME, orderStoreModule);
		}

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(Order_APP_STORE_MODULE_NAME)) {
				store.unregisterModule(Order_APP_STORE_MODULE_NAME);
			}
		});
	},
};
</script>

<style>
@media (max-width: 640px) {
	html[dir] .navbar-hidden .app-content {
		padding: 0.25rem !important;
	}
}
</style>
