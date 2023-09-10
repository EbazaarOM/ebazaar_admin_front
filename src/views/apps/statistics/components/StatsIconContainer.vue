<!-- eslint-disable vue/html-self-closing -->
<template>
	<div class="stats-icon-container">
		<div class="stats-icon-image">
			<img :src="require(`@/assets/images/statistics/${image}.png`)" />
		</div>
		<div clas="icon-texts d-flex fled-direction-column">
			<p class="number">
				{{ count }}<span v-if="currency"> ₾</span>
			</p>
			<p class="subtext">
				{{ title }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'StatsIconContainer',
	props: {
		image: {
			type: String,
			default: '',
		},
		count: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
			default: '',
		},
		currency: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss">
.stats-icon-container {
	display: flex;
	margin: 1rem;

	width: 100%;
	max-width: 255px;

	.stats-icon-image {
		margin-right: 1rem;
	}
	p {
		margin: 0;
		padding: 0;
	}
	.number {
		margin-bottom: 0.5rem;
		font-weight: 700;
		font-size: 1.3rem;
		color: #4f4f4f;
	}

	.subtext {
		color: #9d9d9d;
		font-weight: 700;
		font-size: 0.95rem;
	}
}
</style>
