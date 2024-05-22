<template>
  <b-card class="card-table-container">
    <div class="table-responsive">
      <b-table
        striped
        hover
        :items="sortedLogs"
        :fields="detailFields"
        small
        class="table-wrapper"
        style="width: 100% !important"
        :show-empty="true"
      >
        <template #empty>
          <div class="text-center">
            <b-skeleton width="100%"></b-skeleton>
            <b-skeleton width="100%"></b-skeleton>
            <b-skeleton width="100%"></b-skeleton>
          </div>
        </template>
        <template #cell(status)="row">
          <div class="badge-center">
            <b-badge pill :class="getBadgeVariant(row.item.status)">{{
              row.item.status
            }}</b-badge>
          </div>
        </template>
        <template #cell(detail)="row">
          <div class="text-center clearfix">
            <span v-if="row.item.status.toLowerCase() === 'training'">
              <TrainingStatus
                :epoch="row.item.detail.epoch + 1"
                :maxEpoch="row.item.detail.maxEpoch"
                :is-most-updated="row.item.detail.epoch === maxEpoch"
                :updated-time="row.item.updatedDate"
                :estimated-remaining-time="timeEstimation(row.item.detail)"
                :is-historical="true"
                @click="showLosses"
                :train-name="trainingName"
              />
            </span>
            <span
              v-else-if="row.item.status.toLowerCase() === 'plotting'"
              class="plotting-status"
            >
              <PlottingStatus :detail="row.item.detail" />
            </span>
            <span v-else-if="row.item.status.toLowerCase() === 'prepared'">
              <PreparedStatus />
            </span>
            <span v-else-if="row.item.status.toLowerCase() === 'benchmarking'">
              <BenchmarkingStatus />
            </span>
            <span v-else-if="row.item.status.toLowerCase() === 'error'">
              <ErrorStatus :detail="row.item.detail" />
            </span>
            <span v-else-if="row.item.status.toLowerCase() === 'idle'">
              <IdleStatus />
            </span>
            <span v-else-if="row.item.status.toLowerCase() === 'completed'">
              <CompletedStatus :trainingName="trainingName" />
            </span>
            <span v-else> N/A </span>
          </div>
        </template>
      </b-table>
    </div>
  </b-card>
</template>

<script>
import TrainingStatus from "./detail/TrainingStatus.vue";
import PlottingStatus from "./detail/PlottingStatus.vue";
import PreparedStatus from "./detail/PreparedStatus.vue";
import BenchmarkingStatus from "./detail/BenchmarkingStatus.vue";
import ErrorStatus from "./detail/ErrorStatus.vue";
import IdleStatus from "./detail/IdleStatus.vue";
import CompletedStatus from "./detail/CompletedStatus.vue";
export default {
  name: "HistoryDetails",
  components: {
    TrainingStatus,
    PlottingStatus,
    PreparedStatus,
    BenchmarkingStatus,
    ErrorStatus,
    IdleStatus,
    CompletedStatus,
  },
  props: {
    trainingName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      logs: [],
      detailFields: [
        {
          key: "status",
          label: "Status",
          thStyle: { width: "20%" },
          tdClass: "align-middle",
        },
        {
          key: "detail",
          label: "Detail",
          thStyle: { width: "60%" },
          tdClass: "align-middle",
        },
        {
          key: "updatedDate",
          label: "Updated Date",
          thStyle: { width: "15%" },
          tdClass: "align-middle",
        },
      ],
    };
  },
  created() {
    this.$axios
      .get(this.trainingName + "/log.json")
      .then(({ data }) => {
        this.logs = data;
        // this.logs.shift()
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    maxEpoch() {
      const epochs = this.logs
        .filter((entry) => entry.status.toLowerCase() === "training")
        .map((entry) => entry.detail.epoch);
      return Math.max(...epochs);
    },
    sortedLogs() {
      const sortedLogs = [...this.logs];
      return sortedLogs.sort((a, b) => {
        return (
          this.convertDateToJSFormat(b.updatedDate) -
          this.convertDateToJSFormat(a.updatedDate)
        );
      });
    },
  },
  methods: {
    timeEstimation(detail) {
      if (
        Object.prototype.hasOwnProperty.call(detail, "meanTime") &&
        Object.prototype.hasOwnProperty.call(detail, "estimatedTime")
      ) {
        return {
          meanTime: detail.meanTime,
          estimatedTime: detail.estimatedTime,
        };
      } else {
        return {
          meanTime: "NaT",
          estimatedTime: "NaT",
        };
      }
    },
    convertDateToJSFormat(dateString) {
      const parts = dateString.split(" ");
      const dateParts = parts[0].split("/");
      const timeParts = parts[1].split(":");
      const year = dateParts[2];
      const month = dateParts[1] - 1;
      const day = dateParts[0];
      const hour = timeParts[0];
      const minute = timeParts[1];
      const second = timeParts[2];
      return new Date(year, month, day, hour, minute, second);
    },
    showLosses() {
      this.$emit("showLosses", this.trainingName, this.logs);
    },
    getBadgeVariant(status) {
      status = status.toLowerCase();
      if (status === "training") {
        return "bg-primary";
      } else if (status === "plotting") {
        return "bg-warning";
      } else if (status === "completed") {
        return "bg-success";
      } else if (status === "prepared") {
        return "bg-info";
      } else if (status === "idle") {
        return "bg-secondary";
      } else if (status === "benchmarking") {
        return "bg-dark";
      } else if (status === "error") {
        return "bg-danger";
      }
      return "bg-danger";
    },
  },
};
</script>

<style scoped>
.card-table-container {
  width: 100%; /* Ensures the card takes the full width of its parent */
}

.table-responsive {
  max-height: 500px;
  overflow-y: auto;
  width: 100%; /* Ensures the responsive table container takes full width */
}

.table-wrapper {
  min-width: 100%; /* Ensures the table stretches to at least the width of its container */
}

.badge-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Additional styling to ensure content alignment and presentation */
.table-responsive::-webkit-scrollbar {
  -webkit-appearance: none;
}

.table-responsive::-webkit-scrollbar:vertical {
  width: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: var(--bs-gray-200);
  border-radius: 5px;
  border: 2px solid var(--bs-white);
}
.plotting-status {
  float: left;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
</style>
