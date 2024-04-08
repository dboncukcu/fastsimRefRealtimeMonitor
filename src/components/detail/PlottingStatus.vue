<template>
  <span style="text-align: left !important; ">
    <div class="spinner-grow text-warning" role="status"></div>
    <span v-if="detail !== ''" style="margin-left: 10px">{{ detail }}</span>
  </span>
</template>

<script>
export default {
  name: "PlottingStatus",
  props: {
    detail: {
      type: String,
      default: "",
    },
  },
};
</script>
