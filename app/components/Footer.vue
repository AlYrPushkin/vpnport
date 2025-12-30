<template>
    <div class="footer">
        <div class="footer__tag">Ваши персональные сервера</div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <UiTgButton label="Попробовать в Telegram" class="btn"/>
        <div class="links">
            <div class="links__group">
                <div class="links__group--title">✈️ VPS Port</div>
                <NuxtLink to="https://buildin.ai/port/9d423438-8a32-422d-9246-b0842a06a9d6">
                    <span>Политика конфиденциальности</span>
                </NuxtLink>
                <NuxtLink to="https://buildin.ai/port/615f4d7f-6dc7-41e6-92d8-681e97f4cb46">
                    <span>Пользовательское соглашение</span>
                </NuxtLink>
            </div>
            <div class="links__group">
                <div class="links__group--title">💌 Связаться с нами</div>
                <NuxtLink to="https://t.me/vpnportsupport">
                    <span>Telegram Support</span>
                </NuxtLink>
                <NuxtLink to="https://forms.gle/qceyWXPNxXWxLvFt7">
                    <span>Форма поддержки</span>
                </NuxtLink>
                 
            </div>
            <div class="links__group">
                <div class="links__group--title">🔗 Полезные ссылки</div>
                <NuxtLink to="https://t.me/vpn_portbot">
                    <span>Наш бот</span>
                    
                </NuxtLink>
                <NuxtLink to="https://buildin.ai/port/share/08cc713a-4da7-4b19-9ffa-6eb052714c72?code=XPB9WF">
                    <span>База знаний</span>
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
    padding: 32px;
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
        text-align: center;
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
        width: unset;
        width: 243px;
        // width: 100%;
    }
    .links__group {
        display: flex;
        width: 243px;
        justify-content: center;
        align-items: center;
    }
    .footer__tag {
        transform: translateX(0);
    }
    
    .btn {
        transform: translateX(0);
    }
}
</style>