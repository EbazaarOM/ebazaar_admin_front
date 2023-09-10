<template>
	<div>
		<BButton
			v-ripple.400="'rgba(113, 102, 240, 0.15)'"
			v-b-toggle.collapse-1
			variant="outline-primary"
			class="toggle-button"
			size="sm"
		>
			{{ $t('promos.add_new') }}
		</BButton>
		<BCollapse id="collapse-1" class="border-top border-bottom">
			<div class="row">
				<div
					class="d-flex align-items-center promo-form flex-wrap col-12 col-lg-6"
				>
					<div class="d-flex align-items-end flex-wrap">
						<BTabs>
							<BTab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
								<Input
									:title="$t('promos.title')"
									:input-model.sync="payLoad.translations[0].title"
									place-holder="დასახელება"
									input-type="text"
								/>
							</BTab>
							<BTab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
								<Input
									:title="$t('promos.title_en')"
									:input-model.sync="payLoad.translations[1].title"
									place-holder="Title"
									input-type="text"
								/>
							</BTab>
						</BTabs>
						<Input
							:title="$t('promos.promoCode')"
							:input-model.sync="codeHandler"
							:place-holder="$t('promos.promoCode')"
							input-type="text"
						/>
					</div>
					<SelectInput
						:input-model.sync="useTypeObj"
						:name="$t('promos.use_type')"
						:options-list="useTypeList"
					/>
					<SelectInput
						:input-model.sync="typeObj"
						:name="$t('promos.type')"
						:options-list="typeList"
					/>
					<Input
						v-if="payLoad.useType === 'MultipleUse'"
						:title="$t('promos.quantity')"
						:input-model.sync="payLoad.quantity"
						:place-holder="$t('promos.quantity')"
						input-type="number"
					/>
					<Input
						v-if="payLoad.type !== 'FreeDelivery'"
						:title="$t('promos.min_cart')"
						:input-model.sync="payLoad.cartLimit"
						:place-holder="$t('promos.min_cart')"
						input-type="number"
					/>
					<Input
						v-if="payLoad.type !== 'FreeDelivery'"
						:title="$t('promos.discount')"
						:input-model.sync="payLoad.percentage"
						:place-holder="$t('promos.discount')"
						input-type="number"
						:validate-percentage="true"
					/>
				</div>
				<div class="col-12 col-lg-6">
					<DatesSelector
						:start-date.sync="payLoad.startDate"
						:end-date.sync="payLoad.endDate"
					/>
					<div v-if="payLoad.useType !== 'FirstOrder'" class="d-flex ml-1 mt-1">
						<BFormCheckbox v-model="payLoad.includeNewUsers" name="checkbox" />
						<label for="checkbox">{{ $t('promos.include_new_users') }}</label>
					</div>
					<div v-if="payLoad.useType !== 'FirstOrder'" class="d-flex ml-1 mt-1">
						<BFormCheckbox v-model="payLoad.allUsers" name="checkbox" />
						<label for="checkbox">{{ $t('promos.all_users') }}</label>
					</div>
					<SelectInput
						v-if="payLoad.useType !== 'FirstOrder'"
						:input-model.sync="userIdsObj"
						:name="$t('promos.users_list')"
						:options-list="usersList"
						:is-multiple-enabled="true"
						:disabled="payLoad.allUsers"
					/>
				</div>
			</div>
			<BButton
				variant="primary"
				style="margin: 0.5rem"
				type="submit"
				:disabled="
					disableAddButton || disableOnAdding || payLoad.percentage > 100
				"
				@click.prevent="addPromoCode"
			>
				{{ $t('promos.add') }}
			</BButton>
		</BCollapse>
	</div>
</template>

<script>
/* eslint-disable operator-linebreak */

