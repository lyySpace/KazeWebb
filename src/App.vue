<!-- src/App.vue -->
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ToggleShowcase from './components/ToggleShowcase.vue'
import LiquidGlass from './components/LiquidGlass.vue'
import Gallery from './components/TheGallery.vue'
import CloudSection from './components/CloudSection.vue'
</script>

<template>
  <div>
    <img alt="kaze logo" src="./assets/logo.png" />
  </div>
  <HelloWorld msg="Welcome KAZE" />
  <ToggleShowcase />
  <LiquidGlass />
  <Gallery />
  <CloudSection/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.picture {
  height: 30em;
  padding: 1em;
}
</style>
