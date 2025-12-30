<template>
    <div class="phones__container">
        <img :src="PH1" alt="Скриншот приложения VPN Port на iPhone" class="small_phone" />
        <img :src="PH2" alt="Скриншот приложения VPN Port на iPhone в увеличенном виде" class="main_phone" />
    </div>
</template>

<script setup lang="ts">
import PH1 from '~/assets/images/ph1.png'
import PH2 from '~/assets/images/ph2.png'

</script>

<style scoped>
.phones__container {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 552px;
    height: 622px;
}

.main_phone {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate(calc(100% - (50% - 72px)), 0);
    width: 298px;
    height: 622px;
    z-index: 2;
}

.small_phone {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 262px;
    height: 546px;
    z-index: 1;

}

@media (max-width: 1063px) {
    .phones__container {
        bottom: unset;
        top: 0px;
        z-index: -2;
        display: none;
    }
}
</style>