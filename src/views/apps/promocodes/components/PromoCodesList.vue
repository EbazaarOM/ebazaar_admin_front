<template>
	<div class="p-1">
		<b-table
			ref="refPromoCodesTable"
			bordered
			hover
			responsive
			class="rounded-lg shadow-sm"
			thead-tr-class="promoCodes-main-thead"
			:items="fetchPromoCodes"
			primary-key="id"
			:fields="promoCodeListTableFields"
			:sort-by.sync="sortBy"
			show-empty
			empty-text="No matching records found"
			:sort-desc.sync="isSortDirDesc"
			small
		>
			<template #cell(action)="data">
				<b-button
					class="btn-icon"
					variant="flat-danger"
					@click="confirmDelete(data.item.id)"
				>
					<feather-icon size="16" icon="TrashIcon" />
				</b-button>
			</template>
			<template #cell(useType)="data">
				{{ useTypeMap[data.item.useType] }}
			</template>
			<template #cell(title)="data">
				<BLink :to="{ name: 'promocodes-view', params: { id: data.item.id } }">
					{{ data.item.title }}
				</BLink>
			</template>
			<template #cell(createDate)="data">
				<span>
					{{ data.item.createDate | formatDate }}
				</span>
			</template>
			<template #cell(endDate)="data">
				<span>
					{{ data.item.endDate | formatDate }}
				</span>
			</template>
			<template #cell(startDate)="data">
				<span>
					{{ data.item.startDate | formatDate }}
				</span>
			</template>
		</b-table>
		<b-pagination
			v-model="currentPage"
			:total-rows="totalPromoCodes"
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
	</div>
</template>

<script>
import { BTable, BLink, BButton, BPagination } from 'bootstrap-vue';
import moment from 'moment';
import store from '@/store';
import usePromoCodesList from './usePromoCodesList';

export default {
	name: 'PromoCodesList',
	components: {
		BTable,
		BLink,
		BButton,
		BPagination,
	},
	filters: {
		formatDate(value) {
			return moment(String(value)).format('HH:mm  MM/DD/YYYY');
		},
	},

	props: {
		updateListData: {
			type: Number,
			default: 0,
		},
		toastNotification: {
			type: Function,
			default: () => {},
		},
	},
	data() {
		return {
			promoCodeListTableFields: [
				{ key: 'action', label: '' },
				{ key: 'id', label: 'ID' },
				{ key: 'title', label: this.$i18n.t('promos.title') },
				{ key: 'code', label: this.$i18n.t('promos.promoCode') },
				{ key: 'quantity', label: this.$i18n.t('promos.quantity') },
				{ key: 'percentage', label: this.$i18n.t('promos.discount'), formatter: (val) => `${val}%` },
				{
					key: 'cartLimit',
					label: this.$i18n.t('promos.min_cart'),
					formatter: (val) => `${val} ₾`,
				},
				{
					key: 'type',
					label: 'ტიპი',
					formatter: (val) => (val === 'Cart' ? this.$i18n.t('promos.disc_code') : this.$i18n.t('promos.free_delivery')),
				},
				{
					key: 'useType',
					label: this.$i18n.t('promos.use_type'),
				},
				{
					key: 'active',
					label: this.$i18n.t('promos.status'),
					formatter: (val) => (val ? this.$i18n.t('global.active') : this.$i18n.t('global.inactive')),
				},
				{
					key: 'includeNewUsers',
					label: this.$i18n.t('promos.include_new'),
					formatter: (val) => (val ? this.$i18n.t('global.yes') : this.$i18n.t('global.no')),
				},
				{ key: 'startDate', label: this.$i18n.t('promos.start_date') },
				{ key: 'endDate', label: this.$i18n.t('promos.end_date') },
				{ key: 'createDate', label: this.$i18n.t('promos.create_date') },
			],
			useTypeMap: {
				SingleUse: this.$i18n.t('promos.single'),
				MultipleUse: this.$i18n.t('promos.multiple'),
				FirstOrder: this.$i18n.t('promos.firstOrder'),
			},
		};
	},
	watch: {
		updateListData() {
			this.refetchData();
		},
	},
	methods: {
		deletePromoCode(id) {
			store
				.dispatch('app-promo/deletePromoCode', id)
				.then(() => {
					this.toastNotification(
						'Promo Code Successfully Deleted',
						'success',
						'Success'
					);
					this.refetchData();
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.log(e);
					this.toastNotification(
						'Error deleting promocode',
						'danger',
						'Danger'
					);
				});
		},
		confirmDelete(id) {
			this.$swal({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				customClass: {
					confirmButton: 'btn btn-primary',
					cancelButton: 'btn btn-outline-danger ml-1',
				},
				buttonsStyling: false,
			}).then((result) => {
				if (result.value) {
					this.deletePromoCode(id);
				}
			});
		},
	},
	setup(props) {
		const {
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
		} = usePromoCodesList(props);

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
	},
};
</script>

<style lang="scss">
//
</style>