import {
	BButton,
	BTabs,
	BTab,
	BFormCheckbox,
	BCollapse,
	VBToggle,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import store from '@/store';
import DatesSelector from './DatesSelector.vue';
import Input from './Input.vue';
import SelectInput from './SelectInput.vue';

export default {
	name: 'AddPromoCode',
	components: {
		DatesSelector,
		SelectInput,
		Input,
		BTabs,
		BButton,
		BTab,
		BCollapse,
		BFormCheckbox,
	},
	directives: {
		'b-toggle': VBToggle,
		Ripple,
	},
	props: {
		refetchData: {
			type: Function,
			default: () => {},
		},
		toastNotification: {
			type: Function,
			default: () => {},
		},
		usersList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			codeHandler: '',
			disableOnAdding: false,
			payLoad: {
				allUsers: false,
				active: true,
				translations: [
					{
						languageCode: 'ka',
						title: '',
					},
					{
						languageCode: 'en',
						title: '',
					},
				],
				code: '',
				quantity: 0,
				startDate: '',
				endDate: '',
				percentage: 0,
				cartLimit: 0,
				useType: null,
				type: null,
				userIds: [],
				includeNewUsers: false,
			},
			useTypeObj: {
				title: this.$i18n.t('promos.choose'),
				value: 'NotSet',
			},
			userIdsObj: null,
			typeObj: {
				title: this.$i18n.t('promos.choose'),
				value: 'NotSet',
			},
			useTypeList: [
				{
					title: this.$i18n.t('promos.choose'),
					value: 'NotSet',
				},
				{
					title: this.$i18n.t('promos.single'),
					value: 'SingleUse',
				},
				{
					title: this.$i18n.t('promos.multiple'),
					value: 'MultipleUse',
				},
				{
					title: this.$i18n.t('promos.firstOrder'),
					value: 'FirstOrder',
				},
			],
			typeList: [
				{
					title: this.$i18n.t('promos.choose'),
					value: 'NotSet',
				},
				{
					title: this.$i18n.t('promos.free_delivery'),
					value: 'FreeDelivery',
				},
				{
					title: this.$i18n.t('promos.disc_code'),
					value: 'Cart',
				},
			],
			// errors: {
			// 	EndDate: 'თარიღი არასწორია',
			// 	UserIds: 'მომხმარებლები აუცილებელია',
			// },
		};
	},
	computed: {
		disableAddButton() {
			const promocode = this.payLoad;
			if (
				promocode.translations[0].title !== '' &&
				promocode.translations[1].title !== '' &&
				promocode.quantity !== '' &&
				promocode.code !== '' &&
				promocode.code.length > 0 &&
				promocode.startDate !== '' &&
				promocode.endDate !== '' &&
				promocode.type !== '' &&
				promocode.useType !== ''
			) {
				return false;
			}
			return true;
		},
	},
	watch: {
		useTypeObj(newVal) {
			if (newVal) {
				this.payLoad.useType = newVal.value;
			} else {
				this.payLoad.useType = '';
			}
		},
		typeObj(newVal) {
			if (newVal) {
				this.payLoad.type = newVal.value;
			} else {
				this.payLoad.type = '';
			}
		},
		userIdsObj(newVal) {
			this.payLoad.userIds = [];
			newVal.forEach((e) => {
				this.payLoad.userIds.push(e.value);
			});
		},
		codeHandler(newVal) {
			const str = newVal.replace(/\s/g, '').toUpperCase();
			this.codeHandler = str;
			this.payLoad.code = str;
		},
	},
	methods: {
		addPromoCode() {
			this.disableOnAdding = true;
			setTimeout(() => {
				this.disableOnAdding = false;
			}, 1000);
			if (this.payLoad.useType === 'FirstOrder') this.payLoad.allUsers = true;
			store
				.dispatch('app-promo/createPromoCode', this.payLoad)
				.then(() => {
					this.toastNotification(
						'Promo code created successfully.',
						'success',
						'Success'
					);
					this.codeHandler = '';
					this.useTypeObj = {
						title: this.$i18n.t('promos.choose'),
						value: 'NotSet',
					};
					this.userIdsObj = null;
					this.typeObj = {
						title: this.$i18n.t('promos.choose'),
						value: 'NotSet',
					};
					this.payLoad = {
						allUsers: false,
						active: true,
						translations: [
							{
								languageCode: 'ka',
								title: '',
							},
							{
								languageCode: 'en',
								title: '',
							},
						],
						code: '',
						quantity: 0,
						startDate: '',
						endDate: '',
						percentage: 0,
						cartLimit: 0,
						useType: null,
						type: null,
						userIds: [],
						includeNewUsers: false,
					};
					this.refetchData();
				})
				.catch((error) => {
					this.handleErrors(error.data.errors);
					// eslint-disable-next-line no-console
				});
		},
		handleErrors(errors) {
			errors.forEach((e) => {
				if (this.$i18n.t(`promos.error_${e.key}`)) {
					this.toastNotification(
						this.$i18n.t(`promos.error_${e.key}`),
						'danger',
						'Danger'
					);
				} else {
					this.toastNotification(
						this.$i18n.t(`promos.error_general`),
						'danger',
						'Danger'
					);
				}
			});
		},
	},
};
</script>

<style lang="scss">
.input {
	margin: 0.5rem;
}

.input label {
	margin: 0;
}

.animate {
	transition: all 0.5s ease;
}

.toggle-button {
	display: block;
	margin: 0.5rem;
	margin-left: auto;
}
</style>
