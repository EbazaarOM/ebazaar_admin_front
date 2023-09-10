<template>
	<div>
		<div class="d-flex">
			<b-form-radio
				v-model="daysSelected"
				name="some-radios3"
				:value="true"
				class="mr-2 custom-control-success"
				style="cursor: pointer"
			>
				{{ $t('statistics.daily') }}
			</b-form-radio>
			<b-form-radio
				v-model="daysSelected"
				name="some-radios3"
				:value="false"
				class="custom-control-primary"
				style="cursor: pointer"
			>
				{{ $t('statistics.monthly') }}
			</b-form-radio>
		</div>
		<LineChartComponent
			v-if="daysSelected"
			:render-chat="renderChat"
			:chart-data="chartData"
			:chart-options="chartOptions"
		/>
		<BarChartComponent
			v-if="!daysSelected"
			:render-chat="renderChat"
			:chart-data="chartDataMonths"
			:chart-options="chartOptions"
		/>
		<!-- counters -->
		<LineChartComponent
			v-if="daysSelected"
			:render-chat="renderChat"
			:chart-data="countChartData"
			:chart-options="countChartOptions"
		/>
		<BarChartComponent
			v-if="!daysSelected"
			:render-chat="renderChat"
			:chart-data="countChartDataMonths"
			:chart-options="countChartOptions"
		/>
		<!-- deliveries -->
		<LineChartComponent
			v-if="daysSelected && role !== 'farmer' && role !== 'consul'"
			:render-chat="renderChat"
			:chart-data="deliveryChartData"
			:chart-options="chartOptions"
		/>
		<BarChartComponent
			v-if="!daysSelected && role !== 'farmer' && role !== 'consul'"
			:render-chat="renderChat"
			:chart-data="deliveryChartDataMonths"
			:chart-options="chartOptions"
		/>
		<!-- bonus -->
		<BarChartComponent
			v-if="role === 'consul' || role === 'admin'"
			:render-chat="renderChat"
			:chart-data="bonusChartData"
			:chart-options="chartOptions"
		/>
	</div>
</template>
<script>
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable  */
import { Line } from 'vue-chartjs';
import moment from 'moment';
import _ from 'lodash';
import { BFormRadio } from 'bootstrap-vue';
import store from '@/store';
import LineChartComponent from './LineChartComponent.vue';
import BarChartComponent from './BarChartComponent.vue';

