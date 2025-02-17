<!-- src/components/ToggleShowcase.vue -->
<template>
  <div class="w-full min-h-[200px] relative flex items-center justify-center p-8">
    <toggle-proactive
      :model-value="true"
      disabled
      size="4rem"
      track-active-class="bg-green-500"
      fur-color="#e9d680"
      pad-color="#6f6565"
    />
  </div>
</template>

<script setup lang="ts">
import ToggleProactive from './CatToggle.vue'
</script>