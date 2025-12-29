<script setup lang="ts">
</script>
<template>
    <header class="header">
        <div class="content__container">
            <UiLogo />
            <div class="header__links">
                <NuxtLink to="/#plans">
                    <span>Тарифы</span>
                </NuxtLink>
                <NuxtLink to="/#about">
                    <span>База знаний</span>
                </NuxtLink>
                <NuxtLink to="/#faq">
                    <span>Как подключить</span>
                </NuxtLink>
                <NuxtLink to="/#about">
                    <span>Поддержка</span>
                </NuxtLink>
            </div>
            <UiTgButton label="Попробовать в Telegram" class="test" />
        </div>
    </header>
</template>

<style scoped>
.header__links {
    display: flex;
    gap: 32px;
}

.content__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 40px;
    display: flex;
    align-items: center;
    gap: 42px;
}

.header {
    background-color: #0E0E0E;
    width: 100%;
}

@media (max-width: 1063px) {
    .header {
        display: none;
    }
}

.test {
    margin-left: auto;
}
</style>