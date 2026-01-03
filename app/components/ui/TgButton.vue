<template>
  <a
      :href="link"
      class="tg-button"
      target="_blank"
      rel="noopener"
      aria-label="Открыть Telegram-бота VPN Port"
      title="Открыть в Telegram"
  >
    <div class="bordered">
      <Icon name="custom:telegram" size="10"/>
    </div>
    <span>{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
import {useTgStartLink} from "~/composables/useTgLink";
import { TELEGRAM_BOT_URL } from '../consts';

interface ITGButtonProps {
  label?: string,
  to?: string,
}

const props = defineProps<ITGButtonProps>()
const data = useTgStartLink()
const link = computed((): string => props.to || data.value || TELEGRAM_BOT_URL)
</script>

<style scoped>
.bordered {
  position: relative;
  background-color: hsla(200, 100%, 40%, 1);
  width: 24px;
  height: 24px;
  border-radius: 100%;
}

.bordered svg {
  position: absolute;
  top: 7px;
  left: 5px;
}

.tg-button {
  display: flex;
  background-color: hsla(0, 0%, 100%, 1);
  align-items: center;
  gap: 8px;
  border-radius: 60px;
  height: 42px;
  padding: 0px 24px;
}

.tg-button span {
  color: hsla(0, 0%, 0%, 1);
}
</style>
