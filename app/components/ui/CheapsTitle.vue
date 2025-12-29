<template>
    <div class="cheaps__container">
        <div class="cheaps__title">
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
        </div>
        <UiChips :cheaps="cheaps" class="cheaps__chips" />
    </div>
</template>

<script setup lang="ts">
interface ICheapsTitleProps {
    title: string,
    description: string,
    cheaps: string[],
}
const props = defineProps<ICheapsTitleProps>()

</script>

<style scoped>
.cheaps__container {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 12px;
}
.cheaps__title {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.cheaps__title p {
    display: block;
    max-width: 460px;
}

.cheaps__title h2 {
    white-space: pre-line;
}

@media (max-width: 1063px) {
    .cheaps__container {
        align-items: center;
    }
    .cheaps__title {
        flex-direction: column;
        align-items: center;
        gap: 16px;
        h2 {
            white-space: pre-line;
            text-align: center;
        }
        p {
            text-align: center;
        }
    }
    .cheaps__chips {
        justify-content: center;
        flex-wrap: wrap;
        max-width: 264px;
    }
    .cheaps__title p {
        max-width: 100%;
    }
}
</style>