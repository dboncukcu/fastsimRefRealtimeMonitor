<template>
  <b-card class="card-table-container">
    <div class="table-responsive">
      <b-table
        striped
        hover
        :items="logs"
        :fields="detailFields"
        small
        class="table-wrapper"
        style="width: 100% !important"
      >
        <template #cell(status)="row">
          <div class="badge-center">
            <b-badge pill :class="getBadgeVariant(row.item.status)">{{
              row.item.status
            }}</b-badge>
          </div>
        </template>
        <template #cell(detail)="row">
          <div class="text-center">
            <span
              v-html="
                getDetailColumn(row.item.status, trainingName, row.item.detail)
              "
            ></span>
          </div>
        </template>
      </b-table>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "HistoryDetails",
  props: {
    logs: {
      type: Array,
      required: true,
    },
    losses: {
      type: Object,
      default: () => ({}),
    },
    trainingName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      detailFields: [
        { key: "status", label: "Status", thStyle: { width: "20%" } },
        { key: "detail", label: "Detail" , thStyle: { width: "60%" } },
        { key: "updatedDate", label: "Updated Date" , thStyle: { width: "15%" } },
      ],
    };
  },
  methods: {
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
    getDetailColumn(status, trainingName, detail) {
      status = status.toLowerCase();
      if (status === "training") {
        const epoch = parseInt(detail.epoch) + 1;
        const maxEpoch = parseInt(detail.maxEpoch);

        const progressPercentage = (epoch / maxEpoch) * 100;
        return `
                <div style="position: relative; width: 100%; height: 20px;">
                    <div class="progress" style="position: absolute; width: 93%; height: 100%; z-index: 1;">
                        <div class="progress-bar bg-info" role="progressbar" style="width: ${progressPercentage}%;"
                        aria-valuenow="${epoch}" aria-valuemin="0" aria-valuemax="${maxEpoch}"></div>
                    </div>
                    <div style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 2; color: black; font-weight: bold;">
                        ${epoch}/${maxEpoch}
                    </div>
                    <button style="float: right; width: 5%;" class="btn btn-secondary" data-toggle="modal" data-target="#lossesModal" onclick="showLossesChart('${trainingName}')"><i class="bi bi-graph-up-arrow"></i></button>
                </div>
            `;
      } else if (status === "plotting") {
        const plotTextDisplay =
          detail !== ""
            ? `<span style="margin-left: 10px;">${detail}</span>`
            : "";
        return `<div class="spinner-grow text-warning" role="status"></div>${plotTextDisplay}`;
      } else if (status === "completed") {
        return `<a href="${trainingName}/" target="_blank" class="btn btn-success"><i class="bi bi-eye-fill"></i> Open</a>`;
      } else if (status === "prepared") {
        return "All Necessary Files Prepared.";
      } else if (status === "idle") {
        return `<div class="spinner-border border-transparent text-secondary"></div>`;
      } else if (status === "benchmarking") {
        return `<i class="bi bi-gear h3 spinner"></i>`;
      } else if (status === "error") {
        return `<i class="bi bi-exclamation-triangle-fill h3 text-danger"></i> ${detail}`;
      }
      return "N/A";
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
</style>
