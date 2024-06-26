<template>
  <div>
    <b-table
      striped
      hover
      :items="historyMainItems"
      :fields="mainFields"
      :current-page="currentPage"
      :per-page="perPage"
      @row-clicked="onRowClicked"
      responsive="sm"
      id="mainHistoryTable"
      :sort-compare="customSort"
      :show-empty="true"
    >
      <template #empty>
        <div class="text-center">
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </div>
      </template>
      <template #row-details="row">
        <HistoryDetails
          :trainingName="row.item.trainName"
          @showLosses="showLosses"
          @showed="loading[row.item.trainName] = false"
        ></HistoryDetails>
      </template>
      <template #cell(trainName)="data">
        <div
          :style="{
            'max-width': trainNameCellWidth + 'px',
            'overflow-x': 'auto',
            'white-space': 'nowrap',
          }"
        >
          {{ data.item.trainName }}
        </div>
      </template>
      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails()">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
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
              :is-most-updated="true"
              :estimatedRemainingTime="timeEstimation(row.item.detail)"
              :updated-time="row.item.updatedDate"
              :trainName="row.item.trainName"
              @click="showLosses(row.item.trainName, null)"
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
            <CompletedStatus :trainingName="row.item.trainName" />
          </span>
          <span v-else> N/A </span>
        </div>
      </template>
    </b-table>
    <div class="pagination-container">
      <b-pagination
        pills
        v-model="currentPage"
        :total-rows="this.historyMainItems.length"
        :per-page="perPage"
        aria-controls="mainHistoryTable"
      ></b-pagination>
      <ul class="pagination mx-2">
        <li class="page-item active">
          <h4>
            <b-badge variant="primary" pill
              >Total {{ this.historyMainItems.length }}</b-badge
            >
          </h4>
        </li>
      </ul>
    </div>

    <b-modal
      id="lossChart"
      hide-footer
      size="xl"
      header-class="justify-content-center"
    >
      <template #modal-title>
        <div>
          <code>{{ modalTrainName }}</code> Real-Time Loss Monitor
        </div>
      </template>
      <div class="d-block text-center">
        <LossChart :losses="lossInfo" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import HistoryDetails from "./HistoryDetails.vue";
import TrainingStatus from "./detail/TrainingStatus.vue";
import PlottingStatus from "./detail/PlottingStatus.vue";
import PreparedStatus from "./detail/PreparedStatus.vue";
import BenchmarkingStatus from "./detail/BenchmarkingStatus.vue";
import ErrorStatus from "./detail/ErrorStatus.vue";
import IdleStatus from "./detail/IdleStatus.vue";
import CompletedStatus from "./detail/CompletedStatus.vue";
import LossChart from "./detail/LossChart.vue";
export default {
  name: "IndividualTrainings",
  components: {
    HistoryDetails,
    TrainingStatus,
    PlottingStatus,
    PreparedStatus,
    BenchmarkingStatus,
    ErrorStatus,
    IdleStatus,
    CompletedStatus,
    LossChart,
  },
  props: {
    logs: Object,
  },
  mounted() {
    this.$nextTick(() => {
      this.updateTrainNameCellWidth();
      // window.addEventListener("resize", this.updateTrainNameCellWidth)
    });
  },
  updated() {
    this.$nextTick(() => {
      this.updateTrainNameCellWidth();
      // window.addEventListener("resize", this.updateTrainNameCellWidth)
    });
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.updateTrainNameCellWidth)
  },
  data() {
    return {
      loading: {},
      trainNameCellWidth: 1,
      mainFields: [
        {
          key: "trainName",
          label: "Train Tag",
          thStyle: {
            width: "35%",
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
          thClass: "text-center train-name-header",
          tdClass: "align-middle text-wrap train-name-cell",
          sortable: true,
        },
        {
          key: "status",
          label: "Status",
          thStyle: { width: "5%" },
          thClass: "text-center",
          tdClass: "align-middle",
          sortable: true,
        },
        {
          key: "detail",
          label: "Detail",
          thStyle: { width: "44%" },
          thClass: "text-center",
          tdClass: "align-middle",
        },
        {
          key: "updatedDate",
          label: "Updated Date",
          thStyle: { width: "10%" },
          thClass: "text-center",
          tdClass: "align-middle",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "actions",
          label: "Actions",
          thStyle: { width: "6%" },
          thClass: "text-center",
          tdClass: "align-middle",
        },
      ],
      currentPage: 1,
      perPage: 7,
      expandedItem: null,
      modalTrainName: "",
      modalLogs: [],
    };
  },
  computed: {
    historyMainItems() {
      const result = [];
      Object.keys(this.logs).forEach((key) => {
        result.push({ trainName: key, ...this.logs[key] });
      });
      result.sort((a, b) => this.convertDateToJSFormat(b.updatedDate) - this.convertDateToJSFormat(a.updatedDate))
      return result;
    },
    lossInfo() {
      return this.modalLogs
        .map((item) => {
          if (item.status.toLowerCase() === "training") {
            return {
              epoch: item.detail.epoch,
              trainLoss: Object.prototype.hasOwnProperty.call(
                item.detail,
                "trainLoss"
              )
                ? this.sanitizeLossValues(item.detail.trainLoss)
                : null,
              validationLoss: Object.prototype.hasOwnProperty.call(
                item.detail,
                "trainLoss"
              )
                ? this.sanitizeLossValues(item.detail.valLoss)
                : null,
            };
          }
        })
        .filter((item) => item !== null && item !== undefined);
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
    customSort(a, b, key) {
      if (key === "updatedDate") {
        const prevDate = this.convertDateToJSFormat(a[key]);
        const currentDate = this.convertDateToJSFormat(b[key]);
        return prevDate > currentDate ? -1 : prevDate < currentDate ? 1 : 0;
      }
      return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
    },
    sanitizeLossValues(data) {
      if (
        isNaN(data) ||
        data === null ||
        data === undefined ||
        data === "NaN" ||
        data === "none"
      ) {
        data = null;
      }

      return data;
    },
    async showLosses(trainingName, logs) {
      this.modalTrainName = trainingName;
      if (logs === null) {
        this.modalLogs = await this.$axios
          .get(trainingName + "/log.json")
          .then(({ data }) => data);
      } else {
        this.modalLogs = logs;
      }
      this.$bvModal.show("lossChart");
    },
    // eslint-disable-next-line no-unused-vars
    onRowClicked(item, index, event) {
      // Bu örnekte, genişletilmiş öğe yönetimine ihtiyaç duyulmamaktadır.
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
    updateTrainNameCellWidth() {
      this.$nextTick(() => {
        const trainNameHeader = this.$el.querySelector(".train-name-header");
        this.trainNameCellWidth = trainNameHeader.clientWidth;
      });
    },
  },
};
</script>

<style scoped>
.scrollable-train-name {
  max-width: 200px;
  overflow-x: auto;
  white-space: nowrap;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
}
.plotting-status {
  float: left;
}
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.modal-title {
  margin-left: auto;
}
</style>
