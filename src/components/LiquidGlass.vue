<template>
  <!-- 拖曳用 wrapper -->
  <div
    class="draggable-wrapper"
    ref="wrapper"
    @mousedown="onDragStart"
  >
    <!-- 原本的玻璃面板 -->
    <div
      class="liquid-glass"
      @mousemove="onMove"
      @mouseleave="onLeave"
      ref="glass"
    >
      <!-- 內容可自行調整 -->
      <h1></h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'

// 拖曳狀態
const wrapper = ref<HTMLElement|null>(null)
const dragState = reactive({
  active: false,
  startX: 0,
  startY: 0,
  posX: 0,
  posY: 0,
})

// 開始拖曳
function onDragStart(e: MouseEvent) {
  dragState.active = true
  dragState.startX = e.clientX - dragState.posX
  dragState.startY = e.clientY - dragState.posY
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', onDragEnd)
}

// 拖曳中
function onDrag(e: MouseEvent) {
  if (!dragState.active || !wrapper.value) return
  dragState.posX = e.clientX - dragState.startX
  dragState.posY = e.clientY - dragState.startY
  wrapper.value.style.transform = `translate(${dragState.posX}px, ${dragState.posY}px)`
}

// 拖曳結束
function onDragEnd() {
  dragState.active = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', onDragEnd)
}

// 清理事件
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', onDragEnd)
})

// 以下就是原本旋轉效果的程式
import { ref as vueRef } from 'vue'
const glass = vueRef<HTMLElement|null>(null)
function onMove(e: MouseEvent) {
  if (!glass.value) return
  const x = (e.clientX / window.innerWidth - 0.5) * 20
  const y = (e.clientY / window.innerHeight - 0.5) * 20
  glass.value.style.transform = 
    `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`
}
function onLeave() {
  if (!glass.value) return
  glass.value.style.transform = 'perspective(600px) rotateY(0) rotateX(0)'
}
</script>

<style scoped>
.draggable-wrapper {
  position: absolute; /* 或 fixed，看要相對誰拖 */
  top: 0;
  left: 0;
  cursor: grab;
}
.draggable-wrapper:active {
  cursor: grabbing;
}

.liquid-glass {
  width: 250px;
  height: 250px;
  padding: 1rem;
  background: rgba(51, 94, 234, 0.1);
  background-blend-mode: overlay;
  border: 1px solid rgba(245,245,245, 0.3);
  border-radius: 16px;
  backdrop-filter: url(#goo) blur(10px) saturate(150%);
  -webkit-backdrop-filter: url(#goo) blur(10px) saturate(150%);
  transition: transform 0.2s ease-out;
  overflow: hidden;
  color: #d6c6c6;
  text-align: center;
  /* 使用雲形mask */
  mask-image: url('/icon.png');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  -webkit-mask-image: url('/icon.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}

/* 氣泡動畫 */
.liquid-glass::before,
.liquid-glass::after {
  content: "";
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%);
  animation: float 6s ease-in-out infinite;
}
.liquid-glass::after { animation-delay: 3s; }
@keyframes float {
  0%,100% { transform: translate(0,0) scale(1); }
  50%    { transform: translate(20%,20%) scale(1.2); }
}
</style>
