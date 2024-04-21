<template>
    <div style="position: relative; width: 100%; height: 30px; display: flex; align-items: center;">
        <div class="progress" style="margin-left: 0px !important; margin-right: auto; width: 65%; height: 100%; z-index: 1;">
            <div class="progress-bar bg-info" role="progressbar" :style="{ width: progressPercentage + '%' }" aria-valuenow="${epoch}" aria-valuemin="0" aria-valuemax="${maxEpoch}"></div>
        </div>
        <div style="margin-left: auto; margin-right: auto; position: absolute; width: 75%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 2; color: black; font-weight: bold;">
            {{epoch}}/{{maxEpoch}}
        </div>
        <div v-if="isMostUpdated" class="ml-1" style="margin-right: auto; width: 20%; display: flex; align-items: center; justify-content: flex-end; z-index: 3;">
            <button class="btn btn-secondary" style="width: 45%;" data-toggle="modal" @click="$emit('click')"  v-b-tooltip.hover title="Show Real Time Losses"><i class="bi bi-graph-up-arrow"></i></button>
            <button class="btn btn-secondary  ml-1" style="width: 45%;" data-toggle="modal" @click="$emit('openArch')" v-b-tooltip.hover title="Show Model Architecture"><i class="bi bi-diagram-3-fill"></i></button>
        </div>
        <div v-else style="margin-left: auto; margin-right: auto; width: 50px; display: flex; align-items: center; justify-content: flex-end; z-index: 3;">

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
    },
    computed: {
        progressPercentage() {
            return (this.epoch / this.maxEpoch) * 100;
        },
    },
}
</script>
