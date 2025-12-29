<template>
    <Layout>
        <SectionMain />
        <SectionAboutApp />
        <SectionFAQ />
        <SectionPlans />
        <SectionPromo />
        <SectionOurApp />
        <SectionAiPromo />
    </Layout>
</template>

<script setup lang="ts">
const siteUrl = 'https://vpn-port.com'
const siteName = 'VPN Port'
const title = 'VPN Port — быстрый VPN/прокси без блокировок'
const description = 'Приватный прокси-сервис, который невозможно заблокировать. Настрой за 1 минуту и пользуйся на полной скорости. Мы готовы помочь 24/7.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: '/og.png',
  ogSiteName: siteName,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/og.png',
  robots: 'index, follow',
  themeColor: '#1a1a1f'
})

useHead({
  link: [
    { rel: 'canonical', href: siteUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        description: description,
        sameAs: []
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: description
      })
    }
  ]
})
</script>