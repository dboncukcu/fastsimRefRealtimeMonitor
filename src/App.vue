<template>
  <b-container fluid class="d-flex flex-column vh-100">
    <b-row class="flex-grow-1">
      <b-container fluid class="w-75">
            <!-- Header -->
            <page-title></page-title>

            <!-- Butonlar -->
            <refresh-manager></refresh-manager>

            <!-- Tablo -->
            <log-table :logs="logs"></log-table>
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
      logs: {},    }
  },
  created() {
    this.$axios.get("log.json").then(({data}) => {
      this.logs = data.trainingLogs
    }).catch((error) => {
      console.log(error);
    }); 
  },
};
</script>
