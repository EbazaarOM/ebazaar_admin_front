<template>
	<div class="input input-type">
		<label for="type">{{ name }}</label>
		<v-select
			v-model="inputHandler"
			:options="optionsList"
			label="title"
			:style="isMultipleEnabled ? 'width: 95%' : 'width: 255px'"
			:multiple="isMultipleEnabled"
			:disabled="disabled"
		>
			<template #option="{ title }" name="type">
				<span>{{ title }}</span>
			</template>
			<!-- <template
				v-else
				#option="{ firstName, lastName, uniqueCode }"
				name="type"
			>
				<span>{{ (firstName, lastName, uniqueCode) }}</span>
			</template> -->
		</v-select>
	</div>
</template>

<script>
import vSelect from 'vue-select';

export default {
	name: 'Input',
	components: {
		vSelect,
	},
	props: {
		name: {
			type: String,
			default: '',
		},
		// eslint-disable-next-line vue/require-default-prop
		inputModel: {
			type: [Array, Object],
		},
		optionsList: {
			type: Array,
			default: () => [],
		},
		isMultipleEnabled: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
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
