/* eslint-disable */
import { ref, watch, computed } from '@vue/composition-api';
import store from '@/store';
// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default function useOrdersList(props) {
	// Use toast
	const toast = useToast();

	const refOrdersListTable = ref(null);

	// Table Handlers
	const tableColumns = [
		{
			key: 'code',
			label: 'შეკვეთის კოდი',
			thStyle: { minWidth: '100px' },
		},
		{ key: 'createDate', label: 'შეკვეთის დრო' },
		{ key: 'orderStatus', label: 'სტატუსი' },
		{ key: 'callCenterFullName', label: 'ქოლ ცენტრი' },
		{ key: 'clientName', label: 'მყიდველის სახელი' },
		{ key: 'client.phoneNumber', label: 'მყიდველის ტელეფონი' },
		// { key: 'client.address', label: 'მყიდველის მისამართი' },
		{ key: 'paymentType', label: 'გადახდის მეთოდი' },
		{ key: 'payzeStatus', label: 'ფეიზი სტატუსი' },
		{
			key: 'totalCost',
			label: 'შეკვეთის ღირებულება',
			formatter: (value, key, item) =>
				`${(item.deliveryCost + item.totalCost).toFixed(2)} ₾`,
		},
		{ key: 'dateOfArrival', label: 'მიტანის დრო', thStyle: {minWidth: '300px'}},
		{
			key: 'deliveryCost',
			label: 'მიტანის თანხა',
		},
	];
	if(localStorage.getItem('role') === 'admin'){
		tableColumns.push({ key: 'transactionId', label: 'ტრანზაქციის კოდი' },
		)
	};
	const deliveryDashboardColumns = [
		{
			key: 'code',
			label: 'შეკვეთის კოდი',
			thStyle: { minWidth: '100px' },
		},
		{ key: 'orderStatus', label: 'სტატუსი' },
		{ key: 'clientName', label: 'მყიდველის სახელი' },
		{ key: 'client.address', label: 'მყიდველის მისამართი' },
		{ key: 'AssignToCourierDate', label: 'მიესაინების დრო' },
		{ key: 'courierFullName', label: 'კურიერის სახელი' },
		{ key: 'DeliveryDate', label: 'ჩაბარების დრო' },
	];

	const perPage = ref(15);
	const totalOrders = ref(0);
	const currentPage = ref(1);
	const perPageOptions = [15, 25, 50, 100];
	const paymentMethodOptions = ['Cash', 'Partial', 'Card'];
	const searchQuery = ref('');
	const sortBy = ref('id');
	const isSortDirDesc = ref(true);
	const statusFilter = ref([]);
	const ordersList = ref(null);
	const paymentMethodFilter = ref(null);
	const dateFromFilter = ref(null);
	const dateToFilter = ref(null);
	const payzeStatusFilter = ref([]);
	const productCodeFilter = ref('');
	const priceFrom = ref(null);
	const priceTo = ref(null);

	const dataMeta = computed(() => {
		const localItemsCount = refOrdersListTable.value
			? refOrdersListTable.value.localItems.length
			: 0;
		return {
			from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
			to: perPage.value * (currentPage.value - 1) + localItemsCount,
			of: totalOrders.value,
		};
	});

	const refetchData = () => {
		refOrdersListTable.value.refresh();
	};

	watch(
		[
			currentPage,
			perPage,
			searchQuery,
			paymentMethodFilter,
			statusFilter,
			dateToFilter,
			dateFromFilter,
			payzeStatusFilter,
			productCodeFilter,
			priceFrom,
			priceTo,
		],
		() => {
			if (dateFromFilter.value == null) dateFromFilter.value = '';
			if (dateToFilter.value == null) dateToFilter.value = '';
			if (statusFilter.value == null) statusFilter.value = '';
			if (payzeStatusFilter.value == null) payzeStatusFilter.value = '';
			if (paymentMethodFilter.value == null) paymentMethodFilter.value = '';
			refetchData();
		}
	);

	const fetchOrders = (ctx, callback) => {
		store
			.dispatch('app-orders/fetchOrders', {
				role: localStorage.getItem('role'),
				searchWord: searchQuery.value,
				perPage: perPage.value,
				page: currentPage.value,
				take: perPage.value,
				skip: (currentPage.value - 1) * perPage.value,
				sortBy: sortBy.value,
				sortDesc: isSortDirDesc.value,
				paymentType: paymentMethodFilter.value,
				statusList: statusFilter.value,
				payzeList: payzeStatusFilter.value,
				createDateFrom: dateFromFilter.value,
				createDateTo: dateToFilter.value,
				product_code: productCodeFilter.value,
				priceFrom: priceFrom.value,
				priceTo: priceTo.value,
				//order filters
			})
			.then((response) => {
				const orders = response.data;
				let created;
				let thirtyMinutes = 1000 * 30 * 60;
				orders.forEach((e) => {
					e._showDetails = false;
					e._enableEdit = false;
					if(e.orderStatus === 'New'){
						e._disabled = true;
						created = new Date(e.createDate).getTime();
						e._rowVariant =  (new Date().getTime() - created < thirtyMinutes)? '' : 'danger';
					}
				});
				console.log('orders', orders);
				const total = response.meta ? response.meta.total : 0;
				totalOrders.value = total;
				ordersList.value = response.data;
				callback(orders);
			})
			.catch((e) => {
				alert(e);
				toast({
					component: ToastificationContent,
					props: {
						title: 'Error fetching Orders list',
						icon: 'AlertTriangleIcon',
						variant: 'danger',
					},
				});
			});
	};

	// *===============================================---*
	// *--------- UI ---------------------------------------*
	// *===============================================---*
	return {
		fetchOrders,
		tableColumns,
		perPage,
		currentPage,
		totalOrders,
		dataMeta,
		perPageOptions,
		paymentMethodOptions,
		searchQuery,
		sortBy,
		isSortDirDesc,
		refOrdersListTable,
		refetchData,
		ordersList,
		paymentMethodFilter,
		statusFilter,
		dateFromFilter,
		dateToFilter,
		deliveryDashboardColumns,
		payzeStatusFilter,
		productCodeFilter,
		priceFrom,
		priceTo,
	};
}
