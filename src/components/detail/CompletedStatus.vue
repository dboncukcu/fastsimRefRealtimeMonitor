<template>
    <a href="${trainingName}/" target="_blank" class="btn btn-success"><i class="bi bi-eye-fill"></i> Open Training Details</a>
</template>
<script>
export default {
    name: "CompletedStatus",
    props: {
        trainingName: {
            type: String,
            default: "",
        }
    }
};
</script>