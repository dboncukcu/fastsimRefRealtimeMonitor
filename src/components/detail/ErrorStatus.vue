<template>
<span>
    <i class="bi bi-exclamation-triangle-fill h3 text-danger"></i> {{detail}}
</span>
</template>


<script>
export default {
    name: "ErrorStatus",
    props: {
        detail: {
            type: String,
            default: "",
        }
    }
};


</script>