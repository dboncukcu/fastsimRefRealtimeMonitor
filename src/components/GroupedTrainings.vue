<template>
  <div>
    <b-table
      striped
      hover
      :items="groupMainItems"
      :fields="mainFields"
      :current-page="currentPage"
      :per-page="perPage"
      @row-clicked="onRowClicked"
      responsive="sm"
      id="mainHistoryTable"
    >
    <!-- eslint-disable-next-line vue/no-unused-vars -->
    <template #row-details="row">
      <IndividualTrainings
        :logs="getGroupTrainings(row.item.groupName)"
      ></IndividualTrainings>
      </template>

      <template v-slot:cell(progress)="data">
        <b-progress height="35px">
          <b-progress-bar
            v-for="(value, key) in data.item.progress"
            :key="key"
            :value="value"
            :max="totalProgress(data.item.progress)"
            :variant="getVariant(key)"
            :style="{ minWidth: value>0 ? minWidth + 'px': '0px'   }"
          >
            <div
              class="d-flex align-items-center justify-content-center"
              style="width: 100%"
            >
              <p class="mb-0 font-weight-bold">
                {{ capitalizeFirstLetter(key) }} ({{ value }})
              </p>
            </div>
          </b-progress-bar>
        </b-progress>
      </template>

      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? "Hide" : "Show" }} Trainings
        </b-button>
      </template>




    </b-table>

    <div class="pagination-container">
      <b-pagination
        pills
        v-model="currentPage"
        :total-rows="this.groupMainItems.length"
        :per-page="perPage"
        aria-controls="mainHistoryTable"
      ></b-pagination>
      <ul class="pagination mx-2">
        <li class="page-item active">
          <h4>
            <b-badge variant="primary" pill
              >Total {{ this.groupMainItems.length }}</b-badge
            >
          </h4>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import IndividualTrainings from './IndividualTrainings.vue';
export default {
  name: "GroupedTrainings",
  components: {
    IndividualTrainings
  },
  props: {
    logs: Object,
    groups: Object,
  },
  data() {
    return {
      mainFields: [
        {
          key: "groupName",
          label: "Group Name",
          thStyle: { width: "30%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
        {
          key: "progress",
          label: "Progress",
          thStyle: { width: "50%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
        {
          key: "updatedDate",
          label: "Last Updated Date",
          thStyle: { width: "15%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
        {
          key: "actions",
          label: "Actions",
          thStyle: { width: "5%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
      ],
      currentPage: 1,
      perPage: 5,
      expandedItem: null,
      modalTrainName: "",
    };
  },
  computed: {
    minWidth() {
      // Tüm anahtarları alıp en uzun olanının uzunluğunu bul
      const allKeys = this.groupMainItems.flatMap((item) =>
        Object.keys(item.progress).map(
          (key) => this.capitalizeFirstLetter(key).length
        )
      );
      const maxLength = Math.max(...allKeys);
      // Varsayılan minimum genişlik değeri, karakter genişliğiyle çarpılır
      return (maxLength+4) * 8; // Buradaki değer, karakter başına tahmini piksel genişliği
    },
    lastUpdatedItems() {
      const result = {};
      Object.keys(this.logs).forEach((key) => {
        const latestItem = this.logs[key].reduce((prev, current) => {
          const prevDate = new Date(prev.updatedDate);
          const currentDate = new Date(current.updatedDate);
          return prevDate > currentDate ? prev : current;
        });

        result[key] = { trainName: key, ...latestItem };
      });
      return result;
    },
    groupMainItems() {
      const template = {
        idle: 0,
        prepared: 0,
        benchmarking: 0,
        training: 0,
        plotting: 0,
        completed: 0,
        error: 0,
      };
      // eslint-disable-next-line no-unused-vars
      const groupsMainItems = [];

      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.groups)) {
        const temp = { ...template };

        const updateDates = [];

        value.forEach((t) => {
          temp[this.lastUpdatedItems[t].status.toLowerCase()]++;
          updateDates.push(this.lastUpdatedItems[t].updatedDate);
        });

        const lastUpdate = updateDates.reduce((prev, current) => {
          const prevDate = new Date(prev.updatedDate);
          const currentDate = new Date(current.updatedDate);
          return prevDate > currentDate ? prev : current;
        });

        console.log(updateDates);
        groupsMainItems.push({
          groupName: key,
          progress: temp,
          updatedDate: lastUpdate,
        });
      }

      return groupsMainItems;
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    onRowClicked(item, index, event) {
      // Bu örnekte, genişletilmiş öğe yönetimine ihtiyaç duyulmamaktadır.
    },
    totalProgress(progressObj) {
      return Object.values(progressObj).reduce((acc, cur) => acc + cur, 0);
    },
    getVariant(status) {
      const variants = {
        idle: "secondary",
        prepared: "info",
        benchmarking: "dark",
        training: "primary",
        plotting: "warning",
        completed: "success",
        error: "danger",
      };
      return variants[status] || "secondary";
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getGroupTrainings(groupName) {
      const training = {}
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.groups[groupName])) {
          training[value] = this.logs[value];
      }
      return training;
    },
  },
};
</script>

<style>
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