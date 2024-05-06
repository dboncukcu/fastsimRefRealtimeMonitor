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
      :show-empty="true"
    >
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template #row-details="row">
        <b-row class="mb-1">
          <b-col v-if="searchFilter[row.item.groupName]">
            <b-progress height="35px">
              <b-progress-bar
                v-for="(value, key) in calculateProgress(getGroupTrainings(row.item.groupName))"
                :key="key"
                :value="value"
                :max="totalProgress(calculateProgress(getGroupTrainings(row.item.groupName)))"
                :variant="getVariant(key)"
                :style="{ minWidth: value > 0 ? minWidth + 'px' : '0px' }"
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
          </b-col>
          <b-col>
            <b-form-group
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-1"
            >
              <b-input-group size="sm" class="w-50 ml-auto">
                <b-form-input
                  id="filter-input"
                  type="search"
                  placeholder="Type to Search"
                  v-model="searchFilter[row.item.groupName]"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    :disabled="!searchFilter[row.item.groupName]"
                    @click="searchFilter[row.item.groupName] = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <IndividualTrainings
          :logs="getGroupTrainings(row.item.groupName)"
        ></IndividualTrainings>
      </template>
      <template #empty>
        <div class="text-center">
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </div>
      </template>
      <template v-slot:cell(progress)="data">
        <b-progress height="35px">
          <b-progress-bar
            v-for="(value, key) in data.item.progress"
            :key="key"
            :value="value"
            :max="totalProgress(data.item.progress)"
            :variant="getVariant(key)"
            :style="{ minWidth: value > 0 ? minWidth + 'px' : '0px' }"
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
        <b-button size="sm" @click="openDetails(row)">
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
/* eslint-disable */
import IndividualTrainings from "./IndividualTrainings.vue";
export default {
  name: "GroupedTrainings",
  components: {
    IndividualTrainings,
  },
  props: {
    logs: Object,
    groups: Object,
  },
  created() {
    for (const key in this.groups) {
      this.$set(this.searchFilter, key, "");
    }
  },
  data() {
    return {
      searchFilter: {},
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
          thStyle: { width: "49%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
        {
          key: "updatedDate",
          label: "Last Updated Date",
          thStyle: { width: "15%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          thStyle: { width: "6%" },
          thClass: "text-center",
          tdClass: "text-center align-middle",
        },
      ],
      currentPage: 1,
      perPage: 8,
      expandedItem: null,
      modalTrainName: "",
    };
  },
  computed: {
    minWidth() {
      const allKeys = this.groupMainItems.flatMap((item) =>
        Object.keys(item.progress).map(
          (key) => this.capitalizeFirstLetter(key).length
        )
      );
      const maxLength = Math.max(...allKeys);
      return (maxLength + 4) * 8;
    },
    lastUpdatedItems() {
      const result = {};
      Object.keys(this.logs).forEach((key) => {
        result[key] = { trainName: key, ...this.logs[key] };
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
          const prevDate = this.convertDateToJSFormat(prev);
          const currentDate = this.convertDateToJSFormat(current);
          return prevDate > currentDate ? prev : current;
        });
        groupsMainItems.push({
          groupName: key,
          progress: temp,
          updatedDate: lastUpdate,
        });
      }

      groupsMainItems.sort(
        (a, b) =>
          this.convertDateToJSFormat(b.updatedDate) -
          this.convertDateToJSFormat(a.updatedDate)
      );
      return groupsMainItems;
    },
  },
  methods: {
    calculateProgress(filteredLogs) {
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
      for (const [key, value] of Object.entries(filteredLogs)) {
        template[value.status.toLowerCase()]++;
      }
      return template
    },
    openDetails(row) {
      this.searchFilter[row.item.groupName] = "";
      row.toggleDetails();
      console.log(this.searchFilter);
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
      function checkCondition(value, searchFilter) {
        // Filtreyi bölme ve koşulları işleme
        const orSegments = searchFilter.split(/\sOR\s|\|/i); // OR koşullarını bölme

        for (const orSegment of orSegments) {
          const andSegments = orSegment.split(/\sAND\s|&/i); // AND koşullarını bölme
          let andCondition = true; // AND koşullarının hepsi doğru olmalı

          for (const andSegment of andSegments) {
            if (!value.includes(andSegment.trim())) {
              andCondition = false;
              break; // Eğer bir AND koşulu yanlışsa, diğer AND koşullarına bakmaya gerek yok
            }
          }

          if (andCondition) {
            return true; // Eğer tüm AND koşulları doğruysa, OR koşulunu doğrulayıp döngüden çık
          }
        }

        return false; // Eğer hiçbir OR koşulu sağlanmazsa, false döndür
      }
      const training = {};
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.groups[groupName])) {
        if (checkCondition(value, this.searchFilter[groupName])) {
          training[value] = this.logs[value];
        }
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
