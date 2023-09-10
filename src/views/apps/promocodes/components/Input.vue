<template>
	<div class="input">
		<label for="name">{{ title }}</label>
		<b-form-input
			v-model="inputHandler"
			:name="title"
			:type="inputType"
			:placeholder="placeholder"
			style="width: 255px"
		/>
	</div>
</template>

<script>
import { BFormInput } from 'bootstrap-vue';

export default {
	name: 'Input',
	components: {
		BFormInput,
	},
	props: {
		title: {
			type: String,
			default: '',
		},
		// eslint-disable-next-line vue/require-default-prop
		inputModel: {
			type: [String, Number],
		},
		placeholder: {
			type: String,
			default: '',
		},
		inputType: {
			type: String,
			default: '',
		},
	},
	computed: {
		inputHandler: {
			get() {
				return this.inputModel;
			},
			set(val) {
				this.$emit('update:inputModel', val);
			},
		},
	},
};
</script>

<style>
.dateTime {
	padding: 0.5rem;
	border-radius: 0.357rem;
	width: 100%;
	border: 1px solid #d8d6de;
	height: 2.714rem;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.45;
	color: #6e6b7b;
}
</style>
