/* eslint-disable */
import { ref, watch, computed } from '@vue/composition-api';
import store from '@/store';
// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default function useProductsList(props) {
	// Use toast
	const toast = useToast();

	const refProductsListTable = ref(null);

	// Table Handlers
	const tableColumns = [
		{ key: 'orderCode', label: 'შეკვეთის კოდი' },
		{ key: 'createDate', label: 'შეკვეთის დრო' },
		{ key: 'orderStatus', label: 'ორდერის სტატუსი' },
		{
			key: 'productStatus',
			label: 'პროდუქტის სტატუსი',
			thStyle: { minWidth: '269px' },
			tdClass: 'actionsColumn',
		},
		{ key: 'comment', label: 'კომენტარი' },
		{
			key: 'productTitle',
			label: 'პროდუქტის დასახელება',
			thStyle: { minWidth: '250px' },
		},
		{ key: 'quantity', label: 'რაოდენობა', thStyle: { minWidth: '150px' } },
		{ key: 'farmerFullName', label: 'ფერმერის სახელი' },
		{ key: 'farmerPhoneNumber', label: 'ფერმერის ტელეფონის ნომერი' },
		{ key: 'subCategoryTitle', label: 'პროდუქტის კატეგორია' },
		{ key: 'unitOriginalRealCost', label: 'ფერმერის ფასი' },

		{ key: 'stickers', label: 'სტიკერები' },
		{ key: 'specifications', label: 'სპეციფიკაციები'},
		{ key: 'sale', label: 'სეილი' },
		{ key: 'address', label: 'ფერმერის მისამართი' },
		{ key: 'code', label: 'პროდუქტის კოდი' },
		{ key: 'buyerFullName', label: 'მყიდველის სახელი და გვარი' },
		{ key: 'unitSaleCost', label: 'გასაყიდი ფასი' },
	];

	const farmerColumns = [
		{ key: 'orderCode', label: 'შეკვეთის კოდი' },
		{ key: 'createDate', label: 'შეკვეთის დრო' },
		{ key: 'orderStatus', label: 'ორდერის სტატუსი' },
		{
			key: 'productStatus',
			label: 'პროდუქტის სტატუსი',
			thStyle: { minWidth: '269px' },
			tdClass: 'actionsColumn',
		},
		{ key: 'comment', label: 'კომენტარი' },
		{
			key: 'productTitle',
			label: 'პროდუქტის დასახელება',
			thStyle: { minWidth: '250px' },
		},
		{ key: 'quantity', label: 'რაოდენობა', thStyle: { minWidth: '150px' } },
		{ key: 'subCategoryTitle', label: 'პროდუქტის კატეგორია' },
		{ key: 'unitOriginalRealCost', label: 'ფერმერის ფასი' },
		{ key: 'stickers', label: 'სტიკერები',  },
		{ key: 'specifications', label: 'სპეციფიკაციები', thStyle: { minWidth: '300px' }  },
		{ key: 'code', label: 'პროდუქტის კოდი' },
		{ key: 'buyerFullName', label: 'მყიდველის სახელი და გვარი' },
	];
	const perPage = ref(15);
	const totalProducts = ref(0);
	const currentPage = ref(1);
	const perPageOptions = [15, 25, 50, 100];
	const searchQuery = ref('');
	const sortBy = ref('id');
	const isSortDirDesc = ref(true);
	const productsList = ref(null);
	const statusFilter = ref("");

	const dataMeta = computed(() => {
		const localItemsCount = refProductsListTable.value
			? refProductsListTable.value.localItems.length
			: 0;
		return {
			from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
			to: perPage.value * (currentPage.value - 1) + localItemsCount,
			of: totalProducts.value,
		};
	});

	const refetchData = () => {
		refProductsListTable.value.refresh();
	};

	watch([currentPage, perPage, searchQuery, statusFilter], () => {
		if (statusFilter.value == null) statusFilter.value = '';
		refetchData();
	});

	const fetchProducts = (ctx, callback) => {
		store
			.dispatch('app-orders/fetchProducts', {
				role: localStorage.getItem('role'),
				searchWord: searchQuery.value,
				perPage: perPage.value,
				page: currentPage.value,
				take: perPage.value,
				skip: (currentPage.value - 1) * perPage.value,
				sortBy: sortBy.value,
				status: statusFilter.value,
				sortDesc: isSortDirDesc.value,
				// order filters
			})
			.then((response) => {
				const products = response.data;
				let created;
				let thirtyMinutes = 1000 * 30 * 60;
				products.forEach((e) => {
					e._enableEdit = false;
					if(e.orderStatus === 'New'){
						created = new Date(e.orderCreateDate).getTime();
						e._disabled = true;
						if(new Date().getTime() - created < thirtyMinutes){
							e._rowVariant = ''	
						} else{
							e._rowVariant = 'danger'
						}
					}
				});
				const total = response.meta ? response.meta.total : 0;
				totalProducts.value = total;
				productsList.value = response.data;
				console.log(products);
				callback(products);
			})
			.catch((e) => {
				alert(e);
				toast({
					component: ToastificationContent,
					props: {
						title: 'Error fetching Products list',
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
		fetchProducts,
		productsList,
		tableColumns,
		perPage,
		currentPage,
		totalProducts,
		dataMeta,
		perPageOptions,
		searchQuery,
		sortBy,
		isSortDirDesc,
		refetchData,
		refProductsListTable,
		farmerColumns,
		statusFilter,
	};
}
