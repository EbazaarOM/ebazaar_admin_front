<template>
	<div class="client-info-container">
		<div class="bg-white p-1 mr-1 rounded client-container">
			<div class="client-inner-container">
				<p style="text-decoration: underline">
					{{ $t('orders.customerInfo') }}:
				</p>
				<div v-if="order.client.fullName">
					<p>{{ $t('users.name') }}:</p>
					<span>{{ order.client.fullName }}</span>
				</div>
				<div v-else>
					<p>{{ $t('users.commercialName') }}:</p>
					<span>{{ order.client.juridicalName }}</span>
				</div>
				<div>
					<p>{{ $t('users.phoneNumber') }}:</p>
					{{ order.client.phoneNumber }}
				</div>
				<div v-if="role != 'courier'">
					<p>{{ $t('global.email') }}:</p>
					{{ order.client.email }}
				</div>
				<div>
					<div>
						<p v-if="order.client.identity">
							{{ $t('users.personalId') }}:
						</p>
						{{ order.client.identity }}
					</div>
					<div>
						<p v-if="order.client.identificationNumber">
							{{ $t('users.companyId') }}:
						</p>
						{{ order.client.identificationNumber }}
					</div>
				</div>
			</div>
			<div
				id="second-inner-container"
				class="client-inner-container"
				style="margin-top: 21px"
			>
				<div>
					<p>{{ $t('orders.paymentMethod') }}:</p>
					{{ order.paymentType }}
				</div>
				<div>
					<p>{{ $t('address.address') }}:</p>
					<p style="max-width: 250px;">{{ order.client.address }}</p>
				</div>
			</div>
		</div>
		<div
			v-if="order.comment"
			class="bg-white d-inline-block p-1 mr-1 rounded comment-container"
		>
			<p class="mb-0" style="font-weight: 800; text-decoration: underline">
				{{ $t('orders.orderComment') }}:
			</p>
			{{ order.comment }}
		</div>
		<div
			v-if="order.callCenterFullName"
			class="bg-white d-inline-block p-1 mr-1 rounded comment-container"
		>
			<p class="mb-0" style="font-weight: 800; text-decoration: underline">
				{{ $t('orders.orderManager') }}:
			</p>
			{{ order.callCenterFullName }}
		</div>
		<div class="bg-white p-1 rounded comment-container mr-1">
			<p class="mb-0">
				{{ $t('orders.cardPayment') }}: {{ totalByCard.toFixed(2) }} ₾
			</p>
			<p class="mb-0">
				{{ $t('orders.cashPayment') }}: {{ totalByCash.toFixed(2) }} ₾
			</p>
		</div>
		<div
			v-if="role === 'admin' || role === 'callCenterManager'"
			class="bg-white p-1 rounded comment-container"
		>
			<p class="mb-0">
			{{ $t('promos.promoCode') }}: {{ order.promoCode }}
			</p>
			<p class="mb-0">
				{{ $t('promos.promo_type') }}: {{ typeMap[order.promoCodeType] }}
			</p>
			<p class="mb-0">
				{{ $t('promos.promo_order_using') }}:
				{{ order.promoCodeUsed ? $t('global.yes') : $t('promos.no') }}
			</p>
		</div>
	</div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
	name: 'ClientInfoComment',
	props: {
		order: Object,
		role: String,
		totalByCard: Number,
		totalByCash: Number,
	},
	data() {
		return {
			typeMap: {
				FreeDelivery: this.$i18n.t('promos.free_delivery'),
				Cart: this.$i18n.t('global.cart'),
			},
		};
	},
};
</script>

<style lang="scss">
.client-info-container {
	display: flex;
	align-items: start;
	flex-direction: column;
	.client-container {
		margin-bottom: 1rem;
	}

	@media (min-width: 640px) {
		flex-direction: row;

		.client-container {
			margin-bottom: 0rem;
		}
	}
}
.comment-container {
	width: 100%;
	max-width: 300px;
}

.client-inner-container {
	display: flex;
	flex-direction: column;

	p {
		min-width: 185px;
	}
}

#second-inner-container {
	p{
		min-width: 144px;
	}
}

.client-container {
	width: 100%;
	max-width: fit-content;
	div {
		display: flex;
	}
	p {
		margin-bottom: 0;
		font-weight: 800;
	}

	@media (min-width: 640px) {
		display: flex;
		flex-direction: row;
		max-width: fit-content;
		#second-inner-container {
			margin-left: 2rem;
		}
	}
}
</style>
