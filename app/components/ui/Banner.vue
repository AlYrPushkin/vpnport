<template>
    <article class="card">
        <div class="card__content">
            <p class="card__description">
                {{ label }}
            </p>
            <UiTgButton :to="to" :label="buttonLabel"/>
        </div>
    </article>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
    label?: string
    to?: string
    buttonLabel?: string
}>(), {
    label: "Приятный досуг без зависаний интернета даже если белые списки уже в вашем регионе",
    buttonLabel: "Начать",
    to: "/"
})

</script>

<style scoped>
.card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    padding: 16px 20px;
    border-radius: 16px;

    background-color: var(--surface);
    /* тёмный фон как на скрине */
    color: var(--color-text, #e5e7eb);
}

/* обёртка вокруг иконки (круглая как чип) */
.card__icon {
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    border-radius: 999px;

    display: flex;
    align-items: center;
    justify-content: center;
}

/* сам <Icon> наследует размер из глобальных настроек nuxt-icon */
.card__icon :deep(svg),
.card__icon :deep(span) {
    width: 20px;
    height: 20px;
}

/* текстовая часть */
.card__content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
}

.card__title {
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 26px;
    font-weight: 700;
}

.card__description {
    margin: 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.4;
    white-space: pre-line;
    /* чтобы "\n" в строке давали перенос, как у тебя на скрине */
}

@media (max-width: 1063px) {
    .card__content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
    
    .card__description {
        font-size: clamp(16px, 2.2vw, 18px);
    }
}
</style>