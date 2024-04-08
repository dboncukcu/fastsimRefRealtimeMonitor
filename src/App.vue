<template>
  <b-container fluid class="d-flex flex-column vh-100">
    <b-row class="flex-grow-1">
      <b-container fluid class="w-75">
        <!-- Header -->
        <page-title></page-title>

        <!-- Butonlar -->
        <refresh-manager></refresh-manager>

        <!-- Tablo -->
        <b-tabs
          fill
          pills
          card
          active-nav-item-class="font-weight-bold text-uppercase bg-dark"
          nav-class="font-weight-bold text-uppercase"
          lazy
        >
          <b-tab title="Individual Trainings" active>
            <individual-trainings :logs="individualTrainings"></individual-trainings>
          </b-tab>
          <b-tab title="Grouped Trainings">
            <grouped-trainings :logs="groupedTrainings" :groups="groups"></grouped-trainings>
          </b-tab>
        </b-tabs>
      </b-container>
    </b-row>
    <b-row>
      <b-col>
        <!-- Footer -->
        <author-description></author-description>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from "./components/PageTitle.vue";
import AuthorDescription from "./components/AuthorDescription.vue";
import RefreshManager from "./components/RefreshManager.vue";
import IndividualTrainings from "./components/IndividualTrainings.vue";
import GroupedTrainings from "./components/GroupedTrainings.vue";
export default {
  name: "App",
  components: {
    PageTitle,
    AuthorDescription,
    RefreshManager,
    IndividualTrainings,
    GroupedTrainings,
  },
  data() {
    return {
      logs: {},
      groups: {},
    };
  },
  created() {
    this.$axios
      .get("log.json")
      .then(({ data }) => {
        this.logs = data.trainingLogs;
        this.groups = data.groups;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    groupedTrainingsName() {
      if (Object.keys(this.groups).length === 0) return [];
      return Object.values(this.groups).flat();
    },
    groupedTrainings() {
      return Object.keys(this.logs)
        .filter((key) => this.groupedTrainingsName.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.logs[key];
          return obj;
        }, {});
    },
    individualTrainings() {
      return Object.keys(this.logs)
        .filter((key) => !this.groupedTrainingsName.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.logs[key];
          return obj;
        }, {});
    },
  },
};
</script>
