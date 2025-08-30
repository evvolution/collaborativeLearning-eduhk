<template>
  <div class="data-view commonView">
    <div class="section-main">
      <div class="chart-content">
        <groupChatLine />
      </div>
      <div class="chart-content">
        <linksNet />
      </div>
    </div>
    <div class="section-right">
      <div class="chart-content">
        <wordCloudMine  />
      </div>
      <div class="chart-content">
        <wordCloudGroup />
      </div>
      <!-- <div class="chart-content">
        <emojisPanel />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import datasPanel from './charts/datas.vue'
// import studyTimePanel from './charts/studyTime.vue'
// import topicRanksPanel from './charts/topicRanks.vue'
// import infoAnalysePanel from './charts/infoAnalyse.vue'
// import postsPanel from './charts/posts.vue'
// import emojisPanel from './charts/emojis.vue'

import groupChatLine from './charts/groupChatLine.vue'
import linksNet from './charts/linksNet.vue'
import wordCloudMine from './charts/wordCloudMine.vue'
import wordCloudGroup from './charts/wordCloudGroup.vue'

// import { onMounted, ref } from 'vue'
// import NotificationPlugin from 'tdesign-vue-next/es/notification/plugin'
// NotificationPlugin.info({
//   title: 'Fake Data',
//   content: 'Developing'
// })
</script>
<style scoped lang="scss">
.data-view {
  position: relative;
  display: flex;
  column-gap: 6px;
  min-height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
  .section-main {
    flex: 3;
    width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    .datas-content {
      flex: 1;
    }
    .chart-content {
      flex: 2;
    }
  }
  .section-right {
    flex: 2;
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    .chart-content {
      flex: 1;
    }
  }
  .chart-content {
    background-color: #f8f8f8;
    padding: 4px;
  }
}
</style>