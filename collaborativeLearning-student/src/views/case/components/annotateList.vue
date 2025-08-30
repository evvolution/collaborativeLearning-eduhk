<template>
  <div class="notes" ref="notes">
    <t-tabs :default-value="1">
      <t-tab-panel :value="1" label="Group">
        <studentAnnotate :caseId="currentCaseId"/>
      </t-tab-panel>
      <t-tab-panel :value="2" label="Teacher">
        <teacherAnnotate :caseId="currentCaseId"/>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script setup lang="tsx">
import studentAnnotate from './studentAnnotate.vue'
import teacherAnnotate from './teacherAnnotate.vue'

const props = defineProps({
  currentCaseId: Number
})

</script>

<style lang="scss" scoped>
.notes {
  height: 100%;
}
</style>