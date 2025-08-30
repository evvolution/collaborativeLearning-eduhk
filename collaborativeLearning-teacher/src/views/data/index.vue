<template>
  <div class="data-view">
    <div class="data-section">
      <groupChatLine />
    </div>
    <div class="data-section">
      <linksNet />
    </div>
    <div class="data-section">
      <wordCloud />
    </div>
  </div>
</template>

<script setup lang="ts">
// import emojisPanel from './charts/emojis.vue'

import groupChatLine from './charts/groupChatLine.vue'
import linksNet from './charts/linksNet.vue'
import wordCloud from './charts/wordCloud.vue'


</script>

<style scoped lang="scss">
.data-view {
  position: fixed;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  height: calc(100vh - 65px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  box-sizing: border-box;
  width: calc(100% - 240px);
}


.data-section {
  position: relative;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}
</style>