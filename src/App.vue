<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ToggleShowcase from './components/ToggleShowcase.vue'
</script>

<template>
  <div>
    <img alt="kaze logo" src="./assets/logo.png" />
  </div>
  <HelloWorld msg="Welcome KAZE" />
  <ToggleShowcase />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
