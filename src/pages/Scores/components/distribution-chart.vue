<script>
import { Bar, HorizontalBar, mixins } from 'vue-chartjs'
import datalabels from 'chartjs-plugin-datalabels'
const { reactiveProp } = mixins

export default {
  name: 'DistributionChart',
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function(value, index, values) {
                    return value + '人'
                  },
                  fontSize: 12
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  fontSize: 16
                }
              }
            ]
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 40,
              bottom: 40
            }
          },
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'end',
              backgroundColor: '#eee',
              borderRadius: 5,
              font: {
                size: '16'
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.addPlugin(datalabels)
    this.renderChart(this.chartData, this.options)
  }
}
</script>
