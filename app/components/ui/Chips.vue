<template>
    <div class="chips__container">
        <span class="chip" v-for="chip in cheaps">
            {{ chip }}
        </span>
    </div>
</template>
<script setup lang="ts">
    defineProps<{
        cheaps: string[]
    }>()
    
    </script>
<style scoped>
.chips__container {
    display: flex;
    gap: 8px;
}
.chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    background: #101114;
    color: white;
    font-size: 12px;
    line-height: 1;
    cursor: default;
    white-space: nowrap;
}

.chip.clickable {
    cursor: pointer;
}

.chip.clickable:hover {
    background: #1a1c20;
}
@media (max-width: 1063px) {
    .chip {
        width: 125px;
        text-align: center;
        display: flex;
        justify-content: center;
    }
}
</style>