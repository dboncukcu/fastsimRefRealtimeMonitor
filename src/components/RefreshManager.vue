<template>
  <b-row class="justify-content-end m-2">
    <b-col cols="auto">
      <b-button variant="primary" class="mr-2" @click="refreshPage">
        {{ countdown !== null ? (countdown === 0 ? "Refreshing Now" : "Refresh - " + countdown + "s") : "Refresh" }}
      </b-button>
    </b-col>
    <b-col cols="auto">
      <b-form-select v-model="selectedRate" :options="refreshRate">
      </b-form-select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "RefreshManager",
  data() {
    return {
      refreshRate: [
        { text: "No Refresh Timer", value: null },
        { text: "3 Seconds", value: 3 },
        { text: "5 Seconds", value: 5 },
        { text: "15 Seconds", value: 15 },
      ],
      selectedRate: null,
      countdown: null,
    };
  },
  watch: {
    selectedRate(newRate) {
      this.saveRate(newRate);
      this.countdown = newRate;
      this.startCountdown();
    },
  },
  methods: {
    saveRate(rate) {
      localStorage.setItem("refreshRate", JSON.stringify(rate));
    },
    loadRate() {
      const rate = localStorage.getItem("refreshRate");
      if (rate) {
        this.selectedRate = JSON.parse(rate);
      }
    },
    startCountdown() {
      if (this.countdownTimer) clearInterval(this.countdownTimer);

      if (this.selectedRate) {
        this.countdown = this.selectedRate;
        this.countdownTimer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            clearInterval(this.countdownTimer);
            this.refreshPage()
          }
        }, 1000);
      }
    },
    refreshPage(){
      this.countdown = 0;
      document.location.reload()
    }
  },
  created() {
    this.loadRate();
  },
};
</script>
