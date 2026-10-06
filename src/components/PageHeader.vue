<script setup>
import HeroBackground from './HeroBackground.vue'

defineProps({ title: String, subtitle: String })
</script>

<template>
  <section class="relative overflow-hidden bg-[#1b0909] text-amber-50">
    <HeroBackground />
    <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl"></div>
    <div class="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-14">
      <h1 class="font-display text-3xl font-bold sm:text-4xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-2 text-[#f8eaea]/80">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>
