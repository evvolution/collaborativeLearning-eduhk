<template>
  <t-dialog
    :closeBtn="false"
    :header="`Edit`"
    :visible="visible"
    @cancel="cancelEdit"
    @confirm="confirmEdit"
  >
    <t-form>
      <t-form-item label="Username">
        <t-input v-model="userData.username" readonly/>
      </t-form-item>
      <t-form-item label="Fullname">
        <t-input v-model="userData.name" />
      </t-form-item>
      <t-form-item label="Group">
        <t-input v-model="userData.groupName" readonly/>
      </t-form-item>
      <t-form-item label="Gender">
        <t-select v-model="userData.sex">
          <t-option value="0" label="Male"></t-option>
          <t-option value="1" label="Female"></t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { updateStudent } from '@/api/modules/users';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

const props = defineProps({
  visible: {
    default: false,
    type: Boolean
  },
  userData: {
    default: ()=>{},
    type: Object
  }
})
const emit = defineEmits(['confirmEdit', 'cancelEdit'])
const cancelEdit = () => {
  emit('cancelEdit')
}
const confirmEdit = () => {
  updateStudent(props.userData)
  .then((res: any)=> {
    if (res.code == 200) {
      MessagePlugin.success('Edited')
      emit('confirmEdit')
      emit('cancelEdit')
    }
  })
}

</script>

<style lang="scss" scoped>

</style>