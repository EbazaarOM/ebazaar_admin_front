<template>
	<div class="d-flex">
		<div class="input mr-1" style="width: 225px">
			<label>{{ $t('global.start') }}:</label>
			<datetime
				v-model="startDateInput"
				type="datetime"
				:placeholder="$t('global.start')"
				input-class="dateTime"
			/>
		</div>
		<div class="input" style="width: 225px">
			<label>{{ $t('global.end') }}:</label>
			<datetime
				v-model="endDateInput"
				type="datetime"
				:placeholder="$t('global.end')"
				input-class="dateTime"
			/>
		</div>
	</div>
</template>

<script>
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

export default {
	name: 'DatesSelector',
	components: {
		Datetime,
	},
	props: {
		startDate: {
			type: String,
			default: '',
		},
		endDate: {
			type: String,
			default: '',
		},
	},
	computed: {
		startDateInput: {
			get() {
				return this.startDate;
			},
			set(val) {
				this.$emit('update:startDate', val);
			},
		},
		endDateInput: {
			get() {
				return this.endDate;
			},
			set(val) {
				this.$emit('update:endDate', val);
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
