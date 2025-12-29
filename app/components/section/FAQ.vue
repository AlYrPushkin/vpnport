<template>
    <section id="faq" class="content__container">
        <div class="title__container">
            <h2>Начните пользоваться прямо сейчас</h2>
            <p>Весь процесс от запуска бота до первого выхода в сеть занимает меньше минуты</p>
        </div>
        <div class="steps">
            <UiCard title="1️⃣ Запустите бота и выберете тариф"
                description="Он расскажет вам о тарифах и поможет с выбором. Прямо в боте встроена плата. Мы принимаем карты российских банков, СБП.">
                <img :src="SC1" alt="Шаг 1: Выбор тарифа в Telegram боте VPN Port" class="image" />
            </UiCard>
            <div class="side">
                <UiCard class="step-card" title="2️⃣ Запустите бота и выберете тариф"
                    description="После покупки бот выдаст персональный ключ от сервера">
                    <img :src="SC2" alt="Шаг 2: Получение персонального ключа от сервера" class="image" />
                </UiCard>
                <UiCard class="step-card" title="3️⃣ Запустите бота и выберете тариф"
                    description="Вставьте ключ в приложение по инструкции в боте. Мы поддерживаем:">
                    <div class="support">
                        <div>🍏 <span>IOS:</span> iPhone, iPad, MacBook и iMac</div>
                        <div>🤖 <span>Android:</span> Получите ключ</div>
                        <div>💻 <span>Windows:</span> Подключитесь</div>
                    </div>
                </UiCard>
            </div>
        </div>

        <UiBanner label="У вас всё получится, а если нет, то наша поддержка рада помочь 24/7 ❤️" buttonLabel="Подключится" to="/"/>
    </section>
</template>

<script setup lang="ts">
import SC1 from '~/assets/images/sc1.png'
import SC2 from '~/assets/images/sc2.png'

</script>

<style scoped>
.title__container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.content__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
}
.image {
    margin-top: 24px;
}
.steps {
    display: flex;
    gap: 24px;
}
.side {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.support {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.support div {
    color: var(--fg-tertiary);
}
.support span {
    color: var(--fg-secondary);
    font-weight: 700;
}

@media (max-width: 1063px) {
    .title__container {
        h2 {
            text-align: center;
        }
        p {
            text-align: center;
        }
    }
    .steps {
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }
    
    .side {
        gap: 20px;
    }
}
</style>