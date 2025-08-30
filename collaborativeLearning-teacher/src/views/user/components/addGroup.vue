<template>
  <t-dialog 
    :visible="show"
    :closeBtn="false"
    :closeOnOverlayClick="false"
    header="Add New Group"
    :destroyOnClose="true"
    @confirm="confirmAdd"
    @cancel="cancelAdd"
  >
    <t-form label-align="top">
      <t-form-item label="Group Name">
        <t-input v-model="name" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { addGroup, addStudent, getGroupList } from '@/api/modules/users'
import { pngUrl } from '@/utils/common';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue'
const props = defineProps({
  show: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits(['confirmAdd', 'cancelAdd'])

const cancelAdd = () => {
  emit('cancelAdd')
}

const name = ref<any>()

const confirmAdd = () => {
  addGroup(name.value)
  .then((res: any)=> {
    if (res.code == 200) {
      emit('confirmAdd')
      emit('cancelAdd')
      MessagePlugin.success('Added')
    }
  })
}

</script>

<style lang="scss" scoped>
.avatarLists {
  max-height: 50vh;
  overflow-y: auto;
}
</style>