<template>
  <b-container fluid class="d-flex flex-column vh-100">
    <b-row class="flex-grow-1">
      <b-container fluid >
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
          @activate-tab="changeTab"
          :value="Number(activeTab)"
        >
          <b-tab title="Individual Trainings">
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
      lastLogs: {},
      groups: {},
      individuals: [],
      activeTab:  ""
    };
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      localStorage.setItem("activeTab", tab);
    }
  },
  created() {
    this.$axios
      .get("log.json")
      .then(({ data }) => {
        this.lastLogs = data;
      })
      .catch((error) => {
        console.log(error);
      })
      this.$axios
      .get("trainingList.json")
      .then(({ data }) => {
        this.groups = data.groups;
        this.individuals = data.individuals;
      })

      const activeTab = localStorage.getItem("activeTab");
      if (activeTab) {
        this.activeTab = activeTab
      }else{
        this.activeTab = 0
      }

  },
  computed: {
    displayedTab(){
      if (typeof this.activeTab === "number") {
        return this.activeTab
      }else{        
        return 0
      }
    },
    groupedTrainingsName() {
      if (Object.keys(this.groups).length === 0) return [];
      return Object.values(this.groups).flat();
    },
    groupedTrainings() {
      return Object.keys(this.lastLogs)
        .filter((key) => this.groupedTrainingsName.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.lastLogs[key];
          return obj;
        }, {});
    },
    individualTrainings() {
      return Object.keys(this.lastLogs)
        .filter((key) => !this.groupedTrainingsName.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.lastLogs[key];
          return obj;
        }, {});
    },
  },
};
</script>
