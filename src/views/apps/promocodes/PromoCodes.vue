<template>
	<div>
		<HorizontalNavbar />
		<b-card no-body class="mb-0">
			<div class="px-1 py-1 promo-title">
				<h5 class="mb-0">
					{{ $t('navigation.promoCodes') }}
				</h5>
			</div>
			<!-- create new -->
			<AddPromoCode
				:users-list="usersList"
				:toast-notification="toast"
				:refetch-data="refetchData"
			/>
			<!-- list -->
			<PromoCodesList
				:toast-notification="toast"
				:update-list-data="updateListData"
			/>
		</b-card>
	</div>
</template>

<script>
// /* eslint-disable  */
import { onUnmounted } from '@vue/composition-api';
import { BCard } from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import store from '@/store';
import promoStoreModule from './promoStoreModule';

// components
import HorizontalNavbar from '../../navbar/HorizontalNavbar.vue';
import PromoCodesList from './components/PromoCodesList.vue';
import AddPromoCode from './components/AddPromoCode.vue';

export default {
	name: 'Statistics',

	components: {
		HorizontalNavbar,
		BCard,
		AddPromoCode,
		PromoCodesList,
	},
	data() {
		return {
			updateListData: 0,
			usersList: [],
		};
	},
	mounted() {
		this.fetchPromoCodes();
		this.fetchUsers();
	},
	methods: {
		refetchData() {
			this.updateListData += 1;
		},
		fetchPromoCodes() {
			store.dispatch('app-promo/fetchPromoCodes').then((response) => {
				// eslint-disable-next-line no-console
				console.log('promo codes', response);
			});
		},
		fetchUsers() {
			store.dispatch('app-promo/fetchUsers').then((response) => {
				this.usersList = response.data.map((e) => ({
					title: `${e.firstName} ${e.lastName} - ${e.uniqueCode}`,
					value: e.id,
				}));
			});
		},
		toast(message, variant, icon) {
			this.$toast({
				component: ToastificationContent,
				props: {
					title: message,
					icon,
					variant,
				},
			});
		},
	},
	setup() {
		const STATS_APP_STORE_MODULE_NAME = 'app-promo';

		// Register module
		if (!store.hasModule(STATS_APP_STORE_MODULE_NAME)) {
			store.registerModule(STATS_APP_STORE_MODULE_NAME, promoStoreModule);
		}

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(STATS_APP_STORE_MODULE_NAME)) {
				store.unregisterModule(STATS_APP_STORE_MODULE_NAME);
			}
		});
	},
};
</script>

<style lang="scss">
.promo-title {
	background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
	border-top-left-radius: 0.428rem;
	border-top-right-radius: 0.428rem;

	h5 {
		color: white;
	}
}
</style>
