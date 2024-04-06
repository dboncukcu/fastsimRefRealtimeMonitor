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
    >
      <template #row-details="row">
        <historyDetailItems 
        :logs="historyDetailItems(row.item.trainName)" 
        :losses="losses"
        :trainingName="row.item.trainName"
        ></historyDetailItems>
      </template>


      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
      </template>
      <template #cell(status)="row">
          <div class="badge-center">
            <b-badge pill :class="getBadgeVariant(row.item.status)" >{{row.item.status}}</b-badge>
          </div> 
        </template>
        <template #cell(detail)="row">
            <div class="text-center">
            <span v-html="getDetailColumn(row.item.status, row.item.trainName, row.item.detail)"></span>   
            </div>
        </template>
    </b-table>



    <div class="pagination-container">
      <b-pagination
        v-model="currentPage"
        :total-rows="this.historyMainItems.length"
        :per-page="perPage"
        aria-controls="mainHistoryTable"
      ></b-pagination>
            <ul  class="pagination mx-2">
                <li class="page-item active"><a class="page-link">Total {{this.historyMainItems.length}}</a></li>
            </ul>
    </div>
  </div>
</template>


<script>
import historyDetailItems from "./HistoryDetails.vue";
export default {
  name: "LogTable",
  components: {
    historyDetailItems,
  },
  props: {
    logs: Object,
    losses: Object,
  },
  data() {
    return {
      mainFields: [
        { key: "trainName", label: "Train Tag" , thStyle: { width: "35%" } },
        { key: "status", label: "Status" , thStyle: { width: "10%" } },
        { key: "detail", label: "Detail" , thStyle: { width: "30%" } },
        { key: "updatedDate", label: "Updated Date" , thStyle: { width: "20%" } },
        { key: "actions", label: "Actions" , thStyle: { width: "5%" } },
      ],

      currentPage: 1,
      perPage: 10,
      expandedItem: null,
    };
  },
  computed: {
    historyMainItems() {
      const result = [];

      Object.keys(this.logs).forEach((key) => {
        const latestItem = this.logs[key].reduce((prev, current) => {
          const prevDate = new Date(prev.updatedDate);
          const currentDate = new Date(current.updatedDate);
          return prevDate > currentDate ? prev : current;
        });

        result.push({ trainName: key, ...latestItem });
      });
      console.log(result);
      return result;
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    onRowClicked(item, index, event) {
      // Bu örnekte, genişletilmiş öğe yönetimine ihtiyaç duyulmamaktadır.
    },
    historyDetailItems(trainName) {
      return this.logs[trainName];
    },
    getBadgeVariant(status) {
        status = status.toLowerCase();
        if (status === 'training') {
            return 'bg-primary';
        } else if (status === 'plotting') {
            return 'bg-warning';
        } else if (status === 'completed') {
            return 'bg-success';
        } else if (status === 'prepared') {
            return 'bg-info';
        } else if (status === 'idle') {
            return 'bg-secondary';
        } else if (status === 'benchmarking') {
            return 'bg-dark';
        }  else if (status === 'error') {
            return 'bg-danger';
        }
        return 'bg-danger';
    },
    getDetailColumn(status, trainingName,detail) {

        status = status.toLowerCase();
        if (status === 'training') {

            const epoch = parseInt(detail.epoch)+1
            const maxEpoch = parseInt(detail.maxEpoch)

            const progressPercentage = (epoch / maxEpoch) * 100;
            return `
                <div style="position: relative; width: 100%; height: 20px;">
                    <div class="progress" style="position: absolute; width: 80%; height: 100%; z-index: 1;">
                        <div class="progress-bar bg-info" role="progressbar" style="width: ${progressPercentage}%;"
                        aria-valuenow="${epoch}" aria-valuemin="0" aria-valuemax="${maxEpoch}"></div>
                    </div>
                    <div style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 2; color: black; font-weight: bold;">
                        ${epoch}/${maxEpoch}
                    </div>
                    <button style="float: right;" class="btn btn-secondary btn-md ml-2" data-toggle="modal" data-target="#lossesModal" onclick="showLossesChart('${trainingName}')"><i class="bi bi-graph-up-arrow"></i></button>
                </div>
            `;
        } else if (status === 'plotting') {
            const plotTextDisplay = detail!=="" ? `<span style="margin-left: 10px;">${detail}</span>` : '';
            return `<div class="spinner-grow text-warning" role="status"></div>${plotTextDisplay}`;
        } else if (status === 'completed') {
            return `<a href="${trainingName}/" target="_blank" class="btn btn-success"><i class="bi bi-eye-fill"></i> Open</a>`;
        } else if (status === 'prepared') {
            return 'All Necessary Files Prepared.';
        } else if (status === 'idle') {
            return `<div class="spinner-border border-transparent text-secondary"></div>`;
        } else if(status === 'benchmarking'){
            return `<i class="bi bi-gear h3 spinner"></i>`;
        } else if(status === 'error'){
            return `<i class="bi bi-exclamation-triangle-fill h3 text-danger"></i> ${detail}`;
        }
        return 'N/A';
}
  },
};
</script>


<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
}

</style>
