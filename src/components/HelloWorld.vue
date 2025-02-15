<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>
    Some cute & cool things<br>
  </p>
    <h3>Hiiii</h3>
    <ul>
      <li><a href="https://www.instagram.com/detached._.kenun?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener">Instagram</a></li>
      <li><a href="https://github.com/lyySpace" target="_blank" rel="noopener">GitHub</a></li>
    </ul>
  
  <div>
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
