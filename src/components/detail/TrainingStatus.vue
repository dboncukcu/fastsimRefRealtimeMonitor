<template>
  <div
    style="
      position: relative;
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
    "
  >
    <div
      class="progress"
      style="
        margin-left: 0px !important;
        margin-right: auto;
        width: 55%;
        height: 100%;
        z-index: 1;
      "
    >
      <div
        class="progress-bar bg-info"
        role="progressbar"
        :style="{ width: progressPercentage + '%' }"
        aria-valuenow="${epoch}"
        aria-valuemin="0"
        aria-valuemax="${maxEpoch}"
      ></div>
    </div>
    <div
      style="
        margin-left: auto;
        margin-right: auto;
        position: absolute;
        width: 55%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        color: black;
        font-weight: bold;
      "
    >
      {{ epoch }}/{{ maxEpoch }}
    </div>

    <div
      v-if="isMostUpdated"
      class="ml-1"
      style="
        margin-right: 0;
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 3;
      "
    >
      <b-badge
      style="margin-left: auto; margin-right: 4%"
        v-b-tooltip.hover
        title="Mean Elapsed Seconds per Epoch"
        variant="secondary"
      >
        {{ meanTime }}
      </b-badge>

      <b-badge
        v-if="!isEstimatedFinishTimeExpired && !isHistorical"
        style="margin-left: auto; margin-right: 4%"
        v-b-tooltip.hover
        :title="`Estimated Finishing Time ${estimatedFinishTimeDisplay}`"
        variant="warning"
      >
        <span :key="updateEstimatedTime"> {{ estimatedTime }}</span>
      </b-badge>
      <button
        class="btn btn-secondary"
        style="width: 45%"
        data-toggle="modal"
        @click="$emit('click')"
        v-b-tooltip.hover
        title="Show Real Time Losses"
      >
        <i class="bi bi-graph-down-arrow"></i>
      </button>
      <button
        class="btn btn-secondary ml-1"
        style="width: 45%"
        data-toggle="modal"
        @click="$emit('openArch')"
        v-b-tooltip.hover
        title="Show Model Architecture"
      >
        <i class="bi bi-diagram-3-fill"></i>
      </button>
    </div>
    <div
      v-else
      style="
        margin-left: auto;
        margin-right: auto;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 3;
      "
    >
      <b-badge
      style="margin-left: auto; margin-right: 4%"
        v-b-tooltip.hover
        title="Mean Elapsed Seconds per Epoch"
        variant="secondary"
      >
        {{ meanTime }}
      </b-badge>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingStatus",
  props: {
    epoch: {
      type: Number,
      required: true,
    },
    maxEpoch: {
      type: Number,
      required: true,
    },
    isMostUpdated: {
      type: Boolean,
      required: true,
    },
    estimatedRemainingTime: {
      type: Object,
      required: true,
    },
    updatedTime: {
      type: String,
      required: true,
    },
    isHistorical: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timer: null,
      updateEstimatedTime: 0,
    };
  },
  computed: {
    progressPercentage() {
      return (this.epoch / this.maxEpoch) * 100;
    },
    meanTime() {
      if (this.estimatedRemainingTime.meanTime === "NaT") return "NaT";

      const totalSeconds = Math.round(this.estimatedRemainingTime.meanTime);

      if (totalSeconds < 180) {
        return totalSeconds + " secs";
      } else {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":");

        return formattedTime;
      }
    },
    // estimatedTime2() {
    //   if (this.estimatedRemainingTime.estimatedTime === "NaT") return "NaT";

    //   const totalSeconds = Math.round(
    //     this.estimatedRemainingTime.estimatedTime
    //   );

    //   if (totalSeconds < 180) {
    //     return totalSeconds + " secs";
    //   } else {
    //     const hours = Math.floor(totalSeconds / 3600);
    //     const minutes = Math.floor((totalSeconds % 3600) / 60);
    //     const seconds = totalSeconds % 60;

    //     const formattedTime = [
    //       hours.toString().padStart(2, "0"),
    //       minutes.toString().padStart(2, "0"),
    //       seconds.toString().padStart(2, "0"),
    //     ].join(":");

    //     return formattedTime;
    //   }
    // },
    estimatedTime() {
      if (!this.estimatedFinishTime) {
        return "NaT";
      }

      const currentTime = new Date();
      const remainingMilliseconds = this.estimatedFinishTime - currentTime;
      const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

      if (remainingSeconds < 0) {
        return "00:00:00";
      }

      const hours = Math.floor(remainingSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((remainingSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    },
    estimatedFinishTime() {
      // eslint-disable-next-line
      let update = this.updateEstimatedTime;
      if (
        this.estimatedRemainingTime.estimatedTime === "NaT" ||
        this.updatedTime === "NaT"
      ) {
        return "NaT";
      }

      const [date, time] = this.updatedTime.split(" ");
      const [day, month, year] = date.split("/");
      const [hours, minutes, seconds] = time.split(":");

      const startDateTime = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
      );
      const estimatedSeconds = Math.round(
        this.estimatedRemainingTime.estimatedTime
      );

      const finishDateTime = new Date(
        startDateTime.getTime() + estimatedSeconds * 1000
      );
      return finishDateTime;
    },
    isEstimatedFinishTimeExpired() {
      if (this.estimatedFinishTime === "NaT") {
        return false;
      }

      const currentDateTime = new Date();
      return currentDateTime > this.estimatedFinishTime;
    },
    estimatedFinishTimeDisplay() {
      if (this.estimatedFinishTime === "NaT") {
        return "NaT";
      }

      const finishDateTime = new Date(this.estimatedFinishTime);
      const finishDay = finishDateTime.getDate().toString().padStart(2, "0");
      const finishMonth = (finishDateTime.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const finishYear = finishDateTime.getFullYear();
      const finishHours = finishDateTime.getHours().toString().padStart(2, "0");
      const finishMinutes = finishDateTime
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const finishSeconds = finishDateTime
        .getSeconds()
        .toString()
        .padStart(2, "0");

      return `${finishDay}/${finishMonth}/${finishYear} ${finishHours}:${finishMinutes}:${finishSeconds}`;
    },
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.updateEstimatedTime += 1;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  },
};
</script>
