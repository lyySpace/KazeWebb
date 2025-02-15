<!-- src/components/ToggleShowcase.vue -->
<template>
  <div class="w-full min-h-[200px] relative flex items-center justify-center p-8 border border-gray-300">
    <toggle-proactive
      :model-value="true"
      disabled
      size="6rem"
      track-inactive-class="bg-red-400"
      track-active-class="bg-green-500"
      fur-color="#e9d680"
      pad-color="#6f6565"
    />
  </div>
</template>

<script setup lang="ts">
import ToggleProactive from './CatToggle.vue'
</script>