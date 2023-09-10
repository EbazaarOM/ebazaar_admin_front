<template>
	<div>
		<div v-if="promoCodeUsersList" class="py-1 d-flex">
			<Input
				:title="$t('global.search')"
				:input-model.sync="filter"
				:place-holder="$t('global.search')"
				input-type="search"
			/>
			<SelectInput
				:input-model.sync="activeFilter"
				:name="$t('promos.use_type')"
				:options-list="activeFilterList"
			/>
		</div>
		<b-table
			id="promoCodeUsersTable"
			bordered
			hover
			responsive
			class="rounded-lg shadow-sm"
			thead-tr-class="promoCodes-main-thead"
			:items="computedUsersList"
			primary-key="id"
			:fields="computedFields"
			show-empty
			empty-text="No matching records found"
			sort-desc
			:per-page="perPage"
			:current-page="currentPage"
			:filter="filter"
			@filtered="onFiltered"
		>
			<template #cell(active)="data">
				{{
					data.item.used > 0
						? $t('promos.used')
						: $t('promos.not_used'),

				}}
			</template>
		</b-table>
		<BPagination
			v-model="currentPage"
			:total-rows="rows"
			:per-page="perPage"
			aria-controls="promoCodeUsersTable"
		/>
	</div>
</template>

<script>
import { BTable, BPagination } from 'bootstrap-vue';
import Input from './Input.vue';
import SelectInput from './SelectInput.vue';

export default {
	name: 'PromoCodeUsersList',
	components: {
		BTable,
		BPagination,
		Input,
		SelectInput,
	},

	props: {
		useType: {
			type: String,
			default: '',
		},
		promoCodeUsersList: {
			type: Array,
			default: () => [],
		},
		//
	},
	data() {
		return {
			perPage: 15,
			currentPage: 1,
			fields: [
				{
					key: 'code',
					label: this.$i18n.t('global.id'),
					disableOnSingular: false,
				},
				{
					key: 'fullName',
					label: this.$i18n.t('global.title'),
					disableOnSingular: false,
				},
				{
					key: 'remaining',
					label: this.$i18n.t('promos.remaining'),
					disableOnSingular: true,
				},
				{
					key: 'used',
					label: this.$i18n.t('promos.used'),
					disableOnSingular: true,
				},
				{
					key: 'active',
					label: this.$i18n.t('global.status'),
					disableOnSingular: false,
				},
			],
			useTypeMap: {
				SingleUse: this.$i18n.t('global.single'),
				MultipleUse: this.$i18n.t('global.multiple'),
				FirstOrder: this.$i18n.t('global.firstOrder'),
			},
			filter: null,
			activeFilter: {
				title: this.$i18n.t('global.all'),
				value: 'all',
			},
			activeFilterList: [
				{
					title: this.$i18n.t('global.all'),
					value: 'all',
				},
				{
					title: this.$i18n.t('promos.used'),
					value: 'Active',
				},
				{
					title: this.$i18n.t('promos.not_used'),
					value: 'Inactive',
				},
			],
			rows: null,
		};
	},
	computed: {
		computedUsersList() {
			if (this.activeFilter === null) {
				this.onFiltered(this.promoCodeUsersList);
				return this.promoCodeUsersList;
			}
			if (this.activeFilter.value === 'Active') {
				const filteredList = this.filterByUsage('used');
				this.onFiltered(filteredList);
				return filteredList;
			}
			if (this.activeFilter.value === 'Inactive') {
				const filteredList = this.filterByUsage('not_used');
				this.onFiltered(filteredList);
				return filteredList;
			}
			this.onFiltered(this.promoCodeUsersList);
			return this.promoCodeUsersList;
		},
		computedFields() {
			if (this.useType === 'MultipleUse') {
				return this.fields;
			}
			return this.fields.filter((e) => e.disableOnSingular === false);
		},
	},

	mounted() {
		setTimeout(() => {
			this.rows = this.promoCodeUsersList.length;
		}, 1000);
	},
	methods: {
		filterByUsage(filterType = 'used') {
			if (filterType === 'used') {
				return this.promoCodeUsersList.filter((user) => user.used > 0);
			}
			return this.promoCodeUsersList.filter((user) => user.used === 0);
		},
		onFiltered(filteredItems) {
			// Trigger pagination to update the number of buttons/pages due to filtering
			this.rows = filteredItems.length;
			this.currentPage = 1;
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
</style>
