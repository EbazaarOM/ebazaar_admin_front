<template>
	<div>
		<HorizontalNavbar :arrow-visible="true" @go-back="goBack" />
		<b-card no-body class="mb-0">
			<div class="px-1 py-1 promo-title">
				<h5 class="mb-0">
					{{ $t('navigation.promoCodes') }}
				</h5>
			</div>
			<!-- create new -->
			<div class="border-bottom">
				<div class="d-flex flex-wrap p-1 p-md-2">
					<div class="w-50">
						<div class="d-flex justify-content-between mb-1">
							<div class="w-50">
								<label>{{ $t('promos.title') }}</label>
								<p>{{ promoCode.title }}</p>
							</div>
							<div class="w-50">
								<label>{{ $t('promos.promoCode') }}</label>
								<p>{{ promoCode.code }}</p>
							</div>
						</div>
						<div class="d-flex justify-content-between mb-1">
							<div class="w-50">
								<label>{{ $t('promos.type') }}</label>
								<p>{{ typeMap[promoCode.type] }}</p>
							</div>
							<div class="w-50">
								<label>{{ $t('promos.use_type') }}</label>
								<p>{{ useTypeMap[promoCode.useType] }}</p>
							</div>
						</div>

						<div class="d-flex justify-content-between">
							<div class="w-50">
								<label>{{ $t('promos.min_cart') }}</label>
								<p>{{ promoCode.cartLimit }}</p>
							</div>
							<div class="w-50">
								<label>{{ $t('promos.discount') }}</label>
								<p>{{ promoCode.percentage }}%</p>
							</div>
						</div>
					</div>
					<div class="w-50">
						<div class="mb-1">
							<DatesSelector
								:start-date.sync="promoCode.startDate"
								:end-date.sync="promoCode.endDate"
							/>
						</div>
						<div class="d-flex align-items-end mb-1">
							<Input
								v-if="promoCode.useType === 'MultipleUse'"
								:title="$t('promos.quantity')"
								:input-model.sync="promoCode.quantity"
								:place-holder="$t('promos.quantity')"
								input-type="number"
							/>
						</div>
						<div class="d-flex justify-content-between">
							<div class="w-50">
								<label>{{ $t('promos.create_date') }}</label>
								<p>{{ promoCode.createDate | formatDate }}</p>
							</div>
							<div class="w-50">
								<label>{{ $t('promos.status') }}</label>
								<p>{{ promoCode.active ? $t('global.active') : $t('global.inactive') }}</p>
							</div>
						</div>	<div class="d-flex justify-content-between">
							<div class="w-50">
								<label>{{ $t('promos.include_new') }}</label>
								<p>{{ promoCode.includeNewUsers ? $t('global.yes') : $t('global.no') }}</p>
							</div>
						</div>
					</div>
				</div>
				<BButton
					:variant="promoCode.active ? 'info' : 'success'"
					style="margin: 0.5rem"
					type="submit"
					@click.prevent="publishPromoCode(promoCode.id)"
				>
					{{ promoCode.active ? $t('promos.unpublish') : $t('promos.publish') }}
				</BButton>
				<BButton
					variant="primary"
					style="margin: 0.5rem"
					type="submit"
					:disabled="disabledButton"
					@click.prevent="updatePromoCode"
				>
					{{ $t('global.update') }}
				</BButton>
			</div>
			<div class="p-1">
				<PromoCodeUsersList
					:promo-code-users-list="promoCode.users"
					:use-type="promoCode.useType"
				/>
			</div>
		</b-card>
	</div>
</template>

<script>
/* eslint-disable */
import { onUnmounted } from '@vue/composition-api';
import { BCard, BButton } from 'bootstrap-vue';
import moment from 'moment';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import router from '@/router';
import HorizontalNavbar from '@/views/navbar/HorizontalNavbar.vue';
import promoStoreModule from './promoStoreModule';
import store from '@/store';
import PromoCodeUsersList from './components/PromoCodeUsersList.vue';
import Input from './components/Input.vue';
import DatesSelector from './components/DatesSelector.vue';

export default {
	name: 'PromoCodesEdit',
	components: {
		PromoCodeUsersList,
		HorizontalNavbar,
		BCard,
		Input,
		DatesSelector,
		BButton,
	},
	filters: {
		formatDate(value) {
			return moment(String(value)).format('HH:mm  MM/DD/YYYY');
		},
	},
	data() {
		return {
			lang: '',
			promoCode: {},
			disabledButton: false,
			useTypeMap: {
				SingleUse: this.$i18n.t('promos.single'),
				MultipleUse: this.$i18n.t('promos.multiple'),
				FirstOrder: this.$i18n.t('promos.firstOrder'),
			},
			typeMap: {
				FreeDelivery: this.$i18n.t('promos.free_delivery'),
				Cart: this.$i18n.t('promos.disc_code'),
			},
		};
	},
	watch: {
		//
	},
	mounted() {
		this.fetchPromoCodeById(router.currentRoute.params.id);
		this.lang = localStorage.getItem('lang');
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
	methods: {
		publishPromoCode(id) {
			store
				.dispatch(`app-promo/publishPromoCode`, id)
				.then(() => {
					this.toast('პრომო კოდი განახლდა', 'success', 'Success');
					this.fetchPromoCodeById(router.currentRoute.params.id);
				})
				.catch(() => {
					this.toast('შეცდომა დაფაბილშებისას', 'danger', 'Danger');
				});
		},
		updatePromoCode() {
			this.disabledButton = true;
			setTimeout(() => {
				this.disabledButton = false;
			}, 1000);
			const payload = {
				startDate: this.promoCode.startDate,
				endDate: this.promoCode.endDate,
				percentage: this.promoCode.percentage,
				cartLimit: this.promoCode.cartLimit ? this.promoCode.cartLimit : 0,
				quantity: parseFloat(this.promoCode.quantity),
				translations: this.promoCode.translations,
				userIds: this.promoCode.UserIds ? this.promoCode.UserIds : null,
				id: this.promoCode.id,
			};
			store
				.dispatch(`app-promo/editPromoCode`, payload)
				.then(() => {
					// eslint-disable-next-line no-console
					this.toast('Promo Code Successfully Updated', 'success', 'Success');
				})
				.catch(() => {
					this.toast('შეცდომა განახლებისას', 'danger', 'Danger');
				});
		},
		fetchPromoCodeById(id) {
			store.dispatch(`app-promo/fetchPromoCodeById`, id).then((response) => {
				// eslint-disable-next-line no-console
				console.log('promo code', response);
				this.promoCode = response;
				if (this.lang === 'ka') {
					this.promoCode.title = response.translations[0].title;
				} else {
					this.promoCode.title = response.translations[1].title;
				}
			});
		},
		goBack() {
			router.push({ name: 'promocodes' });
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
