<template>
  <t-menu :collapsed="collapsed" v-model:value="routerStore.currentMenu">
    <template #logo>
      <img v-if="collapsed" height="32" src="@/assets/images/common/logo-small.png" alt="logo" />
      <t-space v-else :size="1" direction="vertical">
        <h3 class="title">Collaborative Learning</h3>
        <t-tag theme="danger" shape="round">Teacher</t-tag>
      </t-space>
    </template>
    <t-menu-item value="0" to="/home" :class="{'t-is-active': routerCurrent == 0}" content="Home">
      <template #icon><t-icon name="home" /></template>
    </t-menu-item>

    <t-menu-item value="1" to="/case" :class="{'t-is-active': routerCurrent == 1}" content="Cases">
      <template #icon><t-icon name="task" /></template>
    </t-menu-item>

    <t-menu-item value="2" to="/resource" :class="{'t-is-active': routerCurrent == 2}" content="Resource">
      <template #icon><t-icon name="app" /></template>
    </t-menu-item>

    <t-menu-item value="3" to="/data" :class="{'t-is-active': routerCurrent == 3}" content="Data">
      <template #icon><t-icon name="leaderboard" /></template>
    </t-menu-item>

    <t-menu-item value="4" to="/notice" :class="{'t-is-active': routerCurrent == 4}" content="Notice">
      <template #icon><t-icon name="info-circle" /></template>     
    </t-menu-item>

    <t-menu-item value="5" to="/user" :class="{'t-is-active': routerCurrent == 5}" content="Users">
      <template #icon><t-icon name="user" /></template>
    </t-menu-item>

    <t-menu-item value="6" to="/team" :class="{'t-is-active': routerCurrent == 6}" content="Submission">
      <template #icon><t-icon name="upload" /></template>
    </t-menu-item>

    <t-menu-item value="7" to="/survey" :class="{'t-is-active': routerCurrent == 7}" content="Survey Set">
      <template #icon><t-icon name="setting" /></template>
    </t-menu-item>

    <template #operations>
      <t-space align="center" @click.native="changeCollapsed">
        <t-button variant="text" shape="square">
          <template #icon><t-icon :name="iconName" /></template>
        </t-button>
        <img height="36" src="https://www.eduhk.hk/cms/assets/shared/img/logo_foot.png" alt="logo" v-if="!collapsed"/>
      </t-space>
    </template>
  </t-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouterStore } from '@/store/router'
const routerStore = useRouterStore()
const routerCurrent = routerStore.currentMenu

const collapsed = ref(false)
const iconName = computed(() => collapsed.value ? 'chevron-right' : 'chevron-left');
const changeCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>