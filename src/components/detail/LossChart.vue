<template>
  <div id="chart">
    <apexchart
      type="line"
      height="600"
      :options="chartOpt.options"
      :series="chartOpt.series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  name: "LossChart",
  props: {
    losses: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    series() {
      const epochs = [];
      const trainLosses = [];
      const valLosses = [];

      const sortedLosses = this.losses;
      sortedLosses.sort((a, b) => a.epoch - b.epoch);

      const trainYX = [];
      const valYX = [];

      this.losses.forEach((loss) => {
        if (loss !== undefined) {
          epochs.push(loss.epoch);
          trainLosses.push(loss.trainLoss);
          valLosses.push(loss.validationLoss);
          trainYX.push([loss.epoch + 1, loss.trainLoss]);
          valYX.push([loss.epoch + 1, loss.validationLoss]);
        }
      });

      if (epochs.length === 0)
        return {
          epochs,
          trainLosses,
          valLosses,
          trainInterpolated: [],
          valInterpolated: [],
        };

      const trainResult = this.powerRegressionPredict(trainYX);
      const valResult = this.powerRegressionPredict(valYX);

      return {
        epochs,
        trainLosses,
        valLosses,
        trainInterpolated: trainResult.map((e) => e[1]),
        valInterpolated: valResult.map((e) => e[1]),
      };
    },
    chartOpt() {
      return {
        series: [
          {
            name: "Train Loss",
            data: this.series.trainLosses,
          },
          {
            name: "Validation Loss",
            data: this.series.valLosses,
          },
          {
            name: "Train Loss Trend",
            data: this.series.trainInterpolated,
          },
          {
            name: "Validation Loss Trend",
            data: this.series.valInterpolated,
          },
        ],
        options: {
          chart: {
            type: "line",
            height: 350,
          },
          // colors: [ "#1B998B","#E91E63", "#546E7A", "#2E294E"],
          colors: ["#2983FF", "#EA3546", "#662E9B", "#2E294E"],
          markers: {
            size: [4, 4, 0, 0],
          },
          stroke: {
            width: [2, 2, 2, 2],
            dashArray: [0, 0, 5, 5],
          },
          title: {
            text: "Train vs Validation Losses",
          },
          grid: {
            borderColor: "#111",
            strokeDashArray: 0.3,
          },
          xaxis: {
            categories: this.series.epochs.map((e) => `${e + 1} Epochs`),
          },
          yaxis: {
            labels: {
              formatter: function (y) {
                if (
                  y !== null &&
                  y !== undefined &&
                  !isNaN(y) &&
                  y !== "NaN" &&
                  y !== "none"
                ) {
                  return y.toFixed(4);
                }
                return y;
              },
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            enabledOnSeries: [1, 1, 0, 0],
            y: {
              formatter: function (y) {
                if (
                  y !== null &&
                  y !== undefined &&
                  !isNaN(y) &&
                  y !== "NaN" &&
                  y !== "none"
                ) {
                  return y.toFixed(4);
                }
                return y;
              },
            },
          },
        },
      };
    },
  },
  methods: {
    powerRegressionPredict(data) {
      let sumLogX = 0,
        sumLogY = 0,
        sumLogXLogY = 0,
        sumLogX2 = 0;
      const n = data.length;

      for (let i = 0; i < n; i++) {
        const logX = Math.log(data[i][0]);
        const logY = Math.log(data[i][1]);
        sumLogX += logX;
        sumLogY += logY;
        sumLogXLogY += logX * logY;
        sumLogX2 += logX * logX;
      }

      const b =
        (n * sumLogXLogY - sumLogX * sumLogY) /
        (n * sumLogX2 - sumLogX * sumLogX);
      const a = Math.exp((sumLogY - b * sumLogX) / n);

      // eslint-disable-next-line no-unused-vars
      const predictions = data.map(([x, y]) => {
        return [x, a * Math.pow(x, b)];
      });

      return predictions;
    },
  },
};
</script>
