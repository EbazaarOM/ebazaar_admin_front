<!-- eslint-disable vue/attributes-order -->
<template>
	<div class="p-1 mb-2 shadow" style="margin: 0.25rem">
		<p>{{ $t('statistics.overview') }}</p>
		<StatsDatePicker
			v-if="datepickerEnabled"
			:handle-from-change="handleFromChange"
			:handle-to-change="handleToChange"
		/>
		<div class="d-flex flex-wrap" style="max-width: 1200px">
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="userStats.activeConsulCount"
				:title="$t('statistics.activeConsulsCount')"
				image="icon-13"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="userStats.totalConsulCount"
				:title="$t('statistics.totalConsulsCount')"
				image="icon-12"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="userStats.activeFarmerCount"
				:title="$t('statistics.activeFarmersCount')"
				image="icon-10"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="userStats.totalFarmerCount"
				:title="$t('statistics.totalFarmersCount')"
				image="icon-11"
			/>
			<StatsIconContainer
				v-if="role === 'consul'"
				:count="userStats.activeFarmerCount"
				:title="$t('statistics.activeFarmersCount')"
				image="icon-10"
			/>
			<StatsIconContainer
				v-if="role === 'consul'"
				:count="userStats.totalFarmerCount"
				:title="$t('statistics.totalFarmersCount')"
				image="icon-13"
			/>
			<!-- prodcounts -->
			<StatsIconContainer
				:count="prodStats.totalProductCount"
				:title="$t('statistics.totalProductsCount')"
				image="icon-9"
			/>
			<StatsIconContainer
				:count="prodStats.totalVisibleProductCount"
				:title="$t('statistics.publishedProductsCount')"
				image="icon-8"
			/>
			<StatsIconContainer
				v-if="role === 'admin' || role === 'consul'"
				:count="prodStats.totalViews"
				:title="$t('statistics.productViews')"
				image="icon-7"
			/>
		</div>
		<div class="my-1">
			<b-button
				v-ripple.400="'rgba(113, 102, 240, 0.15)'"
				size="sm"
				v-b-toggle.product-table
				variant="light"
			>
				{{ $t('statistics.viewSpreadsheet') }}
			</b-button>
		</div>
		<b-collapse id="product-table">
			<b-table
				v-if="prodStats.products"
				:fields="fields"
				:items="prodStats.products"
				class="table-sm rounded-lg shadow-sm order-table"
				small
				hover
				sticky-header
				bordered
				striped
				responsive
				primary-key="id"
				show-empty
				empty-text="No matching records found"
			>
				<!--  -->
			</b-table>
		</b-collapse>
	</div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import { BTable, BCollapse, BButton, VBToggle } from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import StatsDatePicker from '../StatsDatePicker.vue';
import StatsIconContainer from '../StatsIconContainer.vue';

export default {
	name: 'DeniedProductsTable',
	components: {
		StatsIconContainer,
		BTable,
		StatsDatePicker,
		BCollapse,
		BButton,
	},
	directives: {
		'b-toggle': VBToggle,
		Ripple,
	},
	props: {
		userStats: Object,
		prodStats: Object,
		handleFromChange: {
			type: Function,
			default: () => {},
		},
		handleToChange: {
			type: Function,
			default: () => {},
		},
		datepickerEnabled: Boolean,
	},
	data() {
		return {
			items: '',
			role: '',
			fields: [
				{ key: 'productCode', label: this.$i18n.t('statistics.productCode') },
				{
					key: 'productTitle',
					label: this.$i18n.t('statistics.productsToSell'),
				},
				{
					key: 'productInStock',
					label: this.$i18n.t('statistics.productStock'),
				},
				{
					key: 'productAvailable',
					label: this.$i18n.t('statistics.availableProduct'),
				},
				{
					key: 'productReserved',
					label: this.$i18n.t('statistics.reservedProduct'),
				},
			],
		};
	},
	mounted() {
		this.role = localStorage.getItem('role');
		if (this.role === 'admin' || this.role === 'consul') {
			this.fields.push({
				key: 'productViews',
				label: this.$i18n.t('statistics.views'),
			});
		}
	},
};
</script>
