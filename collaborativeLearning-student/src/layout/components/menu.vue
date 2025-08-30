<template>
  <t-menu :collapsed="collapsed" v-model:value="routerStore.currentMenu">
    <template #logo>
      <img v-if="collapsed" height="32" src="@/assets/images/common/logo-small.png" alt="logo" />
      <t-space v-else :size="1" direction="vertical">
        <h3 class="title">Collaborative Learning</h3>
        <t-tag theme="success" shape="round">Student</t-tag>
      </t-space>
    </template>
    <t-menu-item value="0" to="/home" :class="{'t-is-active': routerStore.currentMenu == 0}" content="Home">
      <template #icon><t-icon name="home" /></template>
    </t-menu-item>

    <t-menu-item value="1" to="/case" :class="{'t-is-active': routerStore.currentMenu == 1}" content="Case">
      <template #icon><t-icon name="task" /></template>
    </t-menu-item>

    <t-menu-item value="2" to="/resource" :class="{'t-is-active': routerStore.currentMenu == 2}" content="Resource">
      <template #icon><t-icon name="app" /></template>
    </t-menu-item>

    <t-menu-item value="4" to="/notice" :class="{'t-is-active': routerStore.currentMenu == 4}" content="Notice">
      <template #icon><t-icon name="info-circle" /></template>
    </t-menu-item>

    <t-menu-item value="5" to="/user" :class="{'t-is-active': routerStore.currentMenu == 5}" content="User">
      <template #icon><t-icon name="user" /></template>
    </t-menu-item>

    <t-menu-item value="3" to="/data" :class="{'t-is-active': routerStore.currentMenu == 3}" content="Data">
      <template #icon><t-icon name="leaderboard" /></template>
    </t-menu-item>

    <t-menu-item value="6" to="/team" :class="{'t-is-active': routerStore.currentMenu == 6}" content="Submission">
      <template #icon><t-icon name="upload" /></template>
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

const collapsed = ref(false)
const iconName = computed(() => collapsed.value ? 'chevron-right' : 'chevron-left');
const changeCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  color: #fff;
  background: -webkit-linear-gradient(45deg, #f26326, #006437);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>