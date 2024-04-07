<template>
         <div style="position: relative; width: 100%; height: 20px;">
            <div class="progress" style="position: absolute; width: 93%; height: 100%; z-index: 1;">
                <div class="progress-bar bg-info" role="progressbar" :style="{ width: progressPercentage + '%' }"
                aria-valuenow="${epoch}" aria-valuemin="0" aria-valuemax="${maxEpoch}"></div>
            </div>
            <div style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 2; color: black; font-weight: bold;">
                {{epoch}}/{{maxEpoch}}
            </div>
            <button style="float: right; width: 5%;" class="btn btn-secondary" data-toggle="modal" @click="$emit('click')"><i class="bi bi-graph-up-arrow"></i></button>
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
    },
    computed: {
        progressPercentage() {
            return (this.epoch / this.maxEpoch) * 100;
        },
    },
}


</script>