<template>
	<b-modal
		id="transaction-info-modal"
		scrollable
		:title="$t('orders.transactionInfo')"
		size="md"
		cancel-disabled
	>
		<div v-if="transactionInfo">
			<p>
        {{ $t('orders.transactionId') }}: {{ transactionInfo.transactionId }}
			</p>
			<p>
        {{ $t('orders.all') }}: {{ transactionInfo.amount }} ₾
			</p>
				<div v-if="transactionInfo.splits" class="mb-1">
					<p class="mb-0">
            {{ $t('orders.splits') }}:
					</p>
					<div v-for="split in transactionInfo.splits" :key="split.amount" class="border p-1 rounded" >
						<p class="m-0">
              {{ $t('orders.farmerAmount') }}: {{ split.amount }} ₾
						</p>
						<p class="m-0">
							Iban:
							{{ split.iban }}
						</p>
					</div>
				</div>
				<p>{{ $t('orders.finalAmount') }}: {{ transactionInfo.finalAmount }} ₾</p>
				<p v-if="transactionInfo.refunded">
          {{ $t('orders.refundAmount') }}: {{ transactionInfo.refunded }} ₾
				</p>
				<p>{{ $t('global.status') }}: {{ transactionInfo.status }}</p>
		</div>
	</b-modal>
</template>

<script>
/* eslint-disable */
/* eslint-disable vue/require-default-prop */
import { BModal } from 'bootstrap-vue';
// import { ref, watch, computed } from '@vue/composition-api';

//
export default {
	name: 'TransactionInfoModal',
	components: {
		BModal,
	},
	props: {
		transactionInfo: Object
	},
};
</script>
