<template>
  <div>
    <div class="d-flex flex-wrap items-center">
      <b-button size="sm mr-1" :disabled="loadingChart" @click="updateChart(12)" :variant="highlightButton(12)">
        12 თვე
      </b-button>
      <b-button size="sm mr-1" :disabled="loadingChart" @click="updateChart(9)" :variant="highlightButton(9)" >
        9 თვე
      </b-button>
      <b-button size="sm mr-1" :disabled="loadingChart" @click="updateChart(6)" :variant="highlightButton(6)">
        6 თვე
      </b-button>
      <b-button size="sm mr-1" :disabled="loadingChart" @click="updateChart(3)" :variant="highlightButton(3)">
        3 თვე
      </b-button>
    </div>
    <LineChartComponent
      :render-chat="renderChat"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    <LineChartComponent
      :v-if="role !== 'farmer'"
      :render-chat="renderChat"
      :chart-data="countChartData"
      :chart-options="countChartOptions"
    />
  </div>
</template>
<script>
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// /* eslint-disable  */
import { Line } from 'vue-chartjs'
import moment from 'moment';
import {
  BButton,
} from 'bootstrap-vue';
import store from '@/store';
import LineChartComponent from './LineChartComponent.vue';

export default {
  components: {
    LineChartComponent,
    BButton,
  },
  extends: Line,
  data() {
    return {
      loadingChart: false,
      currentSelectedMonth: 6,
      renderChat: 0,
      role: '',
      labels: [],
      dateTo: '',
      dateFrom: '',
      chartDataBuffer: {},
      countChartData: {
        labels: [],
        datasets: [
          {
            label: (localStorage.getItem('role') === 'consul') ? 'პროდუქტების რაოდენობა' : 'შეკვეთბის რაოდენობა',
            backgroundColor: '#29C76F',
            fillCollor: '#ffff00',
            data: [],
            display: true,
          },
        ]
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'შემოსავალი',
            borderColor: '#9B93F4',
            fillCollor: '#ffff00',
            data: [],
            display: true,
          },
          {
            label: 'ბრუნვა',
            backgroundColor: '#29C76F',
            fillCollor: '#ffff00',
            data: [],
            display: true,
          },
          {
            label: 'ბონუსი',
            backgroundColor: '#EA5354',
            fillCollor: '#ffff00',
            data: [],
            display: true,
          },
          {
            label: 'მიტანის თანხა',
            backgroundColor: '#FFE019',
            fillCollor: '#ffff00',
            data: [],
            display: true,
          }
        ]
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
                // Include a dollar sign in the ticks
                callback(value) {
                  return `${value} ₾`;
                }
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
    }
  },
  mounted() {
    this.role = localStorage.getItem('role');
    this.lang = localStorage.getItem('lang');
    this.getInitialChartDetails('sold');
  },
    methods: {
    highlightButton(val) {
      return (this.currentSelectedMonth === val) ? 'success' : 'light';
    },
    getInitialChartDetails(callName, months = 6) {
      this.handleDatasets();
      this.chartData.datasets[0].data = [];
      this.chartData.labels = [];
      this.countChartData.datasets[0].data = [];
      this.countChartData.labels = [];
      let month; let year; let startDate; let endDate; let monthName;
      const { role } = this;
      for (let i = 0; i < months; i++) {
        month = moment().subtract(i, 'months').format('MM');
        year = moment().subtract(i, 'months').format('YYYY');
        startDate = moment([year, month - 1]).format('YYYY-MM-DD');
        endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        store
        .dispatch('app-stats/fetchStats', {
          callName,
          role: this.role,
          dateFrom: startDate,
          dateTo: endDate,
        })
        // eslint-disable-next-line no-loop-func
        .then((response) => {
          if (role === 'farmer') {
            this.chartData.datasets[0].data[months - i - 1] = response.incomeAmount;
          }
          if (role === 'consul') {
            this.chartData.datasets[0].data[months - i - 1] = response.incomeAmount;
            this.chartData.datasets[1].data[months - i - 1] = response.flowAmount;
            this.chartData.datasets[2].data[months - i - 1] = response.bonusAmount;
            this.countChartData.datasets[0].data[months - i - 1] = response.productCount;
          }
          if (role === 'admin') {
            this.chartData.datasets[0].data[months - i - 1] = response.totalIncomeAmount;
            this.chartData.datasets[1].data[months - i - 1] = response.totalFlowAmount;
            this.chartData.datasets[2].data[months - i - 1] = response.totalBonusAmount;
            this.chartData.datasets[3].data[months - i - 1] = response.totalDeliveryAmount;
            this.countChartData.datasets[0].data[months - i - 1] = response.totalOrderCount;
          }
          if (role === 'callCenterManager') {
            this.chartData.datasets[0].data[months - i - 1] = response.incomeAmount;
            this.chartData.datasets[1].data[months - i - 1] = response.flowAmount;
            this.chartData.datasets[3].data[months - i - 1] = response.totalDeliveryAmount;
            this.countChartData.datasets[0].data[months - i - 1] = response.ordersCount;
          }
          monthName = moment().subtract(i, 'months').lang(this.lang).format('MMMM');
          this.chartData.labels[months - i - 1] = monthName;
          this.countChartData.labels[months - i - 1] = monthName;
          this.renderChat++;
        })
        .catch((err) => {
          console.log(`error calingn products with -  ${callName} call`, err.response);
          alert('შეცდომა ჩატვირთვისას.');
        });
      }
		},
    updateChart(months) {
      this.currentSelectedMonth = months;
      this.loadingChart = true;
      this.getInitialChartDetails('sold', months)
      window.setTimeout(() => {
        this.loadingChart = false
      }, 1000);
    },
    handleDatasets() {
      if (this.role === 'farmer') {
        this.chartData.datasets[1].hidden = true;
        this.chartData.datasets[2].hidden = true;
        this.chartData.datasets[3].hidden = true;
        this.chartData.datasets[1].label = '';
        this.chartData.datasets[2].label = '';
        this.chartData.datasets[3].label = '';
      }
      if (this.role === 'consul') {
        this.chartData.datasets[3].hidden = true;
        this.chartData.datasets[3].label = '';
      }
      if (this.role === 'callCenterManager') {
        this.chartData.datasets[2].label = '';
        this.chartData.datasets[2].hidden = true;
      }
    }
  }
}
</script>
