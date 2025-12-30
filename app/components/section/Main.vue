<template>
    <section id="main" class="main">
        <div class="main__content">
            <UiLogo />
            <h1 v-motion-fade-visible-once>{{ title }}</h1>
            <p v-motion-fade-visible-once>
                Приватный прокси-сервис, который невозможно заблокировать.
                <strong>{{`\n${bolds[0]}` }}</strong>
                и пользуйся на полной скорости
                <strong>{{ description }}</strong>
                {{ `\nМы готовы` }}
                <strong>{{ bolds[1] }}</strong>
            </p>
            <UiTgButton label="Попробовать в Telegram" />
            <Icon name="custom:msg" size="68" class="msg_icon" v-motion-roll-right />
            <Icon name="custom:pl" size="54" class="pl_icon" v-motion-roll-top />
            <Icon name="custom:tx" size="79" class="tx_icon" v-motion-roll-bottom />
            <Icon name="custom:ic" size="67" class="ic_icon" v-motion-roll-left />
            <Icon name="custom:act" size="60" class="act_icon" v-motion-roll-top />
            <Icon name="custom:doc" size="60" class="doc_icon" v-motion-roll-right />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { minPrice } = useTariffs()
const title = "Соцсети и интернет\nбез границ и фильтров";
const bolds = [
    "Настрой за 1 минуту",
    "готовы помочь 24/7"
]
const description = computed(() => {
    const price = minPrice.value || '-'
    return `от ${price}₽.`;
})
</script>

<style scoped>
.main__content {
    margin: 0 auto;
    margin-top: 15%;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
    text-align: center;
    gap: 24px;
    position: relative;
}

.main h1 {
    line-height: 62px;
}

.msg_icon,
.pl_icon,
.tx_icon,
.ic_icon,
.act_icon,
.doc_icon {
    position: absolute;
    /* transform: translate(-50%, 50%); */
}

.msg_icon {
    top: -30%;
    right: -20%;
}

.doc_icon {
    top: calc(50% - 27px);
    right: -35%;
}

.pl_icon {
    top: -28%;
    right: 30%;
}

.ic_icon {
    top: calc(45% - 48px);
    left: -30%;
}

.tx_icon {
    bottom: -30%;
    left: -5%;
}

.act_icon {
    top: -22%;
    left: 10%;
}

.main p {
    font-size: 20px;
    line-height: 1.4;
}

@media (max-width: 1063px) {
    .main__content {
        margin-top: 10%;
        gap: 20px;
    }

    .main h1 {
        font-size: clamp(32px, 5vw, 48px);
        line-height: 1.3;
    }

    .main p {
        font-size: clamp(16px, 2.5vw, 20px);
    }

    .msg_icon,
    .pl_icon,
    .tx_icon,
    .ic_icon,
    .act_icon,
    .doc_icon {
        transform: scale(0.8);
    }

    .msg_icon {
        top: -20%;
        right: -5%;
    }

    .doc_icon {
        top: calc(50% - 27px);
        right: -5%;
    }

    .pl_icon {
        top: -30%;
        left: 25%;
    }

    .ic_icon {
        top: calc(80% - 48px);
        left: calc((1% + 32px) * -1);
    }

    .tx_icon {
        bottom: -55%;
        left: 40%;
    }

    .act_icon {
        top: -15%;
        left: -15%;
    }
}
</style>