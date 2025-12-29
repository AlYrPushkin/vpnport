<template>
    <article class="card" v-motion-fade-visible-once>
        <div class="card__content">
            <h3 class="card__title">
                <Icon :name="icon" v-if="!!icon" size="32"/>
                {{ title }}
            </h3>
            <p class="card__description">
                {{ description }}
            </p>
            <slot />
        </div>
    </article>
</template>

<script setup lang="ts">
import type { ICard } from '../types/card';

const props = defineProps<ICard>()
</script>

<style scoped>
.card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    
    padding: 39px 27px;
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
    flex: 1 1 auto;
    min-width: 0;
}

.card__title {
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
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
    .card {
        padding: 28px 20px;
    }
    
    .card__title {
        font-size: clamp(20px, 3vw, 26px);
        margin-bottom: 14px;
    }
    
    .card__description {
        font-size: clamp(16px, 2.2vw, 18px);
    }
}
</style>