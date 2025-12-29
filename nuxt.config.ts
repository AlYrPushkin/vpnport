// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/styles/base.css'],
    devtools: {enabled: true},
    modules: [
        '@nuxt/icon',
        // '@vueuse/motion/nuxt',
    ],
    imports: {dirs: ['composables']},
    icon: {
        customCollections: [
            {
                prefix: 'custom',
                dir: './app/assets/icons',
            },
        ],
    },

    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
                // { rel: 'alternate icon', href: '/favicon.ico' }
            ],
            script: [
                {
                    key: 'yandex-metrika',
                    type: 'text/javascript',
                    tagPosition: 'bodyClose',
                    innerHTML: `(function(m,e,t,r,i,k,a){
m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j=0; j<document.scripts.length; j++){if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105843920', 'ym');

ym(105843920, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`,
                },
            ],
            noscript: [
                {
                    key: 'yandex-metrika-ns',
                    tagPosition: 'bodyClose',
                    innerHTML:
                        '<div><img src="https://mc.yandex.ru/watch/105843920" style="position:absolute; left:-9999px;" alt="" /></div>',
                },
            ],
            ...({
                __dangerouslyDisableSanitizersByTagID: {
                    'yandex-metrika': ['innerHTML'],
                    'yandex-metrika-ns': ['innerHTML'],
                },
            } as any),
        }
    }

})