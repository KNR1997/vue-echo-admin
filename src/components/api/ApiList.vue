<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { NButton, NPopconfirm } from 'naive-ui'
// hooks
import { useDeleteDepartmentMutation } from '@/data/department'
// utils
import { renderIcon } from '@/utils'
// types
import type { Api, Category, Department } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
import ApiModal from './ApiModal.vue'
import { useDeleteApiMutation } from '@/data/api.ts'
// components

// Define props
const props = defineProps<{
  loading: boolean
  tableData: Api[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

const queryItems = ref({})

// mutation
const { mutateAsync: deleteApi} = useDeleteApiMutation()

function onEdit(api: Api) {
  modal.open(ApiModal, {
    title: 'Edit Api',
    props: {
      api,
    },
  })
}

async function deleteRow(row: Category) {
  await deleteApi({ id: row.id })
}

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()

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
    title: 'API Path',
    key: 'path',
    width: 'auto',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Request Method',
    key: 'method',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
    {
    title: 'API Description ',
    key: 'summary',
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
  <!-- <QueryBar mb-30 @search="" @reset="">
    <slot name="queryBar" />
    <QueryBarItem label="部门名称" :label-width="80">
      <NInput
        v-model:value="queryItems.name"
        clearable
        type="text"
        placeholder="Name"
        @keypress.enter="$table?.handleSearch()"
      />
    </QueryBarItem>
  </QueryBar> -->

  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
</template>
