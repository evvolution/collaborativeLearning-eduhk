<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import merge from 'lodash/merge';
import enConfig from 'tdesign-vue-next/es/locale/en_US';

const route = useRoute()
const key = computed(() => {
  return route.path + Math.random()
})

const globalConfig = merge(enConfig, {
  calendar: {},
  table: {},
  pagination: {},
})
</script>

<template>
  <t-config-provider :global-config="globalConfig">
    <RouterView :key="key" />
  </t-config-provider>
</template>

<style scoped>

</style>
