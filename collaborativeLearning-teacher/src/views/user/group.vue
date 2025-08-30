<template>
  <div class="group-view commonView">
    <t-space align="center" style="margin: 12px;">
      <t-button theme="primary" content="Add New Group" @click="add = true"/>
    </t-space>
    <t-card
      v-for="item in groupList"
      style="width: 300px; margin-bottom: 12px;"
    >
      <t-comment 
        :author="`Group ID: ${item.id}`" 
        :content="`Group Name: ${item.name}`" 
      >
        <!-- <template #actions>
          <t-button variant="text" theme="primary" @click="showMore(item.id)">Detail</t-button>
        </template> -->
      </t-comment>
    </t-card>
  </div>
  <addGroup 
    :show="add"
    @confirm-add="initList"
    @cancel-add="add = false"
  />
  <groupDetail 
    :visible="showGroup"
    :id="currentId"
    @cancel-edit="showGroup = false"
  />
</template>

<script setup lang="ts">
import { getGroupList } from '@/api/modules/users';
import { ref } from 'vue'
import groupDetail from './components/groupDetail.vue';
import addGroup from './components/addGroup.vue';

const add = ref(false)

const showGroup = ref(false)
const currentId = ref<any>()
const showMore = (id: any) => {
  showGroup.value = true
  currentId.value = id
}

const groupList = ref<any>([])
const initList = () => {
  getGroupList()
  .then((res)=> {
    console.log(res.data)
    groupList.value = res.data
  })
}

initList()
</script>

<style scoped>
.group-view {
  overflow-y: auto;
  padding-bottom: 5vh;
}
</style>