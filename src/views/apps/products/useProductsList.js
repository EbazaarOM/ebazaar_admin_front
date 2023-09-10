/* eslint-disable */
import { ref, watch, computed } from '@vue/composition-api';
import store from '@/store';

// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default function useProductsList() {
	// Use toast
	const toast = useToast();

	const refProductListTable = ref(null);

	// Table Handlers
	const tableColumns = [
		{
			key: 'actions',
			label: 'ქმედება',
			tdClass: 'actionsColumn',
		},
		{ key: 'code', label: 'კოდი', thStyle: { minWidth: '100px' } },
		{ key: 'title', label: 'დასახელება' },
		{ key: 'stockCount', label: 'მარაგი' },
		{ key: 'pieces', label: 'მინიმალური ერთეული' },
		{
			key: 'unitSaleCost',
			label: 'ღირებულება',
		},
		{ key: 'subCategory.categoryTitle', label: 'კატეგორია' },
		{
			key: 'subCategory.parentSubCategoryTitle',
			label: 'II კატეგორია',
		},
		{ key: 'subCategory.title', label: 'III კატეგორია' },
		{ key: 'farmer', label: 'ფერმერი' },
		{ key: 'consul', label: 'კონსული' },
		{ key: 'village', label: 'სოფელი' },
		{ key: 'municipality', label: 'მუნიციპალიტეტი' },
		{ key: 'region', label: 'რეგიონი' },
		{ key: 'published', label: 'გამოქვეყნებული' },
		{ key: 'stickers', label: 'სტიკერები', formatter: 'assignStickers' },
		{ key: 'createDate', label: 'დამატების თარიღი' },
	];
	const perPage = ref(15);
	const totalProducts = ref(0);
	const currentPage = ref(1);
	const perPageOptions = [10, 25, 50, 100];
	const searchQuery = ref('');
	const sortBy = ref('id');
	const isSortDirDesc = ref(true);
	const roleFilter = ref(null);
	const planFilter = ref(null);
	const statusFilter = ref(null);
	const prodList = ref([]);
	const product_id = ref();
	const farmerFilter = ref('');
	const consulFilter = ref('');
	const categoryFilter = ref('');
	const subCategoryFilter = ref('');
	const subCategoryChildrenFilter = ref('');
	const publishedFilter = ref(null);
	const onSaleFilter = ref(null);
	const stickersFilter = ref();
	const dateFromFilter = ref(null);
	const dateToFilter = ref(null);
	const priceToFilter = ref(null);
	const priceFromFilter = ref(null);

	const dataMeta = computed(() => {
		const localItemsCount = refProductListTable.value
			? refProductListTable.value.localItems.length
			: 0;
		return {
			from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
			to: perPage.value * (currentPage.value - 1) + localItemsCount,
			of: totalProducts.value,
		};
	});

	const refetchData = () => {
		refProductListTable.value.refresh();
	};

	watch(
		[
			currentPage,
			perPage,
			searchQuery,
			roleFilter,
			planFilter,
			statusFilter,
			product_id,
			farmerFilter,
			consulFilter,
			categoryFilter,
			subCategoryFilter,
			subCategoryChildrenFilter,
			publishedFilter,
			onSaleFilter,
			stickersFilter,
			dateFromFilter,
			dateToFilter,
			priceFromFilter,
			priceToFilter,
		],
		() => {
			if (dateFromFilter.value == null) dateFromFilter.value = '';
			if (dateToFilter.value == null) dateToFilter.value = '';
			if (consulFilter.value == null) consulFilter.value = '';
			if (farmerFilter.value == null) farmerFilter.value = '';
			if (categoryFilter.value == null) categoryFilter.value = '';
			if (subCategoryFilter.value == null) subCategoryFilter.value = '';
			if (subCategoryChildrenFilter.value == null) subCategoryChildrenFilter.value = '';
			refetchData();
		}
	);

	const fetchProducts = (ctx, callback) => {
		store
			.dispatch('app-product/fetchProducts', {
				role: localStorage.getItem('role'),
				searchWord: searchQuery.value,
				perPage: perPage.value,
				page: currentPage.value,
				take: perPage.value,
				skip: (currentPage.value - 1) * perPage.value,
				sortBy: sortBy.value,
				sortDesc: isSortDirDesc.value,
				// product filters
				product_id: product_id.value,
				farmer_id: farmerFilter.value.id,
				consul_id: consulFilter.value.id,
				categoryId: categoryFilter.value.id,
				published: publishedFilter.value,
				withSale: onSaleFilter.value,
				stickerIds: stickersFilter.value,
				createDateFrom: dateFromFilter.value,
				createDateTo: dateToFilter.value,
				costFrom: priceFromFilter.value,
				costTo: priceToFilter.value,
				subCategoryId: subCategoryChildrenFilter.value.id
					? subCategoryChildrenFilter.value.id
					: subCategoryFilter.value.id,
			})
			.then((response) => {
				const products = response.data;
				console.log('products', products);
				// sorting stickers here;
				products.forEach((e) => {
					e.stickers.sort((a, b) => {
						if (a.id < b.id) return -1;
						if (a.id > b.id) return 1;
						return 0;
					});
				});
				const total = response.meta ? response.meta.total : 0;
				totalProducts.value = total;
				callback(products);
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
	};

	// *===============================================---*
	// *--------- UI ---------------------------------------*
	// *===============================================---*
	return {
		fetchProducts,
		tableColumns,
		perPage,
		currentPage,
		totalProducts,
		dataMeta,
		perPageOptions,
		searchQuery,
		sortBy,
		isSortDirDesc,
		refProductListTable,
		refetchData,
		// fetchRegions,

		// Extra Filters
		roleFilter,
		planFilter,
		prodList,
		statusFilter,
		//
		product_id,
		consulFilter,
		farmerFilter,
		categoryFilter,
		subCategoryFilter,
		subCategoryChildrenFilter,
		publishedFilter,
		onSaleFilter,
		stickersFilter,
		dateFromFilter,
		dateToFilter,
		priceFromFilter,
		priceToFilter,
	};
}
