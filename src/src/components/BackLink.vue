<!-- components/BackLink.vue -->
<template>
  <router-link
    :to="to"
    class="flex items-center text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-amber-200 transition-colors mb-6 group"
  >
    <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">
      ←
    </span>
    {{ text }}
  </router-link>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  to: {
    type: [String, Object],
    required: true,
  },
});
</script>