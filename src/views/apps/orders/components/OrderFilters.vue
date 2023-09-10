<template>
	<div class="m-1 d-flex flex-wrap">
		<div class="mr-2">
			<label>{{ $t('global.onPage') }}</label>
			<v-select
				v-model="perPageInput"
				:clearable="false"
				:options="perPageOptions"
				class="per-page-selector"
			/>
		</div>
		<div v-if="limitStatusesTo.includes(role)" class="mr-2">
			<label>{{ $t('orders.paymentMethod') }}</label>
			<v-select
				v-model="paymentMethodInput"
				:options="paymentMethodOptions"
				:clearable="true"
				class="per-page-selector"
			/>
		</div>
		<div v-if="limitStatusesTo.includes(role)" class="mr-2">
			<label>{{ $t('global.status') }}</label>
			<v-select
				v-model="statusFilterInput"
				:options="orderStatusList"
				:clearable="true"
				class="order-status-selector"
				:reduce="(status) => status.value"
				label="title"
				multiple
			/>
		</div>
		<div v-else class="mr-2">
			<label>{{ $t('global.status') }}</label>
			<v-select
				v-model="statusFilterInput"
				:options="productStatusList"
				:clearable="true"
				class="order-status-selector"
				:reduce="(status) => status.value"
				label="title"
			/>
		</div>
		<div v-if="limitStatusesTo.includes(role)" class="mr-2">
			<label>{{ $t('orders.payzeStatus') }}</label>
			<v-select
				v-model="payzeStatusModel"
				:options="payzeStatusList"
				:clearable="true"
				class="order-status-selector"
				:reduce="(status) => status.value"
				label="title"
				multiple
			/>
		</div>
		<div class="mr-2 mb-1">
			<label>{{ $t('global.search') }}</label>
			<b-form-input
				v-model="searchInput"
				placeholder=""
				style="width: 230px"
			/>
		</div>
		<div v-if="limitStatusesTo.includes(role)"  class="mr-2 mb-1">
			<label>{{ $t('orders.searchProduct') }}</label>
			<b-form-input
				v-model="productCodeInput"
				placeholder=""
				style="width: 230px"
			/>
		</div>
		<div v-if="limitStatusesTo.includes(role)" class="d-flex w-100 flex-wrap">
			<div class="mb-1 mr-2">
				<label>{{ $t('global.dateFrom') }}:</label>
				<b-form-datepicker
					v-model="dateFromFilterInput"
					:reset-button="true"
					:date-format-options="{
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					}"
					:placeholder="$t('global.from')"
				/>
			</div>
			<div class="mb-1 mr-2">
				<label>{{ $t('global.dateTo') }}:</label>
				<b-form-datepicker
					v-model="dateToFilterInput"
					:reset-button="true"
					:date-format-options="{
						month: 'numeric',
						day: 'numeric',
						year: 'numeric',
					}"
					:placeholder="$t('global.to')"
				/>
			</div>
			<div>
				<label>{{ $t('global.priceFrom') }}:</label>
				<b-form-input
					v-model="priceFromInput"
					type="number"
					style="width: 120px;"
					class="mr-2"
				/>
			</div>
			<div>
				<label>{{ $t('global.priceTo') }}:</label>
				<b-form-input
					v-model="priceToInput"
					type="number"
					style="width: 120px;"
					class="mr-2"
				/>
			</div>
			<div
				v-if="role === 'admin' ||
				role === 'callCenterManager'"
				class="d-flex align-items-center"
				style="padding-top:8px"
			>
				<b-button variant="primary" @click="exportToExcel(dateFrom, dateTo)">
          {{ $t('global.export') }}
				</b-button>
			</div>
			<div
				v-if="
					role === 'admin' ||
					role === 'callCenterManager' ||
					role === 'logisticsManager'
				"
				class="ml-2 d-flex align-items-center justify-content-center"
			>
				<div class="d-flex flex-column align-items-center">
					<label class="mb-0"> {{ $t('orders.deliveryDashboard') }} </label>
					<b-form-checkbox
						class="custom-control-primary"
						name="delivery-button"
						switch
						@change="handleSwitch()"
					/>
				</div>
			</div>
			<div class="d-flex align-items-center ml-2" style="margin-top: 10px">
				<b-button class="btn-icon" variant="primary" @click="refetchData()">
					<feather-icon size="16" icon="RefreshCwIcon" />
				</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import {
	BFormInput,
	BButton,
	BFormDatepicker,
	BFormCheckbox,
} from 'bootstrap-vue';
import vSelect from 'vue-select';

