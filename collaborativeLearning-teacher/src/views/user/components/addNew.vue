<template>
  <t-dialog 
    :visible="show"
    :closeBtn="false"
    :closeOnOverlayClick="false"
    header="Add New User"
    width="50%"
    :destroyOnClose="true"
    @confirm="confirmAdd"
    @cancel="cancelAdd"
    @opened="init"
  >
    <t-form label-align="top">
      <t-row :gutter="12" style="width: 100%;">
        <t-col :span="6">
          <t-form-item label="Username">
            <t-input v-model="userData.username" />
          </t-form-item>
          <t-form-item label="Fullname">
            <t-input v-model="userData.name" />
          </t-form-item>
          <t-form-item label="Group">
            <t-select v-model="userData.groupNum">
              <t-option
                v-for="item in groupData"
                :value="item.value"
                :label="item.label"
              ></t-option>
            </t-select>
          </t-form-item>
          <t-form-item label="Gender">
            <t-select v-model="userData.sex">
              <t-option value="0" label="Male"></t-option>
              <t-option value="1" label="Female"></t-option>
            </t-select>
          </t-form-item>
        </t-col>
        <t-col :span="6" >
          <t-form-item label="Avatar">
            <t-radio-group
              v-model="userData.head"
              size="small" 
              @change="getCurrentRadio"
            >
              <div class="avatarLists">
                <t-radio-button 
                  v-for="(item, index) in 74"
                  :value="pngUrl(`defaultAvatar${index}`)" 
                  style="width: 100px; height: 100px; padding: 6px;"
                  variant="primary-filled"
                >
                  <t-image :src="pngUrl(`defaultAvatar${index}`)" style="width: 88px; height: 88px;"></t-image>
                </t-radio-button>
              </div>
            </t-radio-group>
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { addStudent, getGroupList } from '@/api/modules/users'
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

const getCurrentRadio = (e: any) => {
  userData.value.head = e
}

const userData = ref<any>({})
const groupData = ref<any>([])
const userDefaultAvatars = ref<any>([])
const init = () => {
  groupData.value = []
  getGroupList()
  .then((res)=> {
    for (let i = 0; i < res.data.length; i++) {
      groupData.value.push({
        label: res.data[i].name,
        value: res.data[i].id
      })
    }
  })
  // for ( let i = 0; i < 74; i++ ) {
  //   userDefaultAvatars.value.push(pngUrl(`defaultAvatar${i}`))
  // } 
}

const confirmAdd = () => {
  console.log(userData.value)
  // return
  addStudent(userData.value)
  .then((res: any)=> {
    if (res.code == 200) {
      MessagePlugin.success('Added')
      emit('confirmAdd')
      emit('cancelAdd')
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