export default {
	components: {
		LineChartComponent,
		BarChartComponent,
		BFormRadio,
	},
	extends: Line,
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
	data() {
		return {
			daysSelected: true,
			dataToPass: {},
			loadingChart: false,
			currentSelectedMonth: 6,
			renderChat: 0,
			role: '',
			labels: [],
			dateTo: '',
			dateFrom: '',
			chartDataBuffer: {},
			bonusChartData: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.bonus'),
						backgroundColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			deliveryChartDataMonths: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.deliveryAmount'),
						backgroundColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			deliveryChartData: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.deliveryAmount'),
						borderColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			countChartDataMonths: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.ordersAmount'),
						backgroundColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			countChartData: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.ordersAmount'),
						borderColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			chartDataMonths: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.profit'),
						backgroundColor: '#9B93F4',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
					{
						label: this.$i18n.t('statistics.turnover'),
						backgroundColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			chartData: {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.profit'),
						borderColor: '#9B93F4',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
					{
						label: this.$i18n.t('statistics.turnover'),
						borderColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			},
			lang: '',
			countChartOptions: {
				responsive: true,
				maintainAspectRatio: false,
				backgroundColor: false,
				hover: {
					mode: 'label',
				},
				animation: {
					duration: 500,
				},
				layout: {
					padding: {
						top: 10,
						bottom: 25,
						left: -20,
					},
				},
				scales: {
					xAxes: [
						{
							display: true,
							scaleLabel: {
								display: true,
							},
						},
					],
					yAxes: [
						{
							beginAtZero: true,
							display: true,
							scaleLabel: {
								display: true,
							},
						},
					],
				},
				legend: {
					position: 'top',
					align: 'start',
					labels: {
						usePointStyle: true,
						padding: 25,
						boxWidth: 9,
					},
				},
			},
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
				backgroundColor: false,
				hover: {
					mode: 'label',
				},
				animation: {
					duration: 500,
				},
				layout: {
					padding: {
						top: 10,
						bottom: 25,
						left: -20,
					},
				},
				scales: {
					xAxes: [
						{
							display: true,
							scaleLabel: {
								display: true,
							},
						},
					],
					yAxes: [
						{
							beginAtZero: true,
							display: true,
							scaleLabel: {
								display: true,
							},
							ticks: {
								min: 0,
								// Include a dollar sign in the ticks
								callback(value) {
									return `${value} ₾`;
								},
							},
						},
					],
				},
				legend: {
					position: 'top',
					align: 'start',
					labels: {
						usePointStyle: true,
						padding: 25,
						boxWidth: 9,
					},
				},
			},
		};
	},
	watch: {
		startDate(newVal) {
			let from = '';
			let to = '';
			from = newVal === '' ? '' : moment(newVal).utc().format();
			to =
				this.endDate === ''
					? ''
					: moment(this.endDate).add(1, 'days').utc().format();
			this.getInitialChartDetails(from, to);
			if (this.role === 'admin' || this.role === 'consul')
				this.fetchBonuses(from, to);
			if (this.role !== 'farmer' && this.role !== 'consul')
				this.fetchDeliveries(from, to);
		},
		endDate(newVal) {
			let from = '';
			let to = '';
			from = this.startDate === '' ? '' : moment(this.startDate).utc().format();
			to = newVal === '' ? '' : moment(newVal).add(1, 'days').utc().format();
			this.getInitialChartDetails(from, to);
			if (this.role === 'admin' || this.role === 'consul')
				this.fetchBonuses(from, to);
			if (this.role !== 'farmer' && this.role !== 'consul')
				this.fetchDeliveries(from, to);
		},
	},
	mounted() {
		this.role = localStorage.getItem('role');
		this.lang = localStorage.getItem('lang');
		this.handleDatasets();
	},
	methods: {
		highlightButton(val) {
			return this.currentSelectedMonth === val ? 'success' : 'light';
		},
		toggleMode() {
			this.daysSelected = !this.daysSelected;
			this.renderChat++;
		},
		//
		fetchDeliveries(startDate, endDate) {
			this.deliveryChartData.datasets[0].data = [];
			store
				.dispatch('app-stats/fetchDeliveries', {
					dateFrom: startDate,
					dateTo: endDate,
				})
				// eslint-disable-next-line no-loop-func
				.then((response) => {
					if (this.startDate !== '') {
						// this.handleResult(response);
						this.handleDeliveries(response);
					}
				})
				.catch((err) => {
					console.log(`error calingn deliveries with`, err);
					alert(err);
				});
		},
		fetchBonuses(dateFrom = '', dateTo = '') {
			const role = localStorage.getItem('role');
			store
				.dispatch('app-stats/fetchBonuses', {
					role,
					dateFrom,
					dateTo,
				})
				.then((response) => {
					console.log('bonuses', response);
					this.handleBonuses(response);
				})
				.catch((err) => {
					console.log(err);
					alert(err);
				});
		},
		handleBonuses(response) {
			this.bonusChartData.labels = [];
			this.bonusChartData.datasets[0].data = [];
			const bonuses = [...response];

			bonuses.forEach((bonus) => {
				bonus.month = moment(bonus.date)
					.lang(this.lang)
					.startOf('month')
					.format('MMMM YY');
				this.bonusChartData.labels.push(bonus.month);
				this.bonusChartData.datasets[0].data.push(bonus.bonusAmount);
			});
		},
		handleDeliveries(response) {
			let datesToPass = [];
			let monthToPass = [];
			let labels = [];
			let labelsMonth = [];
			let grouped = [];
			let groupedMonth = [];
			let missingMonths = [];

			let endDate = this.endDate;
			if (this.endDate === '') endDate = moment().format('YYYY-MM-DD');
			// get missing dates
			const missingDates = this.getDates(this.startDate, endDate);

			let combined = [...response, ...missingDates];
			combined.forEach((prod) => {
				if (!prod.hasOwnProperty('sellingMonth')) {
					prod.sellingMonth = moment(prod.createDate)
						.lang(this.lang)
						.startOf('month')
						.format('YYYY-MM-DD');
					prod.sellingDate = prod.createDate.split('T')[0];
				}
			});

			// gorup by dates and months;
			grouped = _.groupBy(combined, (prod) => prod.sellingDate);
			groupedMonth = _.groupBy(combined, (prod) => prod.sellingMonth);

			const handleSortingAndLabels = (arr, labels, toPass, type) => {
				let datesToArray = Object.entries(arr);
				datesToArray.sort((a, b) => {
					return new Date(a[0]) - new Date(b[0]);
				});
				// handle object entries
				datesToArray.forEach((e) => {
					const longMonth = moment(e[0])
						.subtract('month')
						.lang(this.lang)
						.format('MMMM');
					const month = moment(e[0])
						.subtract('month')
						.lang(this.lang)
						.format('MMM');
					const day = moment(e[0]).subtract('day').lang(this.lang).format('DD');
					const year = moment(e[0])
						.subtract('day')
						.lang(this.lang)
						.format('YY');
					const longYear = moment(e[0])
						.subtract('day')
						.lang(this.lang)
						.format('YYYY');
					if (type === 'dates') {
						labels.push(`${day} ${month} ${year}`);
					} else if (type === 'months') {
						labels.push(`${longMonth} ${longYear}`);
					}
					// or
					// labels.push(e[0]);
					toPass.push(e[1]);
				});
			};
			handleSortingAndLabels(grouped, labels, datesToPass, 'dates');
			handleSortingAndLabels(groupedMonth, labelsMonth, monthToPass, 'months');
			//

			// assign labels and pass arr to assign to correct datasets;
			this.resetDeliveryData();

			this.deliveryChartData.labels = labels;
			this.deliveryChartDataMonths.labels = labelsMonth;

			const handleData = (arr, recepient) => {
				arr.forEach((e) => {
					let totalDeliveryAmount = 0;
					e.forEach((t) => {
						totalDeliveryAmount += t.deliveryAmount;
					});
					recepient.datasets[0].data.push(totalDeliveryAmount.toFixed(2));
					totalDeliveryAmount = 0;
				});
			};

			handleData(datesToPass, this.deliveryChartData);
			handleData(monthToPass, this.deliveryChartDataMonths);

			combined = [];
		},
		resetDeliveryData() {
			this.deliveryChartDataMonths = {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.deliveryAmount'),
						backgroundColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			};
			this.deliveryChartData = {
				labels: [],
				datasets: [
					{
						label: this.$i18n.t('statistics.deliveryAmount'),
						borderColor: '#29C76F',
						fillCollor: '#ffff00',
						data: [],
						display: true,
					},
				],
			};
		},
		//
		getInitialChartDetails(startDate, endDate) {
			this.handleDatasets();
			this.chartData.datasets[0].data = [];
			this.chartData.labels = [];
			this.countChartData.datasets[0].data = [];
			this.countChartData.labels = [];
			let role = this.role;
			if (role === 'callCenterManager') role = 'call_center';
			store
				.dispatch('app-stats/fetchPercieseStats', {
					role,
					dateFrom: startDate,
					dateTo: endDate,
				})
				// eslint-disable-next-line no-loop-func
				.then((response) => {
					if (this.startDate !== '') {
						this.handleResult(response);
					}
				})
				.catch((err) => {
					console.log(`error calingn products with`, err);
					alert(err);
				});
		},
		getDates(startDate, stopDate) {
			const dateArray = [];
			const missingDates = [];
			var currentDate = moment(startDate);
			var stopDate = moment(stopDate);
			while (currentDate <= stopDate) {
				dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
				currentDate = moment(currentDate).add(1, 'days');
			}
			dateArray.forEach((e) => {
				missingDates.push({
					distinctQuantity: 0,
					flowAmount: 0,
					incomeAmount: 0,
					orderId: '',
					quantity: 0,
					sellingDate: e,
					deliveryAmount: 0,
					sellingMonth: moment(e)
						.lang(this.lang)
						.startOf('month')
						.format('YYYY-MM-DD'),
				});
			});

			return missingDates;
		},
		handleResult(response) {
			this.chartData.datasets[0].data = [];
			this.chartData.datasets[1].data = [];
			this.chartDataMonths.datasets[1].data = [];
			this.chartDataMonths.datasets[0].data = [];
			this.chartData.labels = [];
			this.countChartData.labels = [];
			this.chartDataMonths.labels = [];
			this.countChartDataMonths.labels = [];

			let datesToPass = [];
			let monthToPass = [];
			let labels = [];
			let labelsMonth = [];
			let grouped = [];
			let groupedMonth = [];
			let missingMonths = [];
			let endDate = this.endDate;
			if (this.endDate === '') endDate = moment().format('YYYY-MM-DD');
			// get missing dates
			const missingDates = this.getDates(this.startDate, endDate);
			// combine missing dates with existing
			// const byOrderId = _.groupBy(response, prod => prod.orderId);
			let combined = [...response, ...missingDates];
			//
			// get date groups
			combined.forEach((prod) => {
				if (!prod.hasOwnProperty('sellingMonth')) {
					prod.sellingMonth = moment(prod.sellingDate)
						.lang(this.lang)
						.startOf('month')
						.format('YYYY-MM-DD');
				}
				// group by date;
				let date;
				date = prod.sellingDate.split('T')[0];
				if (grouped[date]) {
					grouped[date].push(prod);
				} else {
					grouped[date] = [prod];
				}
				// group by month;
				let month;
				date = prod.sellingMonth;
				if (groupedMonth[date]) {
					groupedMonth[date].push(prod);
				} else {
					groupedMonth[date] = [prod];
				}
			});
			//
			const handleSortingAndLabels = (arr, labels, toPass, type) => {
				let datesToArray = Object.entries(arr);
				datesToArray.sort((a, b) => {
					return new Date(a[0]) - new Date(b[0]);
				});
				// handle object entries
				datesToArray.forEach((e) => {
					const longMonth = moment(e[0])
						.subtract('month')
						.lang(this.lang)
						.format('MMMM');
					const month = moment(e[0])
						.subtract('month')
						.lang(this.lang)
						.format('MMM');
					const day = moment(e[0]).subtract('day').lang(this.lang).format('DD');
					const year = moment(e[0])
						.subtract('day')
						.lang(this.lang)
						.format('YY');
					const longYear = moment(e[0])
						.subtract('day')
						.lang(this.lang)
						.format('YYYY');
					if (type === 'dates') {
						labels.push(`${day} ${month} ${year}`);
					} else if (type === 'months') {
						labels.push(`${longMonth} ${longYear}`);
					}
					// or
					// labels.push(e[0]);
					toPass.push(e[1]);
				});
			};
			handleSortingAndLabels(grouped, labels, datesToPass, 'dates');
			handleSortingAndLabels(groupedMonth, labelsMonth, monthToPass, 'months');
			//
			console.log(grouped);

			// assign labels and pass arr to assign to correct datasets;
			this.chartData.labels = labels;
			this.countChartData.labels = labels;
			this.chartDataMonths.labels = labelsMonth;
			this.countChartDataMonths.labels = labelsMonth;

			this.handleAssigningValues(datesToPass, monthToPass);
			combined = [];
		},
		handleAssigningValues(arr, month) {
			if (
				this.role === 'admin' ||
				this.role === 'consul' ||
				this.role === 'callCenterManager'
			) {
				let totalIncome = 0;
				let totalFlow = 0;
				// let totalBonus = 0;
				let totalDeliveryAmount = 0;
				let totalDistinctQuantity = 0;
				let totalQuantity = 0;
				let orderQuantity = [];
				let filterByorderId = [];
				arr.forEach((e) => {
					filterByorderId = e.filter((e) => e.orderId !== '');
					orderQuantity = _.groupBy(filterByorderId, (prod) => prod.orderId);
					e.forEach((e) => {
						totalIncome += e.incomeAmount;
						totalFlow += e.flowAmount;
					});
					this.chartData.datasets[0].data.push(totalIncome.toFixed(2));
					this.chartData.datasets[1].data.push(totalFlow.toFixed(2));
					this.countChartData.datasets[0].data.push(
						Object.keys(orderQuantity).length
					);
					totalIncome = 0;
					totalFlow = 0;
					// totalBonus = 0;
					totalDeliveryAmount = 0;
					totalDistinctQuantity = 0;
					totalQuantity = 0;
					filterByorderId = [];
					orderQuantity = [];
				});
				month.forEach((e) => {
					filterByorderId = e.filter((e) => e.orderId !== '');
					orderQuantity = _.groupBy(filterByorderId, (prod) => prod.orderId);
					e.forEach((e) => {
						totalIncome += e.incomeAmount;
						totalFlow += e.flowAmount;
						totalDistinctQuantity += e.distinctQuantity;
						if (this.role === 'consul') {
							totalQuantity += e.totalQuantity;
						}
					});
					this.chartDataMonths.datasets[0].data.push(totalIncome.toFixed(2));
					this.chartDataMonths.datasets[1].data.push(totalFlow.toFixed(2));
					this.countChartDataMonths.datasets[0].data.push(
						Object.keys(orderQuantity).length
					);
					//
					totalIncome = 0;
					totalFlow = 0;
					totalDistinctQuantity = 0;
					totalQuantity = 0;
					filterByorderId = [];
					orderQuantity = [];
				});
				this.renderChat++;
			}
			if (this.role === 'farmer') {
				let filterByorderId = [];
				let orderQuantity = [];
				let totalIncome = 0;
				arr.forEach((e) => {
					filterByorderId = e.filter((e) => e.orderId !== '');
					orderQuantity = _.groupBy(filterByorderId, (prod) => prod.orderId);
					e.forEach((e) => {
						totalIncome += e.incomeAmount;
					});
					this.chartData.datasets[0].data.push(totalIncome.toFixed(2));
					this.countChartData.datasets[0].data.push(
						Object.keys(orderQuantity).length
					);
					totalIncome = 0;
				});
				month.forEach((e) => {
					filterByorderId = e.filter((e) => e.orderId !== '');
					orderQuantity = _.groupBy(filterByorderId, (prod) => prod.orderId);
					e.forEach((e) => {
						totalIncome += e.incomeAmount;
					});
					this.chartDataMonths.datasets[0].data.push(totalIncome.toFixed(2));
					this.countChartDataMonths.datasets[0].data.push(
						Object.keys(orderQuantity).length
					);
					totalIncome = 0;
				});
				this.renderChat++;
			}
		},
		handleDatasets() {
			if (this.role === 'farmer') {
				this.chartData.datasets[1].hidden = true;
				this.chartData.datasets[1].label = '';
				this.chartDataMonths.datasets[1].hidden = true;
				this.chartDataMonths.datasets[1].label = '';
			}
		},
	},
};
</script>
