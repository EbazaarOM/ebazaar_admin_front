<template>
	<b-modal
		id="add-comment-on-product-modal"
		centered
		:title="$t('comment.add')"
		:cancel-title="$t('global.cancel')"
		size="sm"
		cancel-disabled
		no-close-on-backdrop
		no-close-on-esc
		hide-header-close
		cancel-variant
		@ok="setOrderProductStatus()"
	>
	<!-- dradada -->
	<label for="comment-input">{{ $t('comment.comment') }}:</label>
		<b-form-textarea
			id="comment-input"
			v-model="productToComment.comment"
			rows="5"
			:placeholder="$t('comment.writeHere')"
		/>
	</b-modal>
</template>

<script>
/* eslint-disable */
import { BModal, BFormTextarea } from 'bootstrap-vue';
import { onUnmounted } from '@vue/composition-api';
import orderStoreModule from '../orderStoreModule';
import store from '@/store';
import { watch } from '@vue/composition-api';

//
export default {
	name: 'AddCommentModal',
	components: {
		BModal,
		BFormTextarea
	},
	props: {
		refetchData: Function,
		product: Object,
	},
	data(){
		return{
			productToComment: {},
		}
	},

	watch: {
		product(newVal) {
			this.productToComment = newVal;
		},
	},

	methods: {
		setOrderProductStatus(prod) {
			const product = {
				orderId: this.productToComment.orderId,
				prodId: this.productToComment.id,
				comment: this.productToComment.comment,
				status: this.productToComment.status,
			};
			// eslint-disable-next-line no-console
			store
				.dispatch('app-orders/setOrderProductStatus', product)
				.then(() => {
					this.refetchData();
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('error changing status', err.response);
					// eslint-disable-next-line no-alert
					alert('შეცდომა პროდუქტის სტატუსის შეცვლისას.');
				});
		},
	},
	setup(props) {
		const Order_APP_STORE_MODULE_NAME = 'app-orders';

		// Register module
		if (!store.hasModule(Order_APP_STORE_MODULE_NAME)) {
			store.registerModule(Order_APP_STORE_MODULE_NAME, orderStoreModule);
		}
	}
};
</script>

<style>

</style>
