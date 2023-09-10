<script>
/* eslint-disable vue/require-default-prop */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// /* eslint-disable  */
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    renderChat: Number,
    chartData: Object,
    chartOptions: Object,
  },
  watch: {
    renderChat() {
      this.$data._chart.destroy();
      this.renderChart(this.chartData, this.chartOptions);
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
}
</script>
