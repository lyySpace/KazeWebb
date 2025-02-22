<!-- src/components/ToggleShowcase.vue -->
<template>
  <div class="text-container">
      <h3>強置淺色模式 喵</h3>
  </div>
  <div class="w-full min-h-[100px] relative flex items-center justify-center p-8">
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