<template>
    <div class="layout">
        <Header />
        <main id="main-content" class="content">
            <slot />
            <Footer />
        </main>
    </div>
</template>
<style scoped>
.content {
    max-width: 1440px;
    margin: 0 auto;
    padding: 48px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    gap: 250px;
}
@media (max-width: 1063px)  {
    .content {
        padding: 48px 24px;
    padding-bottom: 0px;

    }
}
</style>