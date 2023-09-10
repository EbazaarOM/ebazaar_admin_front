<template>
	<div class="mb-2">
		<p>{{ $t('statistics.saleReport') }}</p>
		<StatsDatePicker
			v-if="datepickerEnabled"
			:handle-from-change="handleFromChange"
			:handle-to-change="handleToChange"
		/>
		<div class="d-flex flex-wrap" style="max-width: 1200px">
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalBonusAmount"
				:title="$t('statistics.bonusSum')"
				:currency="true"
				image="icon-6"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalDeliveryAmount"
				:title="$t('statistics.paidShippingSum')"
				:currency="true"
				image="icon-5"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalFlowAmount"
				:title="$t('statistics.turnoverSum')"
				:currency="true"
				image="icon-4"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalIncomeAmount"
				:title="$t('statistics.profitSum')"
				:currency="true"
				image="icon-3"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalOrderCount"
				:title="$t('statistics.soldOrdersCount')"
				:currency="false"
				image="icon-2"
			/>
			<StatsIconContainer
				v-if="role === 'admin'"
				:count="prodStats.totalProductCount"
				:title="$t('statistics.soldProductsCount')"
				:currency="false"
				image="icon-1"
			/>
			<StatsIconContainer
				v-if="role !== 'admin'"
				:count="prodStats.incomeAmount"
				:title="$t('statistics.profitSum')"
				:currency="true"
				image="icon-3"
			/>
			<StatsIconContainer
				v-if="role !== 'admin'"
				:count="prodStats.productCount"
				:title="$t('statistics.soldProductsCount')"
				:currency="false"
				image="icon-13"
			/>
			<StatsIconContainer
				v-if="role === 'consul'"
				:count="prodStats.bonusAmount"
				:title="$t('statistics.bonusSum')"
				:currency="true"
				image="icon-2"
			/>
			<StatsIconContainer
				v-if="role === 'consul'"
				:count="prodStats.flowAmount"
				:title="$t('statistics.turnoverSum')"
				:currency="true"
				image="icon-3"
			/>
			<StatsIconContainer
				v-if="role === 'callCenterManager'"
				:count="prodStats.ordersCount"
				:title="$t('statistics.soldOrdersCount')"
				:currency="false"
				image="icon-4"
			/>
			<StatsIconContainer
				v-if="role === 'callCenterManager'"
				:count="prodStats.flowAmount"
				:title="$t('statistics.turnoverSum')"
				:currency="true"
				image="icon-5"
			/>
			<StatsIconContainer
				v-if="role === 'callCenterManager'"
				:count="prodStats.totalDeliveryAmount"
				:title="$t('statistics.paidShippingSum')"
				:currency="true"
				image="icon-6"
			/>
		</div>
		<div class="my-1">
			<b-button
				v-ripple.400="'rgba(113, 102, 240, 0.15)'"
				v-b-toggle.sold-product-table
				size="sm"
				variant="light"
			>
				{{ $t('statistics.viewSpreadsheet') }}
			</b-button>
		</div>
		<b-collapse id="sold-product-table">
			<b-table
				v-if="items"
				:fields="fields"
				:items="items"
				class="table-sm rounded-lg shadow-sm order-table"
				small
				hover
				bordered
				sticky-header
				striped
				responsive
				primary-key="id"
				show-empty
				empty-text="No matching records found"
			>
				<!--  -->
			</b-table>
			<ConsulTable v-if="role === 'admin'" :prod-stats="prodStats.data" />
		</b-collapse>
	</div>
</template>

<script>
/* eslint-disable */
import { BTable, BCollapse, BButton, VBToggle } from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import StatsDatePicker from '../StatsDatePicker.vue';
import ConsulTable from './ConsulTable.vue';
import StatsIconContainer from '../StatsIconContainer.vue';
export default {
	name: 'SoldProductsTable',
	components: {
		BTable,
		StatsDatePicker,
		ConsulTable,
		BCollapse,
		BButton,
		VBToggle,
		StatsIconContainer,
	},
	directives: {
		'b-toggle': VBToggle,
		Ripple,
	},
	props: {
		prodStats: Object,
		handleFromChange: Function,
		handleToChange: Function,
		datepickerEnabled: Boolean,
	},
	data() {
		return {
			role: '',
			items: [],
		};
	},
	mounted() {
		this.role = localStorage.getItem('role');
	},
	watch: {
		prodStats(newVal) {
			if (this.role === 'admin') {
				const arr = [];
				newVal.data.forEach((e) => {
					arr.push(...e.products);
				});
				this.items = arr;
			} else {
				this.items = newVal.products;
			}
		},
	},
	computed: {
		fields() {
			if (this.role === 'farmer') {
				return [
					{ key: 'productCode', label: this.$i18n.t('statistics.productCode') },
					{
						key: 'productTitle',
						label: this.$i18n.t('statistics.productTitle'),
					},
					{ key: 'quantity', label: this.$i18n.t('statistics.quantity') },
					{
						key: 'incomeAmount',
						label: this.$i18n.t('statistics.incomeAmount'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
				];
			} else if (this.role === 'consul') {
				return [
					{ key: 'productCode', label: this.$i18n.t('statistics.productCode') },
					{
						key: 'productTitle',
						label: this.$i18n.t('statistics.productTitle'),
					},
					{ key: 'quantity', label: this.$i18n.t('statistics.quantity') },
					{
						key: 'incomeAmount',
						label: this.$i18n.t('statistics.incomeAmount'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
					{
						key: 'flowAmount',
						label: this.$i18n.t('statistics.turnover'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
				];
			} else if (this.role === 'callCenterManager') {
				return [
					{ key: 'productCode', label: this.$i18n.t('statistics.productCode') },
					{
						key: 'productTitle',
						label: this.$i18n.t('statistics.productTitle'),
					},
					{ key: 'quantity', label: this.$i18n.t('statistics.quantity') },
					{
						key: 'incomeAmount',
						label: this.$i18n.t('statistics.incomeAmount'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
					{
						key: 'flowAmount',
						label: this.$i18n.t('statistics.turnover'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
					{
						key: 'totalDeliveryAmount',
						label: this.$i18n.t('statistics.paidShippingSum'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
				];
			} else if (this.role === 'admin') {
				return [
					{ key: 'productCode', label: this.$i18n.t('statistics.productCode') },
					{
						key: 'productTitle',
						label: this.$i18n.t('statistics.productTitle'),
					},
					{
						key: 'distinctQuantity',
						label: this.$i18n.t('statistics.distinctQuantity'),
					},
					{ key: 'quantity', label: this.$i18n.t('statistics.quantity') },
					{
						key: 'flowAmount',
						label: this.$i18n.t('statistics.turnover'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
					{
						key: 'incomeAmount',
						label: this.$i18n.t('statistics.incomeAmount'),
						formatter: (val) => `${val.toFixed(2)} ₾`,
					},
				];
			}
		},
		totalIncome() {
			if (this.prodStats.products) {
				let count = 0;
				this.prodStats.products.forEach((e) => {
					count += e.incomeAmount;
				});
				return count;
			}
		},
	},
};
</script>

<style></style>
