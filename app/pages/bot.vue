<script setup lang="ts">
import { TELEGRAM_BOT_URL } from '~/components/consts';

// Редирект на Telegram бота
useHead({
  meta: [
    {
      'http-equiv': 'refresh',
      content: `0; url=${TELEGRAM_BOT_URL}`
    }
  ]
})

navigateTo(TELEGRAM_BOT_URL, { external: true })
</script>

<template>
  <div>
    <p>Перенаправление на Telegram бота...</p>
  </div>
</template>

