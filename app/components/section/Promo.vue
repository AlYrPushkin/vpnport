<template>
    <section id="about" class="content__container">
        <UiCheapsTitle
            :title="title"
            :description="description"
            :cheaps="cheaps"
        />
        <div class="cards__container">
            <UiCard
                v-for="card in FEATURES"
                v-bind="card"
                class="item"
            />
        </div>
        <UiBanner label="Ваша свобода и безопасность наш приоритет" buttonLabel="Защититься" to="/"/>
    </section>
</template>

<script setup lang="ts">
import { FEATURES } from '../consts';

const title = "Работает там,\nгде другие сдаются"
const description = "Мы используем протоколы нового поколения,\nкоторые невозможно отличить от обычного\nинтернет-трафика"
const cheaps = ["VLESS", "Белые списки", "Прямой канал"];

</script>

<style scoped>
.cards__container {
    display: flex;
    width: 100%;
    gap: 24px;
    margin-top: 40px;

}
.item {
    flex: 1 1 0;
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
        flex-direction: column;
        gap: 20px;
        margin-top: 32px;
    }
}
</style>