<template>
  <div class="gallery-grid">
    <div 
      v-for="(img, idx) in images" 
      :key="idx" 
      class="gallery-item"
    >
      <img :src="img.src" :alt="img.alt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const images = ref([
  { src: '/images/1.jpg', alt: '圖1' },
  { src: '/images/2.jpg', alt: '圖2' },
  { src: '/images/3.jpg', alt: '圖3' },
])
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三欄等分 */
  gap: 1rem;                             /* 欄間距 */
  padding: 1rem;
}

.gallery-item {
  width: 400px;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 圖片裁切填滿 */
  transition: transform .3s;
}

.gallery-item img:hover {
  transform: scale(1);
}
</style>
