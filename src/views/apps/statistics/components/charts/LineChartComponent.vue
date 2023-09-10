<script>
/* eslint-disable vue/require-default-prop */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// /* eslint-disable  */
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
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
