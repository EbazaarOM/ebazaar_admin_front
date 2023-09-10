<template>
	<b-modal
		id="add-comment-modal"
		centered
		:title="$t('comment.add')"
		:cancel-title="$t('global.cancel')"
		size="sm"
		:cancel-disabled="isProductComment"
		:no-close-on-backdrop="isProductComment"
		:no-close-on-esc="isProductComment"
		:hide-header-close="isProductComment"
		cancel-variant="outline-secondary"
		@ok="addComment(order)"
	>
	<!-- dradada -->
	<label for="comment-input">{{ $t('comment.comment') }}:</label>
		<b-form-textarea
			id="comment-input"
			v-model="commentInput"
			rows="5"
			:placeholder="$t('comment.writeHere')"
		/>
	</b-modal>
</template>

<script>
/* eslint-disable */
/* eslint-disable vue/require-default-prop */
import { BModal, BFormTextarea } from 'bootstrap-vue';
// import { ref, watch, computed } from '@vue/composition-api';

//
export default {
	name: 'AddCommentModal',
	components: {
		BModal,
		BFormTextarea
	},
	props: {
		comment: {
			type: String,
			default: "",
		},
		order: Object,
		addComment: Function,
		isProductComment:{
			type: Boolean,
			default: false,
		},
	},

	methods: {
		//
	},
	computed: {
		commentInput:{
			get() {
        return this.comment;
      },
      set(val) {
        this.$emit('update:comment', val);
      }
		}
	}
};
</script>

<style>

</style>
