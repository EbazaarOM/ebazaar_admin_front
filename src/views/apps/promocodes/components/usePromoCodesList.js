// /* eslint-disable */
import { ref, watch, computed } from '@vue/composition-api';
// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import store from '@/store';

export default function usePromoCodesList() {
	// Use toast
	const toast = useToast();

	const refPromoCodesTable = ref(null);

	const perPage = ref(15);
	const totalPromoCodes = ref(0);
	const currentPage = ref(1);
	const perPageOptions = [15, 25, 50, 100];
	const searchQuery = ref('');
	const sortBy = ref('id');
	const isSortDirDesc = ref(true);
	const promoCodesList = ref(null);

	const dataMeta = computed(() => {
		const localItemsCount = refPromoCodesTable.value
			? refPromoCodesTable.value.localItems.length
			: 0;
		return {
			from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
			to: perPage.value * (currentPage.value - 1) + localItemsCount,
			of: totalPromoCodes.value,
		};
	});

	const refetchData = () => {
		refPromoCodesTable.value.refresh();
	};

	watch([currentPage, perPage, searchQuery], () => {
		refetchData();
	});

	const fetchPromoCodes = (ctx, callback) => {
		store
			.dispatch('app-promo/fetchPromoCodes', {
				searchWord: searchQuery.value,
				perPage: perPage.value,
				page: currentPage.value,
				take: perPage.value,
				skip: (currentPage.value - 1) * perPage.value,
				sortBy: sortBy.value,
				sortDesc: isSortDirDesc.value,
			})
			.then((response) => {
				const promoCodes = response.data;
				const total = response.meta ? response.meta.total : 0;
				totalPromoCodes.value = total;
				promoCodesList.value = response.data;
				callback(promoCodes);
			})
			.catch(() => {
				toast({
					component: ToastificationContent,
					props: {
						title: 'Error fetching promocodes list',
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
		fetchPromoCodes,
		perPage,
		currentPage,
		totalPromoCodes,
		dataMeta,
		perPageOptions,
		searchQuery,
		sortBy,
		isSortDirDesc,
		refPromoCodesTable,
		refetchData,
		promoCodesList,
	};
}
