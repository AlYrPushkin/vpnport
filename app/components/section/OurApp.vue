<template>
    <section id="OurApp" class="content__container">
        <UiLogo />
        <h2>{{ title }}</h2>
        <div class="cards__container">
            <div v-for="card in OUR_APP_CARDS" :key="card.bold" class="card__container">
                <span>
                    <strong>{{ card.bold }}</strong>
                    <span>{{ card.text }}</span>
                </span>
            </div>
        </div>
        <UiPhones />
    </section>
</template>

<script setup lang="ts">
import { OUR_APP_CARDS } from '../consts';

const title = "Наше мульти\nприложение"


</script>

<style scoped>
.content__container {
    position: relative;
    width: 100%;
    background-color: var(--surface);
    border-radius: 27px;
    padding: 64px 47px;
}
.content__container h2 {
    white-space: pre-line;
    font-size: 48px;
    line-height: 62px;
    margin-bottom: 12px;
}
.card__container {
    white-space: pre-line;
    font-size: 20px;
    line-height: 1.6;
}
.card__container strong {
    margin-right: 6px;
}
.cards__container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (max-width: 1063px) {
    .content__container {
        padding: 32px 24px;
    }
    
    .content__container h2 {
        font-size: clamp(28px, 4vw, 40px);
        line-height: 1.3;
    }
    
    .card__container {
        font-size: clamp(16px, 2.5vw, 20px);
    }
}
</style>