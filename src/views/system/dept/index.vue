<script setup lang="ts">
import { NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useDepartmentsQuery } from '@/data/department'
// components
import TheIcon from '@/components/icon/TheIcon.vue'
import CommonPage from '@/components/page/CommonPage.vue'
import DepartmentList from '@/components/department/DepartmentList.vue'
import DepartmentModal from '@/components/department/DepartmentModal.vue'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(5)

// query
const { departments, paginationInfo, loading } = useDepartmentsQuery({
  page, pageSize
})
// store hooks
const modal = useModalStore()

console.log('paginationInfo-------------------------: ', paginationInfo)

if (loading) false;

function openCreateModal() {
  modal.open(DepartmentModal, {
    title: 'Create Department',
  })
}

</script>

<template>
  <CommonPage show-footer title="Department List">
    <template #action>
      <div>
        <NButton class="float-right mr-15" type="primary" @click="openCreateModal">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create new
        </NButton>
      </div>
    </template>
    <!-- <DepartmentList
      :page="5"
      :limit="5"
      :page-size="5"
      :loading="loading"
      :table-data="departments"
      :paginator-info="paginationInfo"
    /> -->
  </CommonPage>
</template>
