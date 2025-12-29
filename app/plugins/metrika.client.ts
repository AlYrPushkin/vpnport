// export default defineNuxtPlugin(() => {
//     const COUNTER_ID = 105843920
//
//     if (!import.meta.client) return
//     if ((window as any).__ym_inited) return;
//     (window as any).__ym_inited = true
//
//     // stub как в официальном сниппете (очередь вызовов до загрузки tag.js)
//     ;(function (m: any, e: Document, t: string, r: string, i: string) {
//         m[i] =
//             m[i] ||
//             function () {
//                 ;(m[i].a = m[i].a || []).push(arguments)
//             }
//         m[i].l = new Date().getTime()
//
//         // не добавляем второй раз
//         for (let j = 0; j < e.scripts.length; j++) {
//             if (e?.scripts[j]?.src === r) return
//         }
//
//         const k = e.createElement(t) as HTMLScriptElement
//         const a = e.getElementsByTagName(t)[0] as HTMLElement
//         k.async = true
//         k.src = r
//         a.parentNode?.insertBefore(k, a)
//     })(window as any, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
//
//     ;(window as any).ym(COUNTER_ID, 'init', {
//         ssr: true,
//         webvisor: true,
//         clickmap: true,
//         ecommerce: 'dataLayer',
//         accurateTrackBounce: true,
//         trackLinks: true,
//     })
// })
