<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { NButton, NInput, NPopconfirm } from 'naive-ui'
// hooks
import { useDeleteDepartmentMutation } from '@/data/department'
// utils
import { renderIcon } from '@/utils'
// types
import type { Category, Department } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
// components
import DepartmentModal from './DepartmentModal.vue'
import QueryBarItem from '../query-bar/QueryBarItem.vue'
import QueryBar from '../query-bar/QueryBar.vue'

// Define props
const props = defineProps<{
  loading: boolean
  tableData: Department[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

const searchValue = ref('')

// mutation
const { mutateAsync: deleteDepartment } = useDeleteDepartmentMutation()

function onEdit(department: Department) {
  modal.open(DepartmentModal, {
    title: 'Edit Department',
    props: {
      department,
    },
  })
}

async function deleteRow(row: Category) {
  await deleteDepartment({ id: row.id })
}

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'search', value: string): void
  (e: 'reset'): void
}>()

function handleSearch() {
  emit('search', searchValue.value)
}

function handleReset() {
  searchValue.value = ''
  emit('reset')
}

const pagination = computed(() => ({
  page: props.page,
  pageSize: props.pageSize,
  itemCount: props.paginatorInfo?.total ?? 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePage: (page: number) => {
    emit('update:page', page)
  },
  onUpdatePageSize: (pageSize: number) => {
    emit('update:pageSize', pageSize)
  },
}))

const columns = [
  {
    title: 'Name',
    key: 'name',
    width: 'auto',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Description',
    key: 'desc',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 'auto',
    align: 'center',
    fixed: 'right',
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 8px;',
            onClick: () => onEdit(row),
          },
          { default: () => 'Edit', icon: renderIcon('material-symbols:edit', { size: 16 }) },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteRow(row),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  style: 'margin-left: 8px;',
                },
                {
                  default: () => 'Delete',
                  icon: renderIcon('material-symbols:delete-outline', { size: 16 }),
                },
              ),
            default: () => 'Are you sure?',
          },
        ),
      ]
    },
  },
]
</script>

<template>
  <query-bar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <query-bar-item label="Department name" :label-width="100">
      <n-input
        v-model:value="searchValue"
        clearable
        type="text"
        placeholder="Name"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
  </query-bar>

  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
</template>
