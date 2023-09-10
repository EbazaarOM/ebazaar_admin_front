<template>
	<b-modal
		id="assign-courier-modal"
		scrollable
		:title="$t('orders.assignCourier')"
		:cancel-title="$t('global.cancel')"
		size="lg"
		cancel-variant="outline-secondary"
	>
		<div class="mr-2 mb-1">
			<label>{{ $t('global.search') }}</label>
			<b-form-input
				v-model="searchQuery"
				:placeholder="$t('orders.searchNameOrCode')"
				style="width: 230px;"
			/>
		</div>
    {{ $t('orders.orderId') }} : {{ currentOrderId }}
		<b-table
			:fields="fields"
			:items="couriers"
			class="table-sm rounded-lg shadow-sm order-table mt-1"
			small
			hover
			responsive
			bordered
			striped
			primary-key="id"
			show-empty
			empty-text="No matching records found"
		>
		<!-- actions column -->
			<template
				v-if="role === 'admin' || role === 'consul' || role === 'logisticsManager'"
				#cell(actions)="data"
				style="padding: 0 !important;"
			>
				<div class="d-flex align-items-center justify-content-center">
					<b-button
						class="btn-icon d-flex justify-items-center"
						variant="flat-primary"
						@click.prevent="assignCourierToOrder(data)"
					>
						<feather-icon size="16" icon="PlusSquareIcon"/>
					</b-button>
				</div>
			</template>
			<!-- name column -->
			<template
				v-if="role === 'admin' || role === 'consul'"
				#cell(firstName)="data"
				style="padding: 0 !important;"
			>
				{{ data.item.firstName }} {{ data.item.lastName }}
			</template>
			<!--  -->
		</b-table>
			<b-pagination
				v-model="currentPage"
				:total-rows="totalCouriers"
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
	</b-modal>
</template>

<script>
/* eslint-disable */
/* eslint-disable vue/require-default-prop */
import { BTable, BButton, BFormInput, BModal, BPagination, } from 'bootstrap-vue';
import store from '@/store';
import { onUnmounted , ref , watch , computed } from '@vue/composition-api';
import userStoreModule from '../../user/userStoreModule';


//
export default {
	name: 'AssignCourierModal',
	components: {
		BModal,
		BTable,
		BButton,
		BFormInput,
		BPagination
	},
	props: {
		role: String,
		currentOrderId: String,
		assignCourierToOrder: Function,
	},

	data() {
		return {
			fields: [
				{ key: 'actions', label: this.$i18n.t('global.actions'), tdClass: 'actionsColumn', thStyle: { minWidth: '50px' } },
				{ key: 'uniqueCode', label: 'ID', thStyle: { minWidth: '50px' }},
				{ key: 'firstName', label: this.$i18n.t('users.name'), thStyle: { minWidth: 'auto' }},
				{ key: 'phoneNumber', label: this.$i18n.t('users.phoneNumber'), thStyle: { minWidth: 'auto' }},
				// { key: 'workspacePhoneNumber', label: 'სამსახურის ტელეფონი', thStyle: { minWidth: 'auto' }},
				// { key: 'address', label: 'მისამართი', thStyle: { minWidth: 'auto' }},
				{ key: 'userStatus', label: this.$i18n.t('global.status'), thStyle: { minWidth: 'auto' }},
			],
			couriers: [],
			searchQuery: '',
			totalCouriers: 0,
			currentPage: 1,
			perPage: 10,
			isSortDirDesc: true
		};
	},
	// Product Sticker	Specification		Consul's Phone	Last Update time	Last update role
	setup() {
		const User_APP_STORE_MODULE_NAME = 'app-user';

		// Register module
		if (!store.hasModule(User_APP_STORE_MODULE_NAME)) {
			store.registerModule(User_APP_STORE_MODULE_NAME, userStoreModule);
		}

		// UnRegister on leave
		//
	},
	watch: {
		searchQuery() {
			this.fetchCouriers();
			this.currentPage = 1;
		},
		currentPage() {
			this.fetchCouriers();
		}
	},

	mounted() {
		this.fetchCouriers();
	},

	methods: {
		fetchCouriers() {
			store
			.dispatch('app-user/fetchUsers', {
				role: 'Courier',
				searchWord: this.searchQuery,
				perPage: this.perPage,
				page: this.currentPage,
				take: this.perPage,
				skip: (this.currentPage - 1) * this.perPage,
				sortDesc: true,
				status: 'Active',
			})
			.then((response) => {
				const couriers = response.data;
				const total = response.meta ? response.meta.total : 0;
				this.totalCouriers = total;
				this.couriers = couriers;
				console.log('couriers', this.couriers);
			})
			.catch((e) => {
				alert(e);
				toast({
					component: ToastificationContent,
					props: {
						title: 'Error fetching couriers list',
						icon: 'AlertTriangleIcon',
						variant: 'danger',
					},
				});
			});
		}
	},
};
</script>

<style>
.actionsColumn{
	padding: 0.125rem !important;
}
</style>
