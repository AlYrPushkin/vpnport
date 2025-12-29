<template>
    <div class="footer">
        <div class="footer__tag">Ваши персональные сервера</div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <UiTgButton label="Попробовать в Telegram" class="btn"/>
        <div class="links">
            <div class="links__group">
                <div class="links__group--title">✈️ VPS Port</div>
                <NuxtLink to="/#main">
                    <span>Политика конфиденциальности</span>
                </NuxtLink>
                <NuxtLink to="/#plans">
                    <span>Пользовательское соглашение</span>
                </NuxtLink>
            </div>
            <div class="links__group">
                <div class="links__group--title">💌 Связаться с нами</div>
                <NuxtLink to="/#faq">
                    <span>Telegram Support</span>
                </NuxtLink>
            </div>
            <div class="links__group">
                <div class="links__group--title">🔗 Полезные ссылки</div>
                <NuxtLink to="/#faq">
                    <span>Наш бот</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const title = "Сохраните конфиденциальность";
const description = "Просматривайте сайты не оставляя за собой цифровых следов";
</script>
<style lang="scss" scoped>
.footer {
    background-color: #0E0E0E;
    padding: 24px;
    border-radius: 24px 24px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 48px;
    gap: 24px;
    &__tag {
        transform: translateX(-16px);
        font-size: 16px;
        color: var(--fg);
        background-color: var(--surface);
        padding: 8px 20px;
        border-radius: 60px;
    }
    h2 {
        font-size: 48px;
        line-height: 48px;
    }
}
.btn {
    transform: translateX(-16px);
}
.links {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &__group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        span {
            color: var(--fg-secondary);
        }
        &--title {
            font-size: 16px;
            font-weight: 700;
            color: var(--fg);
        }
    }
}

@media (max-width: 1063px) {
    .footer {
        padding: 24px;
        padding-bottom: 40px;
        gap: 20px;
    }
    
    .footer h2 {
        font-size: clamp(28px, 4vw, 40px);
        line-height: 1.2;
        text-align: center;
    }
    
    .links {
        flex-direction: column;
        gap: 32px;
        align-items: flex-start;
        width: 100%;
    }
    
    .footer__tag {
        transform: translateX(0);
    }
    
    .btn {
        transform: translateX(0);
    }
}
</style>