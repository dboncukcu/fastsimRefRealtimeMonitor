<template>
  <b-container flex class="d-flex flex-column vh-100">
    <b-row class="flex-grow-1">
      <b-container>
            <!-- Header -->
            <page-title></page-title>

            <!-- Butonlar -->
            <refresh-manager></refresh-manager>

            <!-- Tablo -->
            <log-table :logs="logs" :losses="losses"></log-table>
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

import PageTitle from './components/PageTitle.vue';
import AuthorDescription from './components/AuthorDescription.vue';
import RefreshManager from './components/RefreshManager.vue';
import LogTable from './components/LogTable.vue';
export default {
  name: 'App',
  components: {
    PageTitle,
    AuthorDescription,
    RefreshManager,
    LogTable,
  },
  data(){
    return {
      logs: {},
      losses: {},
    }
  },
  created() {
    this.$axios.get("log.json").then(({data}) => {
      this.logs = data.trainingLogs
      this.losses = data.losses
    }).catch((error) => {
      console.log(error);
    }); 
  },
};
</script>
