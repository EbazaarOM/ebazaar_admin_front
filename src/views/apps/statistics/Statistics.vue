<template>
	<div>
		<HorizontalNavbar />
    <b-card no-body class="mb-0">
      <div class="px-1 py-1 statistics-title">
        <h5 class="mb-0">
          {{ $t('statistics.title') }}
        </h5>
      </div>
      <div>
        <ProductsTable
          v-if="role !== 'callCenterManager'"
          :prod-stats="prodStats"
          :datepicker-enabled="false"
          :user-stats="userStats"
        />
        <div class="p-1 shadow" style="margin: 0.25rem">
          <SoldProductsTable
            v-if="soldStats"
            :prod-stats="soldStats"
            :handle-from-change="handleFromChange"
            :handle-to-change="handleToChange"
            :datepicker-enabled="true"
          />
          <DeniedProductsTable
            v-if="role !== 'callCenterManager'"
            :prod-stats="deniedStats"
            :datepicker-enabled="false"
          />
        </div>
        <div class="p-2 mt-1 shadow" style="margin: 0.25rem">
          <!-- <LineChart /> -->
          <Charts
            :start-date="dateFrom"
            :end-date="dateTo"
          />
        </div>
      </div>
    </b-card>

  </div>
</template>

<script>
/* eslint-disable  */
import { BCard } from 'bootstrap-vue';
import { onUnmounted } from '@vue/composition-api';
import moment from 'moment'
import store from '@/store';
import statisticsStoreModule from './statisticsStoreModule';
// components
import HorizontalNavbar from '../../navbar/HorizontalNavbar.vue';
import ProductsTable from './components/tables/ProductsTable.vue'
import SoldProductsTable from './components/tables/SoldProductsTable.vue'
import DeniedProductsTable from './components/tables/DeniedProductsTable.vue'
// charts
import LineChart from './components/charts/LineChart.vue'
import Charts from './components/charts/Charts.vue'

export default {
  name: "Statistics",

  components: {
		HorizontalNavbar,
    ProductsTable,
    SoldProductsTable,
    DeniedProductsTable,
    LineChart,
    Charts,
    BCard
  },
  data() {
    return {
      role: '',
      prodStats: {},
      deniedStats: {},
      soldStats: {},
      userStats: {},
      // filters
      dateTo: '',
      dateFrom: '',
    }
  },
  mounted() {
    this.role = localStorage.getItem('role');
		console.log('My role is ', this.role);
    this.fetchStatsWithDate('sold','', '', true);
    if (this.role !== 'callCenterManager') {
      this.fetchStatsWithDate('products');
      this.fetchStatsWithDate('denied');
      this.getUserStats();
    }
  },
  methods: {
    fetchStatsWithDate(callName, dateFrom = '', dateTo = '', initial = false) {
      if( initial ){
        dateFrom = '';
        dateTo = '';
      } else {
        dateFrom = dateFrom === '' ? moment().utc().format() : moment(dateFrom).utc().format();
        dateTo = dateTo === '' ?  moment().utc().format() : moment(dateTo).add(1, 'days').utc().format();
      }
			store
			.dispatch('app-stats/fetchStats', {
        callName,
        role: this.role,
        dateFrom,
        dateTo,
      })
			.then((response) => {
        console.log(callName, response);
        // eslint-disable-next-line default-case
        switch (callName) {
          case 'sold':
          this.soldStats = {};
          this.soldStats = response;
          break;
          case 'products':
          this.prodStats = {};
          this.prodStats = response;
          break;
          case 'denied':
          this.deniedStats = {};
          this.deniedStats = response;
          break;
        }
			})
			.catch((err) => {
        console.log(`error calingn products with -  ${callName} call`, err.response);
        alert('შეცდომა ჩატვირთვისას.');
			});
		},
    handleFromChange(e) {
      this.dateFrom = e;
      this.fetchStatsWithDate('sold', this.dateFrom, this.dateTo);
      if (this.role !== 'callCenterManager') this.fetchStatsWithDate('denied', this.dateFrom, this.dateTo);
    },
    handleToChange(e) {
      this.dateTo = e;
      this.fetchStatsWithDate('sold', this.dateFrom, this.dateTo);
      if (this.role !== 'callCenterManager') this.fetchStatsWithDate('denied', this.dateFrom, this.dateTo);
    },
    getUserStats() {
      if (this.role === 'admin' || this.role === 'consul') {
        store
        .dispatch('app-stats/getUserStats', this.role)
        .then((response) => {
          console.log('userStats', response);
          this.userStats = response;
        })
        .catch((e) => {
          console.log('error getting user stats', e.response);
          alert('შეცდომა ჩატვირთვისას.');
        })
      }
    },
  },
  setup() {
		const STATS_APP_STORE_MODULE_NAME = 'app-stats';

		// Register module
		if (!store.hasModule(STATS_APP_STORE_MODULE_NAME)) {
			store.registerModule(STATS_APP_STORE_MODULE_NAME, statisticsStoreModule);
		}

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(STATS_APP_STORE_MODULE_NAME)) {
				store.unregisterModule(STATS_APP_STORE_MODULE_NAME);
			}
		});
	},
}
</script>

<style lang="scss">
[dir] th{
  background: #f6f6f6 !important;
  color: #6e6b7b !important;
}

.statistics-title {
  background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
  border-top-left-radius: 0.428rem;
  border-top-right-radius: 0.428rem;

  h5 {
    color: white;
  }
}

</style>
