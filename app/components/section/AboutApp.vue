<template>
    <section id="about" class="content__container">
        <UiCheapsTitle :title="title" :description="description" :cheaps="cheaps" />
        <div class="cards__container">
            <UiCard v-for="card in CARDS" v-bind="card" class="item" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { CARDS } from '../consts';

const title = "Забудьте про\n«бесконечную загрузку»"
const description = `Наш сервис оптимизирован под тяжелый контент. Мы не просто даем доступ, мы сохраняем привычную скорость интернета`
const cheaps = ["YouTube в 4K", "Соцсети", "Telegram", "Быстрый"];

</script>

<style scoped>
.cards__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    width: 100%;
    margin-top: 40px;

}

.content__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
}

@media (max-width: 1063px) {
    .cards__container {
        grid-template-columns: 1fr;
        gap: 20px;
        margin-top: 32px;
    }
}
</style>