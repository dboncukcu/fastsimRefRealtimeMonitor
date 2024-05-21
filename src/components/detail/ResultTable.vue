<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <b-button-group>
            <b-button
                :variant="selectedFilter === 'all' ? 'primary' : 'secondary'"
                @click="selectedFilter = 'all'"
            >
                All
            </b-button>
            <b-button
                :variant="selectedFilter === 'train' ? 'primary' : 'secondary'"
                @click="selectedFilter = 'train'"
            >
                Train
            </b-button>
            <b-button
                :variant="selectedFilter === 'validation' ? 'primary' : 'secondary'"
                @click="selectedFilter = 'validation'"
            >
                Validation
            </b-button>
            </b-button-group>
        </div>
        <b-table :items="filteredResults" :fields="resultFields" responsive="xl">
            <template #cell(lossName)="data">
            {{ data.item.lossName }}
            </template>
            <template #cell(lossSource)="data">
            {{ data.item.lossSource }}
            </template>
            <template #cell(minValue)="data">
            {{ data.item.minValue }}
            </template>
            <template #cell(minTrainName)="data">
            <b-button v-b-tooltip.hover :title="data.item.minTrainName" @click="openTraining(data.item.minTrainName)">
                <i class="bi bi-clipboard-pulse"></i>
            </b-button>
            </template>
            <template #cell(maxValue)="data">
            {{ data.item.maxValue }}
            </template>
            <template #cell(maxTrainName)="data">
            <b-button v-b-tooltip.hover :title="data.item.maxTrainName" @click="openTraining(data.item.maxTrainName)">
                <i class="bi bi-clipboard-pulse"></i>
            </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
export default {
    name: "ResultTable",
    props: {
        results: {
            type: Array,
            default: () => ([]),
        }
    },
    data() {
        return {
            resultFields: [
                { key: 'lossName', label: 'Loss Name' },
                { key: 'lossSource', label: 'Loss Source', sortable: true },
                { key: 'minValue', label: 'Min Value', sortable: true },
                { key: 'minTrainName', label: 'Min Train Name' },
                { key: 'maxValue', label: 'Max Value', sortable: true  },
                { key: 'maxTrainName', label: 'Max Train Name' }
            ],
            selectedFilter : 'all'
        };
    },
    computed: {
        filteredResults() {
            return this.results.filter( item =>  this.selectedFilter === 'all' || item.lossSource === this.selectedFilter) 
        },
    },
    methods: {
        openTraining(trainName) {
            window.open(trainName, '_blank');
        },
    }
};
</script>