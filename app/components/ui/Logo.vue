<template>
    <NuxtLink to="/#main" class="header__logo">
        <Icon name="custom:stars" />
        VPS Port
    </NuxtLink>
</template>

<style scoped>
.header__logo {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: fit-content;
    background-color: #151619;
    border-radius: 60px;
    height: 42px;
    line-height: 18px;
    padding: 0 16px;
    border: 1px solid hsla(220, 9%, 13%, 1);
    padding-right: 24px;
    text-decoration: none;
}
</style>