<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NLayout, NLayoutSider, NLayoutContent, NTree } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useUserPaginatedQuery } from '@/data/user'
import { useDepartmentsQuery } from '@/data/department'
// components
import TheIcon from '@/components/icon/TheIcon.vue'
import UserList from '@/components/user/UserList.vue'
import CommonPage from '@/components/page/CommonPage.vue'
import UserCreateUpdateModal from '@/components/user/UserCreateUpdateModal.vue'

const page = ref(1)
const pageSize = ref(10)
const searchUsername = ref('')
const searchEmail = ref('')
const selectedDepartmentId = ref<number | null>(null) // Add department filter

// Add debounce to prevent too many API calls
let searchTimeout: ReturnType<typeof setTimeout>

// Handle search from child component
function handleSearch(filters: { username: string; email: string }) {
  // Clear previous timeout
  if (searchTimeout) clearTimeout(searchTimeout)

  // Debounce search
  searchTimeout = setTimeout(() => {
    searchUsername.value = filters.username
    searchEmail.value = filters.email
    page.value = 1 // Reset to first page on search
  }, 500)
}

// Handle reset
function handleReset() {
  searchUsername.value = ''
  searchEmail.value = ''
  selectedDepartmentId.value = null // Reset department filter
  page.value = 1
}

// Handle department selection
function handleDepartmentSelect(keys: string[] | number[] | null) {
  if (keys && keys.length > 0) {
    selectedDepartmentId.value = Number(keys[0])
  } else {
    selectedDepartmentId.value = null
  }
  page.value = 1 // Reset to first page when department changes
}

// query
const { users, paginationInfo, loading } = useUserPaginatedQuery({
  page,
  page_size: pageSize,
  username: searchUsername,
  email: searchEmail,
  dept_id: selectedDepartmentId,
})

const { departments } = useDepartmentsQuery({
  page: 1,
  page_size: 100, // Increase to get all departments for the tree
})

// store hooks
const modal = useModalStore()

function openCreateModal() {
  modal.open(UserCreateUpdateModal, {
    title: 'Create User',
  })
}
</script>

<template>
  <NLayout has-sider wh-full>
    <NLayoutSider
      bordered
      content-style="padding: 24px;"
      :collapsed-width="0"
      :width="240"
      show-trigger="arrow-circle"
    >
      <div style="margin-bottom: 16px;">
        <h1 style="margin-bottom: 8px;">Department list</h1>
        <NButton 
          v-if="selectedDepartmentId" 
          size="small" 
          quaternary 
          @click="selectedDepartmentId = null"
        >
          Clear filter
        </NButton>
      </div>
      <NTree 
        block-line 
        :data="departments" 
        key-field="id" 
        label-field="name" 
        :selected-keys="selectedDepartmentId ? [selectedDepartmentId] : []"
        @update:selected-keys="handleDepartmentSelect"
        default-expand-all
      />
    </NLayoutSider>

    <NLayoutContent>
      <CommonPage show-footer title="User List">
        <template #action>
          <div>
            <NButton class="float-right mr-15" type="primary" @click="openCreateModal">
              <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create new
            </NButton>
          </div>
        </template>
        <UserList
          :loading="loading"
          :table-data="users"
          :paginatorInfo="paginationInfo"
          :page="page"
          :page-size="pageSize"
          @update:page="page = $event"
          @update:page-size="pageSize = $event"
          @search="handleSearch"
          @reset="handleReset"
        />
      </CommonPage>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
/* Optional: Add some styling for the department tree */
:deep(.n-tree-node-content) {
  cursor: pointer;
}

:deep(.n-tree-node--selected .n-tree-node-content) {
  background-color: var(--primary-color-opacity-1);
}
</style>