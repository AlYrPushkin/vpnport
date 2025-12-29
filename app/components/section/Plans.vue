<template>
  <section id="plans" class="content__container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="plans__container">
      <p style="white-space: nowrap;">Выберете длительность ➡️</p>
      <UiPlan v-for="plan in listPlans" v-bind="plan"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import {PLANS} from '../consts';
import {computed} from 'vue'
import type {IPlanView} from "~/components/types/plan";

const {plans} = useTariffs()
const listPlans = computed<IPlanView[]>(() => {
  return plans.value || PLANS
})
const title = "Честные тарифы без скрытых платежей";
const description = `Все планы включают максимальную скорость и безлимитный трафик`;
</script>

<style lang="scss" scoped>
.plans__container {
  display: flex;
  width: 100%;
  gap: 36px;
}

.content__container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  h2 {
    font-size: 48px;
  }
}

@media (max-width: 1063px) {
  .plans__container {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .content__container {
    gap: 20px;

    h2 {
      font-size: clamp(28px, 4vw, 40px);
      text-align: center;
    }
  }
}
</style>