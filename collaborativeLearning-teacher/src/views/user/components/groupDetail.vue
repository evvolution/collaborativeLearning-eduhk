<template>
  <t-dialog
    :closeBtn="false"
    :cancelBtn="null"
    confirmBtn="OK"
    :header="`Group Detail`"
    :visible="visible"
    @confirm="cancelEdit"
    @opened="getGroupData"
  >

  </t-dialog>
</template>

<script setup lang="ts">
import { getGroupDetail } from '@/api/modules/users';

const props = defineProps({
  visible: {
    default: false,
    type: Boolean
  },
  id: {
    default: 0,
    type: Number
  }
})
const emit = defineEmits(['cancelEdit'])
const cancelEdit = () => {
  emit('cancelEdit')
}

const getGroupData = () => {
  getGroupDetail(props.id)
  .then((res: any)=> {
    if (res.code == 200) {

    }
  })
}
</script>

<style lang="scss" scoped>

</style>