export default {
	name: 'OrderFilters',
	components: {
		BFormInput,
		BButton,
		BFormCheckbox,
		vSelect,
		BFormDatepicker,
	},
	props: {
		role: {
			type: String,
			default: '',
		},
		refetchData: {
			type: Function,
			default() {
				return [];
			},
		},
		perPage: {
			type: Number,
			default: 0,
		},
		perPageOptions: {
			type: Array,
			default() {
				return [];
			},
		},
		searchQuery: {
			type: String,
			default: '',
		},
		productCodeFilter: {
			type: String,
			default: '',
		},
		paymentMethodFilter: {
			type: String,
			default: '',
		},
		paymentMethodOptions: {
			type: Array,
			default() {
				return [];
			},
		},
		statusFilter: {
			type: Array,
			default() {
				return [];
			},
		},
		statusStringFilter: {
			type: String,
			default: '',
		},
		payzeStatusFilter: {
			type: Array,
			default() {
				return [];
			},
		},
		dateFromFilter: {
			type: String,
			default: '',
		},
		dateToFilter: {
			type: String,
			default: '',
		},
		handleSwitch: {
			type: Function,
			default() {
				return [];
			},
		},
		priceFrom: {
			type: String,
			default: '',
		},
		priceTo: {
			type: String,
			default: '',
		},
		exportToExcel: {
			type: Function,
			default() {
				return [];
			}
		},
		productStatusList: {
			type: Array,
			default() {
				return [];
			}
		},
	},

	data() {
		return {
			orderStatusList: [
				{ value: '', title: this.$i18n.t('orderStatusList.all') },
				{ value: 'New', title: this.$i18n.t('orderStatusList.new') },
				{ value: 'Pending', title: this.$i18n.t('orderStatusList.pending') },
				{ value: 'Declined', title: this.$i18n.t('orderStatusList.declined') },
				{ value: 'AwaitingFulfillment', title: this.$i18n.t('orderStatusList.awaitingFulfillment') },
				{ value: 'CancelledByAvailability', title: this.$i18n.t('orderStatusList.cancelledByAvailability') },
				{ value: 'CancelledByCollecting', title: this.$i18n.t('orderStatusList.cancelledByCollecting') },
				{ value: 'CancelledByGathering', title: this.$i18n.t('orderStatusList.cancelledByGathering') },
				{ value: 'Cancelled', title: this.$i18n.t('orderStatusList.cancelled') },
				{ value: 'Gathered', title: this.$i18n.t('orderStatusList.gathered') },
				{ value: 'Ungathered', title: this.$i18n.t('orderStatusList.ungathered') },
				{ value: 'Collected', title: this.$i18n.t('orderStatusList.collected') },
				{ value: 'PartiallyCollected', title: this.$i18n.t('orderStatusList.partiallyCollected') },
				{ value: 'Shipping', title: this.$i18n.t('orderStatusList.shipping') },
				{ value: 'Delivered', title: this.$i18n.t('orderStatusList.delivered') },
				{ value: 'PartiallyDelivered', title: this.$i18n.t('orderStatusList.partiallyDelivered') },
				{ value: 'NotDelivered', title: this.$i18n.t('orderStatusList.notDelivered') },
				{ value: 'Returned', title: this.$i18n.t('orderStatusList.returned') },
				{ value: 'Closed', title: this.$i18n.t('orderStatusList.closed') },
				{ value: 'PartiallyReturned', title: this.$i18n.t('orderStatusList.partiallyReturned') },
				{ value: 'Failed', title: this.$i18n.t('orderStatusList.failed') },
				{ value: 'Refunded', title: this.$i18n.t('orderStatusList.refunded') },
			],
			payzeStatusList: [
				{ value: 'Active', title: this.$i18n.t('payzeStatusList.active') },
				{ value: 'Blocked', title: this.$i18n.t('payzeStatusList.blocked') },
				{ value: 'CommitFailed', title: this.$i18n.t('payzeStatusList.commitFailed') },
				{ value: 'Committed', title: this.$i18n.t('payzeStatusList.committed') },
				{ value: 'Nothing', title: this.$i18n.t('payzeStatusList.nothing') },
				{ value: 'Error', title: this.$i18n.t('payzeStatusList.error') },
				{ value: 'Refunded', title: this.$i18n.t('payzeStatusList.refunded') },
				{ value: 'RefundedPartially', title: this.$i18n.t('payzeStatusList.refundedPartially') },
				{ value: 'Rejected', title: this.$i18n.t('payzeStatusList.rejected') },
				{ value: 'Timeout', title: this.$i18n.t('payzeStatusList.timeout') },
			],
			limitStatusesTo: [
				'admin', 'callCenterManager', 'logisticsManager',
			],
			dateFrom: '',
			dateTo: '',
		};
	},
	computed: {
		searchInput: {
			get() {
				return this.searchQuery;
			},
			set(val) {
				this.$emit('update:searchQuery', val);
			},
		},
		productCodeInput: {
			get() {
				return this.productCodeFilter;
			},
			set(val) {
				this.$emit('update:productCodeFilter', val);
			},
		},
		perPageInput: {
			get() {
				return this.perPage;
			},
			set(val) {
				this.$emit('update:perPage', val);
			},
		},
		paymentMethodInput: {
			get() {
				return this.paymentMethodFilter;
			},
			set(val) {
				this.$emit('update:paymentMethodFilter', val);
			},
		},
		statusFilterInput: {
			get() {
				if (this.limitStatusesTo.includes(this.role)) {
					return this.statusFilter;
				}
					return this.statusStringFilter;
			},
			set(val) {
				if (this.limitStatusesTo.includes(this.role)) {
					this.$emit('update:statusFilter', val);
				} else {
					this.$emit('update:statusStringFilter', val);
				}
			},
		},
		payzeStatusModel: {
			get() {
				return this.payzeStatusFilter;
			},
			set(val) {
				this.$emit('update:payzeStatusFilter', val);
			},
		},
		dateFromFilterInput: {
			get() {
				return this.dateFromFilter;
			},
			set(val) {
				this.dateFrom = val;
				this.$emit('update:dateFromFilter', val);
			},
		},
		dateToFilterInput: {
			get() {
				return this.dateToFilter;
			},
			set(val) {
				this.dateTo = val;
				this.$emit('update:dateToFilter', val);
			},
		},
		priceFromInput: {
			get() {
				return this.priceFrom;
			},
			set(val) {
				this.$emit('update:priceFrom', val);
			},
		},
		priceToInput: {
			get() {
				return this.priceTo;
			},
			set(val) {
				this.$emit('update:priceTo', val);
			},
		},
	},
};
</script>
<style scoped>
.order-status-selector {
	width: 280px;
}
</style>
