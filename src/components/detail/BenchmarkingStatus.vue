<template>
  <i class="bi bi-gear h3 spinner"></i>
</template>

<script>
export default {
  name: "BenchmarkingStatus",
};
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
    display: inline-block;
    animation: spin 2s linear infinite;
}

</style>
