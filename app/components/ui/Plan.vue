<template>
  <div class="plan" v-motion-fade-visible-once>
    <div class="best" v-if="is_best">
      <Icon name="custom:chc" size="14"/>
      Лучший выбор
    </div>
    <h3 :class="nameClass">
      {{ name }}
      <span class="discount" v-if="!!discount">-{{ discount }}%</span>
    </h3>
    <div class="price">
      <span class="price__original">₽{{ price }}</span>
      <span class="price__discounted" v-if="!!oldPrice">/ <span>₽{{ oldPrice }}</span></span>
    </div>
    <a
      class="plan__button"
      :href="link"
      target="_blank"
      rel="noopener"
      aria-label="Открыть Telegram-бота VPN Port"
      title="Открыть в Telegram"
    >
      Оформить подписку
    </a>
  </div>
</template>

<script setup lang="ts">
import type {IPlanView} from '../types/plan';

const data = useTgStartLink()
const link = computed((): string => data.value || 'https://t.me/vpn_portbot')

const {
  name,
  price,
  oldPrice,
  discount,
  is_best
} = defineProps<IPlanView>();
const nameClass = computed(() => {
  return {
    'name': true,
    'name__best': is_best,
  }
})
</script>

<style lang="scss" scoped>
.best {
  position: absolute;
  top: 12px;
  left: 28px;
  display: flex;
  align-items: center;
  font-size: 13px;
  gap: 6px;
}
.plan {
  background-color: var(--surface);
  padding: 28px;
  padding-top: 38px;
  border-radius: 27px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 242px;

  &__button {
    background-color: hsla(241, 91%, 64%, 0.6);
    border-radius: 8px;
    padding: 8px 16px;
    text-align: center;
    color: var(--fg);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }

    &:hover {
      background-color: hsla(241, 91%, 64%, 1);
    }
  }
}

.name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.35%;
  color: var(--fg-tertiary);
  display: flex;
  align-items: center;
  gap: 8px;

  &__best {
    color: hsla(0, 0%, 100%, 1);
  }
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: hsla(0, 0%, 100%, 1);
  display: flex;
  align-items: center;

  &__discounted {
    margin-left: 4px;
    font-size: 25px;
    font-weight: 400;
    color: hsla(0, 0%, 69%, 1);

    span {
      font-size: 25px;
      font-weight: 400;
      color: hsla(0, 0%, 69%, 1);
      text-decoration: line-through;
    }
  }
}

.discount {
  background: linear-gradient(135deg,
      hsla(19, 98%, 53%, 1) 0%,
      hsla(350, 90%, 57%, 1) 50%,
      hsla(335, 88%, 51%, 1) 100%);
  padding: 3px 10px;
  border-radius: 24px;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.08em;
}

@media (max-width: 1063px) {
  .plan {
    min-width: unset;
    width: 100%;
    padding: 24px;
  }
  .best {
    right: 32px;
    top: 32px;
    left: unset;
    font-size: 16px;
    display: flex;
    align-items: center;
    line-height: 8px;
  }
  .name {
    font-size: clamp(18px, 2.5vw, 22px);
  }

  .price {
    font-size: clamp(28px, 4vw, 32px);
  }

  .price__discounted {
    font-size: clamp(18px, 2.5vw, 25px);

    span {
      font-size: clamp(18px, 2.5vw, 25px);
    }
  }
}
</style>